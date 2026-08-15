import { useState, useCallback } from 'react';
import { factions, SUB_FACTION_IDS } from '../data/factions.js';
import { keywords } from '../data/keywords.js';

const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

function parseWahapediaCsv(text) {
  const lines = text.replace(/^﻿/, '').replace(/\r/g, '').trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split('|').map(h => h.trim());
  return lines.slice(1).map(line => {
    const vals = line.split('|');
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (vals[i] || '').trim(); });
    return obj;
  });
}

function matchFactionIds(appName, factionRows) {
  if (SUB_FACTION_IDS[appName]) return new Set(SUB_FACTION_IDS[appName]);
  const norm = s => s.toLowerCase().replace(/['’‘]/g, '').replace(/[^a-z0-9]/g, '');
  const n = norm(appName);
  const ids = new Set();
  for (const f of factionRows) {
    const fname = norm(f.name || '');
    if (fname && (fname === n || fname.includes(n) || n.includes(fname))) {
      if (f.id) ids.add(f.id);
    }
  }
  return ids;
}

async function fetchLocalCsv(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error(r.status);
  const text = await r.text();
  if (!text || text.replace(/^﻿/, '').trim().length < 50) throw new Error('empty');
  return text;
}

async function fetchText(url) {
  const enc = encodeURIComponent(url);
  const strategies = [
    async () => {
      const r = await fetch(`https://api.allorigins.win/get?url=${enc}`);
      if (!r.ok) throw new Error(r.status);
      const j = await r.json();
      if (!j.contents) throw new Error('empty');
      return j.contents;
    },
    async () => {
      const r = await fetch(`https://corsproxy.io/?url=${enc}`);
      if (!r.ok) throw new Error(r.status);
      return r.text();
    },
    async () => {
      const r = await fetch(`https://api.allorigins.win/raw?url=${enc}`);
      if (!r.ok) throw new Error(r.status);
      return r.text();
    },
    async () => {
      const r = await fetch(url);
      if (!r.ok) throw new Error(r.status);
      return r.text();
    },
  ];
  for (const fn of strategies) {
    try {
      const text = await fn();
      if (text && text.trim().length > 200 && (text.indexOf('|') < 80 || text.indexOf(',') < 80)) return text;
    } catch (_) { /* try next */ }
  }
  throw new Error('All fetch attempts failed');
}

// Editions tried in order — 11th ed if published, otherwise 10th.
const WAHAPEDIA_EDITIONS = ['wh40k11ed', 'wh40k10ed'];

// Fetch a Wahapedia CSV, trying each edition path until one returns usable data.
async function fetchWahapediaCsv(file) {
  let lastErr;
  for (const ed of WAHAPEDIA_EDITIONS) {
    try {
      return await fetchText(`https://wahapedia.ru/${ed}/${file}`);
    } catch (e) { lastErr = e; }
  }
  throw lastErr || new Error(`Could not fetch ${file}`);
}

export function wahapediaPhaseId(wPhase) {
  const p = (wPhase || '').toLowerCase();
  if (p.includes('command')) return 'command';
  if (p.includes('movement') || p === 'move') return 'movement';
  if (p.includes('shoot')) return 'shooting';
  if (p.includes('charge') || p.includes('heroic')) return 'charge';
  if (p.includes('fight')) return 'fight';
  if (p.includes('battle round') || p.includes('morale')) return 'any';
  return 'any';
}

export function useWahapedia(gameConfig) {
  const [wahapedia, setWahapedia] = useState({
    loading: false, loaded: false, error: null,
    factionRows: [], stratagemRows: [], datasheetRows: [], datasheetAbilityRows: [],
  });
  const [factionStrats, setFactionStrats] = useState({ player: [], enemy: [], universal: [] });

  const buildFactionStrats = useCallback((wh, config) => {
    const { factionRows, stratagemRows } = wh;
    const pIds = matchFactionIds(config.playerFaction, factionRows);
    const eIds = matchFactionIds(config.enemyFaction, factionRows);

    function detMatches(s, chosenDet) {
      const d = s.detachment || '';
      const isUniversal = d === '' || d === '-';
      if (!chosenDet) return isUniversal;
      return isUniversal || d === chosenDet;
    }

    const player = stratagemRows.filter(s => pIds.has(s.faction_id) && detMatches(s, config.playerDetachment));
    const enemy  = stratagemRows.filter(s => eIds.has(s.faction_id) && detMatches(s, config.enemyDetachment));
    const CORE_PREFIXES = ['Core –', 'Core Stratagem –'];
    const coreRows = stratagemRows.filter(s =>
      !s.faction_id && CORE_PREFIXES.some(p => (s.type || '').startsWith(p))
    );
    const universal = coreRows.filter((s, i, arr) => arr.findIndex(x => x.name === s.name) === i);
    setFactionStrats({ player, enemy, universal });
  }, []);

  const getAvailableDetachments = useCallback((appFactionName) => {
    if (!wahapedia.loaded || !appFactionName) return [];
    const ids = matchFactionIds(appFactionName, wahapedia.factionRows);
    const dets = new Set();
    for (const s of wahapedia.stratagemRows) {
      if (ids.has(s.faction_id) && s.detachment && s.detachment !== '-') {
        dets.add(s.detachment);
      }
    }
    return [...dets].sort();
  }, [wahapedia]);

  const loadUnitData = useCallback(async () => {
    try {
      const base = import.meta.env.BASE_URL || '/';
      const [dt, at] = await Promise.all([
        fetchLocalCsv(`${base}Datasheets.csv`)
          .catch(() => fetchWahapediaCsv('Datasheets.csv')),
        fetchLocalCsv(`${base}Datasheets_abilities.csv`)
          .catch(() => fetchWahapediaCsv('Datasheets_abilities.csv')),
      ]);
      try { localStorage.setItem('wh11_datasheets', dt); } catch (_) {}
      try { localStorage.setItem('wh11_datasheet_abilities', at); } catch (_) {}
      localStorage.setItem('wh11_units_cache_date', new Date().toISOString());
      setWahapedia(prev => ({
        ...prev,
        datasheetRows: parseWahapediaCsv(dt),
        datasheetAbilityRows: parseWahapediaCsv(at),
      }));
    } catch (_) { /* unit abilities unavailable — stratagems still work */ }
  }, []);

  const load = useCallback(async (config) => {
    if (wahapedia.loaded) { buildFactionStrats(wahapedia, config); return; }

    const cacheDate = localStorage.getItem('wh11_cache_date');
    const cacheAge = cacheDate ? Date.now() - new Date(cacheDate).getTime() : Infinity;
    const cf = localStorage.getItem('wh11_factions');
    const cs = localStorage.getItem('wh11_stratagems');
    const cd = localStorage.getItem('wh11_datasheets');
    const ca = localStorage.getItem('wh11_datasheet_abilities');
    const unitCacheDate = localStorage.getItem('wh11_units_cache_date');
    const unitCacheAge = unitCacheDate ? Date.now() - new Date(unitCacheDate).getTime() : Infinity;
    const unitsCached = cd && ca && unitCacheAge < CACHE_TTL;

    if (cf && cs && cacheAge < CACHE_TTL) {
      const wh = {
        loading: false, loaded: true, error: null,
        factionRows: parseWahapediaCsv(cf),
        stratagemRows: parseWahapediaCsv(cs),
        datasheetRows: unitsCached ? parseWahapediaCsv(cd) : [],
        datasheetAbilityRows: unitsCached ? parseWahapediaCsv(ca) : [],
      };
      setWahapedia(wh);
      buildFactionStrats(wh, config);
      if (!unitsCached) loadUnitData();
      return;
    }

    setWahapedia(prev => ({ ...prev, loading: true, error: null }));

    try {
      const base = import.meta.env.BASE_URL || '/';
      const [ft, st] = await Promise.all([
        fetchLocalCsv(`${base}Factions.csv`)
          .catch(() => fetchWahapediaCsv('Factions.csv')),
        fetchLocalCsv(`${base}Stratagems.csv`)
          .catch(() => fetchWahapediaCsv('Stratagems.csv')),
      ]);
      localStorage.setItem('wh11_factions', ft);
      localStorage.setItem('wh11_stratagems', st);
      localStorage.setItem('wh11_cache_date', new Date().toISOString());
      const wh = {
        loading: false, loaded: true, error: null,
        factionRows: parseWahapediaCsv(ft),
        stratagemRows: parseWahapediaCsv(st),
        datasheetRows: unitsCached ? parseWahapediaCsv(cd) : [],
        datasheetAbilityRows: unitsCached ? parseWahapediaCsv(ca) : [],
      };
      setWahapedia(wh);
      buildFactionStrats(wh, config);
      if (!unitsCached) loadUnitData();
    } catch (e) {
      if (cf && cs) {
        const wh = {
          loading: false, loaded: true, error: null,
          factionRows: parseWahapediaCsv(cf),
          stratagemRows: parseWahapediaCsv(cs),
          datasheetRows: unitsCached ? parseWahapediaCsv(cd) : [],
          datasheetAbilityRows: unitsCached ? parseWahapediaCsv(ca) : [],
        };
        setWahapedia(wh);
        buildFactionStrats(wh, config);
      } else {
        setWahapedia(prev => ({
          ...prev, loading: false,
          error: 'Faction stratagems unavailable — check connection.',
        }));
      }
    }
  }, [wahapedia, buildFactionStrats, loadUnitData]);

  const prefetch = useCallback(async (config) => {
    if (wahapedia.loaded || wahapedia.loading) {
      if (wahapedia.loaded) buildFactionStrats(wahapedia, config);
      return;
    }
    const cacheDate = localStorage.getItem('wh11_cache_date');
    const cacheAge = cacheDate ? Date.now() - new Date(cacheDate).getTime() : Infinity;
    const cf = localStorage.getItem('wh11_factions');
    const cs = localStorage.getItem('wh11_stratagems');
    const cd = localStorage.getItem('wh11_datasheets');
    const ca = localStorage.getItem('wh11_datasheet_abilities');
    const unitCacheDate = localStorage.getItem('wh11_units_cache_date');
    const unitCacheAge = unitCacheDate ? Date.now() - new Date(unitCacheDate).getTime() : Infinity;
    const unitsCached = cd && ca && unitCacheAge < CACHE_TTL;

    if (cf && cs && cacheAge < CACHE_TTL) {
      const wh = {
        loading: false, loaded: true, error: null,
        factionRows: parseWahapediaCsv(cf),
        stratagemRows: parseWahapediaCsv(cs),
        datasheetRows: unitsCached ? parseWahapediaCsv(cd) : [],
        datasheetAbilityRows: unitsCached ? parseWahapediaCsv(ca) : [],
      };
      setWahapedia(wh);
      buildFactionStrats(wh, config);
      if (!unitsCached) loadUnitData();
      return;
    }
    // No fresh cache — fetch in the background so detachment dropdowns populate
    setWahapedia(prev => ({ ...prev, loading: true, error: null }));
    try {
      const base = import.meta.env.BASE_URL || '/';
      const [ft, st] = await Promise.all([
        fetchLocalCsv(`${base}Factions.csv`)
          .catch(() => fetchWahapediaCsv('Factions.csv')),
        fetchLocalCsv(`${base}Stratagems.csv`)
          .catch(() => fetchWahapediaCsv('Stratagems.csv')),
      ]);
      localStorage.setItem('wh11_factions', ft);
      localStorage.setItem('wh11_stratagems', st);
      localStorage.setItem('wh11_cache_date', new Date().toISOString());
      const wh = {
        loading: false, loaded: true, error: null,
        factionRows: parseWahapediaCsv(ft),
        stratagemRows: parseWahapediaCsv(st),
        datasheetRows: [],
        datasheetAbilityRows: [],
      };
      setWahapedia(wh);
      buildFactionStrats(wh, config);
      loadUnitData();
    } catch (e) {
      if (cf && cs) {
        const wh = {
          loading: false, loaded: true, error: null,
          factionRows: parseWahapediaCsv(cf),
          stratagemRows: parseWahapediaCsv(cs),
          datasheetRows: [],
          datasheetAbilityRows: [],
        };
        setWahapedia(wh);
        buildFactionStrats(wh, config);
      } else {
        setWahapedia(prev => ({ ...prev, loading: false, error: null }));
      }
    }
  }, [wahapedia, buildFactionStrats, loadUnitData]);

  return { wahapedia, factionStrats, load, prefetch, getAvailableDetachments, buildFactionStrats };
}
