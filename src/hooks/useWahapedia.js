import { useState, useCallback } from 'react';
import { factions, SUB_FACTION_IDS } from '../data/factions.js';
import { keywords } from '../data/keywords.js';

const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

function parseWahapediaCsv(text) {
  const lines = text.replace(/^\uFEFF/, '').replace(/\r/g, '').trim().split('\n');
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
  const norm = s => s.toLowerCase().replace(/['\u2019\u2018]/g, '').replace(/[^a-z0-9]/g, '');
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
  if (!text || text.replace(/^\uFEFF/, '').trim().length < 50) throw new Error('empty');
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
      if (text && text.trim().length > 200 && text.indexOf(',') < 80) return text;
    } catch (_) { /* try next */ }
  }
  throw new Error('All fetch attempts failed');
}

export function wahapediaPhaseId(wPhase) {
  const p = (wPhase || '').toLowerCase();
  if (p.includes('command')) return 'command';
  if (p.includes('movement') || p === 'move') return 'movement';
  if (p.includes('shoot')) return 'shooting';
  if (p.includes('charge') || p.includes('heroic')) return 'charge';
  if (p.includes('fight')) return 'fight';
  if (p.includes('end') || p.includes('battle round') || p.includes('morale')) return 'end';
  return 'any';
}

export function useWahapedia(gameConfig) {
  const [wahapedia, setWahapedia] = useState({
    loading: false, loaded: false, error: null, factionRows: [], stratagemRows: [],
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

  const load = useCallback(async (config) => {
    if (wahapedia.loaded) { buildFactionStrats(wahapedia, config); return; }

    const cacheDate = localStorage.getItem('wh_cache_date');
    const cacheAge = cacheDate ? Date.now() - new Date(cacheDate).getTime() : Infinity;
    const cf = localStorage.getItem('wh_factions');
    const cs = localStorage.getItem('wh_stratagems');

    if (cf && cs && cacheAge < CACHE_TTL) {
      const wh = {
        loading: false, loaded: true, error: null,
        factionRows: parseWahapediaCsv(cf),
        stratagemRows: parseWahapediaCsv(cs),
      };
      setWahapedia(wh);
      buildFactionStrats(wh, config);
      return;
    }

    setWahapedia(prev => ({ ...prev, loading: true, error: null }));

    try {
      const [ft, st] = await Promise.all([
        fetchLocalCsv('/Factions.csv')
          .catch(() => fetchText('https://wahapedia.ru/wh40k10ed/Factions.csv')),
        fetchLocalCsv('/Stratagems.csv')
          .catch(() => fetchText('https://wahapedia.ru/wh40k10ed/Stratagems.csv')),
      ]);
      localStorage.setItem('wh_factions', ft);
      localStorage.setItem('wh_stratagems', st);
      localStorage.setItem('wh_cache_date', new Date().toISOString());
      const wh = {
        loading: false, loaded: true, error: null,
        factionRows: parseWahapediaCsv(ft),
        stratagemRows: parseWahapediaCsv(st),
      };
      setWahapedia(wh);
      buildFactionStrats(wh, config);
    } catch (e) {
      if (cf && cs) {
        const wh = {
          loading: false, loaded: true, error: null,
          factionRows: parseWahapediaCsv(cf),
          stratagemRows: parseWahapediaCsv(cs),
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
  }, [wahapedia, buildFactionStrats]);

  const prefetch = useCallback(async (config) => {
    if (wahapedia.loaded || wahapedia.loading) {
      if (wahapedia.loaded) buildFactionStrats(wahapedia, config);
      return;
    }
    const cacheDate = localStorage.getItem('wh_cache_date');
    const cacheAge = cacheDate ? Date.now() - new Date(cacheDate).getTime() : Infinity;
    const cf = localStorage.getItem('wh_factions');
    const cs = localStorage.getItem('wh_stratagems');
    if (cf && cs && cacheAge < CACHE_TTL) {
      const wh = {
        loading: false, loaded: true, error: null,
        factionRows: parseWahapediaCsv(cf),
        stratagemRows: parseWahapediaCsv(cs),
      };
      setWahapedia(wh);
      buildFactionStrats(wh, config);
    }
  }, [wahapedia, buildFactionStrats]);

  return { wahapedia, factionStrats, load, prefetch, getAvailableDetachments, buildFactionStrats };
}
