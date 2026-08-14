import { factions, SUB_FACTION_IDS } from '../data/factions.js';
import { keywords, normalizeKeyword, scanTextForKeywords } from '../data/keywords.js';

function detectFaction(text) {
  const upper = text.toUpperCase();
  // Check sub-factions first so e.g. 'Blood Angels' beats 'Space Marines'
  const subMatch = Object.keys(SUB_FACTION_IDS)
    .sort((a, b) => b.length - a.length)
    .find(f => upper.includes(f.toUpperCase()));
  if (subMatch) return subMatch;
  return [...factions].sort((a, b) => b.length - a.length)
    .find(f => upper.includes(f.toUpperCase())) || null;
}

export function matchDetachment(raw, availableDetachments) {
  if (!raw || !availableDetachments.length) return null;
  const lower = raw.toLowerCase().trim();
  const exact = availableDetachments.find(d => d.toLowerCase() === lower);
  if (exact) return exact;
  return availableDetachments.find(d =>
    lower.includes(d.toLowerCase()) || d.toLowerCase().includes(lower)
  ) || null;
}

function detectDetachment(text, faction, availableDetachments = []) {
  const explicit = text.match(/detachment[:\s]+([^\n\r+\[]+)/i);
  if (explicit) {
    const c = explicit[1].trim();
    if (c.length > 2) return c;
  }

  const bsHeader = text.match(/\+\+\s*[^:\n]+:\s*([^[+\n\r]+)/i);
  if (bsHeader) {
    const c = bsHeader[1].trim();
    if (c.length > 2) return c;
  }

  if (availableDetachments.length && faction) {
    for (const line of text.split('\n')) {
      const trimmed = line.trim();
      const match = availableDetachments.find(d => d.toLowerCase() === trimmed.toLowerCase());
      if (match) return match;
    }
    const upper = text.toUpperCase();
    const sub = availableDetachments.find(d => upper.includes(d.toUpperCase()));
    if (sub) return sub;
  }

  // Strategy: line immediately after faction name, before a game-size line (e.g. Warhammer app export)
  if (faction) {
    const gameSizeLine = /^(combat patrol|incursion|strike force|onslaught|patrol|boarding action)\s*\(/i;
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    for (let i = 0; i < lines.length - 1; i++) {
      if (lines[i].toLowerCase() === faction.toLowerCase()) {
        const candidate = lines[i + 1];
        if (
          candidate.length >= 3 &&
          candidate.length <= 60 &&
          !gameSizeLine.test(candidate) &&
          !/^[+\-·*•]/.test(candidate)
        ) return candidate;
      }
    }
  }

  const detKw = /\b(task force|warband|brotherhood|spearhead|vanguard|host|nexus|patrol|phalanx|tide|praetor|gladius|anvil|outrider|crusade|conclave|talons?|claws?|fangs?|blades?|wings?|shield|guard)\b/i;
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.length < 5 || trimmed.length > 55) continue;
    if (/\d/.test(trimmed)) continue;
    if (/^[+\-·*]/.test(trimmed)) continue;
    if (detKw.test(trimmed)) return trimmed;
  }
  return null;
}

function detectFactionFromXml(doc) {
  const force = doc.querySelector('forces > force');
  if (!force) return null;
  const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const catalogueName = norm(force.getAttribute('catalogueName') || '');
  const byName = [...factions].sort((a, b) => b.length - a.length).find(f => {
    const n = norm(f);
    return n === catalogueName || catalogueName.includes(n) || n.includes(catalogueName);
  }) || null;

  const SUB_FACTION_PARENTS = {
    'Black Templars': 'Space Marines',
    'Blood Angels': 'Space Marines',
    'Dark Angels': 'Space Marines',
    'Deathwatch': 'Space Marines',
    'Space Wolves': 'Space Marines',
  };
  const subFactionCandidates = Object.keys(SUB_FACTION_IDS)
    .filter(sf => !byName || SUB_FACTION_PARENTS[sf] === byName);

  if (subFactionCandidates.length) {
    const allCategoryText = Array.from(doc.querySelectorAll('category'))
      .map(el => norm(el.getAttribute('name') || '')).join(' ');
    const detected = subFactionCandidates
      .sort((a, b) => b.length - a.length)
      .find(sf => allCategoryText.includes(norm(sf)));
    if (detected) return detected;
  }
  return byName;
}

function detectDetachmentFromXml(doc, faction, availableDetachments = []) {
  const force = doc.querySelector('forces > force');
  if (!force) return null;

  const candidates = [];
  force.querySelectorAll(':scope > rules > rule').forEach(r => candidates.push(r.getAttribute('name') || ''));
  force.querySelectorAll(':scope > selections > selection').forEach(s => candidates.push(s.getAttribute('name') || ''));
  candidates.push(force.getAttribute('name') || '');

  if (availableDetachments.length && faction) {
    for (const c of candidates) {
      const match = availableDetachments.find(d => d.toLowerCase() === c.trim().toLowerCase());
      if (match) return match;
    }
  }

  const detPattern = /task force|warband|brotherhood|spearhead|vanguard|host|nexus|patrol|phalanx|tide|praetor|gladius|anvil|storm|firestorm|outrider/i;
  return candidates.find(c => c && detPattern.test(c)) || null;
}

export function parseRosXml(xmlText) {
  const doc = new DOMParser().parseFromString(xmlText, 'application/xml');
  if (doc.querySelector('parsererror')) throw new Error('Could not parse XML — is this a valid .ros file?');

  const units = [];
  const activeKeywords = new Set();

  doc.querySelectorAll('forces > force > selections > selection').forEach(el => {
    const type = el.getAttribute('type');
    // BattleScribe uses type="upgrade" for config entries (game size, faction ID,
    // character attachment slots). Only take actual playable selections.
    if (type && type !== 'unit' && type !== 'model') return;
    const raw = el.getAttribute('name');
    if (!raw) return;
    // Some roster apps embed the quantity in the name ("4x Intercessors") — strip it
    const name = raw.replace(/^\d+[x×]\s*/i, '').trim();
    if (name) units.push(name);
  });

  doc.querySelectorAll('category').forEach(el => {
    const name = (el.getAttribute('name') || '').trim();
    if (!name) return;
    const upper = name.toUpperCase();
    if (keywords[upper]) activeKeywords.add(upper);
    const norm = normalizeKeyword(name);
    if (norm) activeKeywords.add(norm);
  });

  doc.querySelectorAll('characteristic[name="Keywords"]').forEach(el => {
    const text = el.textContent.trim();
    if (!text || text === '-') return;
    text.split(',').forEach(kw => {
      const match = normalizeKeyword(kw);
      if (match) activeKeywords.add(match);
    });
  });

  doc.querySelectorAll('rule').forEach(el => {
    const match = normalizeKeyword(el.getAttribute('name') || '');
    if (match) activeKeywords.add(match);
    const desc = el.querySelector('description');
    if (desc) scanTextForKeywords(desc.textContent.toUpperCase(), activeKeywords);
  });

  doc.querySelectorAll('profile').forEach(el => {
    el.querySelectorAll('characteristic').forEach(ch => {
      scanTextForKeywords(ch.textContent.toUpperCase(), activeKeywords);
    });
    const match = normalizeKeyword(el.getAttribute('name') || '');
    if (match) activeKeywords.add(match);
  });

  const unitSelections = {};
  doc.querySelectorAll('forces > force > selections > selection').forEach(el => {
    const type = el.getAttribute('type');
    if (type && type !== 'unit' && type !== 'model') return;
    const raw = el.getAttribute('name');
    if (!raw) return;
    const unitName = raw.replace(/^\d+[x×]\s*/i, '').trim();
    if (!unitName) return;
    const names = new Set();
    el.querySelectorAll('selection[type="upgrade"]').forEach(sel => {
      const n = (sel.getAttribute('name') || '').trim();
      if (n) names.add(n.toLowerCase());
    });
    if (names.size) unitSelections[unitName] = [...names];
  });

  const faction = detectFactionFromXml(doc);
  const detachment = detectDetachmentFromXml(doc, faction);
  return { units, activeKeywords, faction, detachment, unitSelections };
}

export function parseTextRoster(text) {
  const activeKeywords = new Set();
  scanTextForKeywords(text.toUpperCase(), activeKeywords);

  // Unit lines in every major format (New Recruit, Warhammer app, BattleScribe text)
  // always carry a points value. Category headers, weapons, abilities, and model
  // sub-entries never do — so matching on the pts bracket is the cleanest filter.
  // Patterns handled: "[80pts]", "[80 pts]", "(80pts)", "(80 points)", "[6 PL, 80pts]"
  const HAS_PTS = /[\[(][^\]\)]*\b\d[\d,]*\s*pts?[\s\]\),]/i;
  const GAME_SIZE = /^(combat patrol|incursion|strike force|onslaught|boarding action|patrol)\b/i;

  const units = [];
  const seen = new Set();

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;
    // Skip structural markers and indented sub-entries
    if (/^[+=.•·*]/.test(line)) continue;
    if (!HAS_PTS.test(line)) continue;

    // Strip the pts/PL bracket and everything after it, then clean up the name
    let name = line
      .replace(/\s*[\[(][^\]\)]*\b\d[\d,]*\s*pts?[\s\S]*$/i, '')
      .replace(/^\d+[x×]\s*/i, '')  // leading "3x " or "3× " quantity
      .replace(/^[\d]+\s+/, '')      // leading bare number "5 "
      .replace(/:\s*$/, '')          // trailing colon
      .replace(/^[-–•·]\s*/, '')     // leading bullet/dash
      .trim();

    if (!name || name.length < 3 || name.length > 60) continue;
    if (GAME_SIZE.test(name)) continue;
    if (/^(army roster|total|grand total|points total|enhancement)/i.test(name)) continue;

    const key = name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      units.push(name);
    }
  }

  const faction = detectFaction(text);
  const detachment = detectDetachment(text, faction);
  return { units: units.slice(0, 40), activeKeywords, faction, detachment, unitSelections: {} };
}

export function looksLikeWarhammer(text) {
  const upper = text.toUpperCase();
  const terms = ['PTS', 'POINTS', ' CP', 'DETACHMENT', 'ENHANCEMENT', 'WARLORD',
    'DATASHEET', 'BATTLESCRIBE', 'NEW RECRUIT', 'OPR'];
  if (terms.some(t => upper.includes(t))) return true;
  if (factions.some(f => upper.includes(f.toUpperCase()))) return true;
  for (const kw of Object.keys(keywords)) {
    const base = kw.replace(/ X\+?$/, '').replace(/ X"$/, '').replace(/\[KEYWORD\] /, '');
    if (upper.includes(base)) return true;
  }
  return false;
}
