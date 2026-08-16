// Inline CSV parser (mirrors useWahapedia parseWahapediaCsv)
function parseCsv(text) {
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

// fetch() has no default timeout — without this a single unresponsive proxy
// hangs the whole export indefinitely.
const FETCH_TIMEOUT_MS = 20000;

async function fetchWithTimeout(url, opts = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

function looksLikeCsv(text) {
  if (!text || text.trim().length < 100) return false;
  // Reject HTML error pages that a proxy may return with a 200
  if (/^\s*<(!doctype|html)/i.test(text)) return false;
  return text.indexOf('|') < 200;
}

async function fetchCsvText(url) {
  const enc = encodeURIComponent(url);
  const strategies = [
    async () => {
      const r = await fetchWithTimeout(`https://api.allorigins.win/raw?url=${enc}`);
      if (!r.ok) throw new Error(r.status);
      return r.text();
    },
    async () => {
      const r = await fetchWithTimeout(`https://corsproxy.io/?url=${enc}`);
      if (!r.ok) throw new Error(r.status);
      return r.text();
    },
    async () => {
      const r = await fetchWithTimeout(`https://api.allorigins.win/get?url=${enc}`);
      if (!r.ok) throw new Error(r.status);
      const j = await r.json();
      if (!j.contents) throw new Error('empty');
      return j.contents;
    },
    async () => {
      const r = await fetchWithTimeout(url);
      if (!r.ok) throw new Error(r.status);
      return r.text();
    },
  ];
  for (const fn of strategies) {
    try {
      const text = await fn();
      if (looksLikeCsv(text)) return text;
    } catch (_) { /* try next */ }
  }
  return null;
}

// Editions tried in order — 11th ed if published, otherwise 10th. Once one
// works we remember it, so later files don't retry the dead path.
const WAHAPEDIA_EDITIONS = ['wh40k11ed', 'wh40k10ed'];
let _liveEdition = null;

async function fetchCsvAnyEdition(file) {
  const order = _liveEdition
    ? [_liveEdition, ...WAHAPEDIA_EDITIONS.filter(e => e !== _liveEdition)]
    : WAHAPEDIA_EDITIONS;
  for (const ed of order) {
    const text = await fetchCsvText(`https://wahapedia.ru/${ed}/${file}`);
    if (text) { _liveEdition = ed; return text; }
  }
  return null;
}

// Module-level cache so repeated exports don't re-fetch
const _rowCache = {};

// Loads a Wahapedia CSV: memory cache → localStorage → network.
async function getRows(cacheKey, file) {
  if (_rowCache[cacheKey]) return _rowCache[cacheKey];

  const cached = localStorage.getItem(cacheKey);
  if (cached && cached.length > 200) {
    const rows = parseCsv(cached);
    if (rows.length) { _rowCache[cacheKey] = rows; return rows; }
  }

  const text = await fetchCsvAnyEdition(file);
  if (text) {
    try { localStorage.setItem(cacheKey, text); } catch (_) {}
    _rowCache[cacheKey] = parseCsv(text);
  } else {
    _rowCache[cacheKey] = [];
  }
  return _rowCache[cacheKey];
}

const getModelRows     = () => getRows('wh11_datasheet_models', 'Datasheets_models.csv');
const getWeaponRows    = () => getRows('wh11_datasheet_weapons', 'Datasheets_weapons.csv');
const getDatasheetRows = () => getRows('wh11_datasheets', 'Datasheets.csv');
const getAbilityRows   = () => getRows('wh11_datasheet_abilities', 'Datasheets_abilities.csv');
const getKeywordRows   = () => getRows('wh11_datasheet_keywords', 'Datasheets_keywords.csv');

function normalizeUnitName(s) {
  return s.toLowerCase()
    .replace(/^[\s•◦▪·*\-–—]+/, '')                  // strip leading bullets/dashes
    .replace(/\s*[\[(][^\])]*\b\d[\d,]*\s*(pts?|points?)[^\])]*[\])]/gi, '') // strip pts bracket
    .replace(/^\d+\s*[x×]\s*/i, '')                  // strip leading quantity "10x "
    .replace(/\s+squad$/i, '')                       // "Intercessor Squad" → "Intercessor"
    .replace(/s$/i, '')                              // normalise plural
    .replace(/\s+/g, ' ')
    .trim();
}

function matchesRosterUnit(rosterName, datasheetName) {
  const r = normalizeUnitName(rosterName);
  const d = normalizeUnitName(datasheetName);
  if (!r || !d) return false;
  // Exact normalised match
  if (r === d) return true;
  // One is a prefix of the other (e.g. "Captain" matches "Captain in Terminator Armour")
  if (d.startsWith(r + ' ') || r.startsWith(d + ' ')) return true;
  // Raw (un-normalised) exact match as a fallback
  const rRaw = rosterName.toLowerCase().replace(/\s*[\[(]?\d+\s*pts?[\])]?\s*/gi, '').trim();
  const dRaw = datasheetName.toLowerCase().trim();
  return rRaw === dRaw;
}

function weaponInSelection(wahapediaName, selections) {
  if (!selections || !selections.length) return true; // no filter — show all
  const base = wahapediaName.toLowerCase().replace(/\s+[–—-]\s+\S.*$/, '').trim();
  return selections.some(sel => {
    const s = sel.toLowerCase().trim();
    return s === base || s === wahapediaName.toLowerCase() || base.startsWith(s) || s.startsWith(base);
  });
}

function esc(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripPoints(name) {
  return name.replace(/\s*[\[(]?\d+\s*pts?[\])]?\s*/gi, '').trim();
}

function stripHtml(html) {
  return (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

// Wahapedia column names vary in case ("Sv", "Ld", "BS_WS"). Look up
// case-insensitively across a list of aliases and return the first real value.
function pick(row, ...aliases) {
  if (!row) return '';
  for (const alias of aliases) {
    if (row[alias] != null && row[alias] !== '') return row[alias];
  }
  const lowered = {};
  for (const k of Object.keys(row)) lowered[k.toLowerCase()] = row[k];
  for (const alias of aliases) {
    const v = lowered[alias.toLowerCase()];
    if (v != null && v !== '') return v;
  }
  return '';
}

function hasValue(v) {
  return v && v !== '-' && v !== '0' && v !== 'N/A';
}

function renderStats(ds, models) {
  // label shown on the card, then the aliases to look for in the CSV row
  const STATS = [
    ['M',  ['M']],
    ['T',  ['T']],
    ['SV', ['Sv', 'SV', 'save']],
    ['W',  ['W']],
    ['LD', ['Ld', 'LD', 'leadership']],
    ['OC', ['OC']],
  ];
  const hasModels = models && models.length > 0;

  // The invulnerable save lives on the model row (inv_sv), not the datasheet.
  const invulRaw = hasModels
    ? pick(models[0], 'inv_sv', 'invul_save', 'invulnerable_save')
    : pick(ds, 'invul_save');
  const invulHtml = hasValue(invulRaw)
    ? `<div class="invul">INV ${esc(invulRaw)}</div>` : '';

  if (!hasModels) {
    return invulHtml ? `<div class="stats-section"><div class="stat-row">${invulHtml}</div></div>` : '';
  }

  const rows = models.map((m, i) => {
    const labelHtml = models.length > 1
      ? `<div class="model-lbl">${esc(pick(m, 'name'))}</div>` : '';
    const cells = STATS.map(([label, aliases]) => {
      const val = pick(m, ...aliases) || '-';
      return `<div class="stat-box"><div class="stat-lbl">${label}</div><div class="stat-val">${esc(val)}</div></div>`;
    }).join('');
    return `${labelHtml}<div class="stat-row">${cells}${i === 0 ? invulHtml : ''}</div>`;
  }).join('');

  return `<div class="stats-section">${rows}</div>`;
}

function renderWeapons(weapons) {
  if (!weapons.length) return '';

  const isMelee = w => {
    const t = String(pick(w, 'type')).toLowerCase();
    if (t.includes('melee')) return true;
    if (t.includes('ranged')) return false;
    // No usable type column — fall back to the range value ("Melee" or a number)
    return /melee/i.test(String(pick(w, 'range')));
  };
  const ranged = weapons.filter(w => !isMelee(w));
  const melee  = weapons.filter(isMelee);

  function table(ws, isRanged) {
    if (!ws.length) return '';
    const label = isRanged ? 'RANGED WEAPONS' : 'MELEE WEAPONS';
    const thExtra = isRanged ? '<th>RNG</th>' : '';
    const head = `<thead><tr><th class="col-name">${label}</th>${thExtra}<th>A</th><th>${isRanged ? 'BS' : 'WS'}</th><th>S</th><th>AP</th><th>D</th><th class="col-kw">KEYWORDS</th></tr></thead>`;
    const rows = ws.map(w => {
      const name  = esc(pick(w, 'name') || '');
      const range = esc(pick(w, 'range', 'Range') || '-');
      const att   = esc(pick(w, 'A', 'attacks') || '-');
      // Wahapedia stores the single hit stat as BS_WS
      const skill = esc(pick(w, 'BS_WS', 'skill', 'BS', 'WS') || '-');
      const str   = esc(pick(w, 'S', 'strength') || '-');
      const ap    = esc(pick(w, 'AP', 'ap') || '-');
      const dmg   = esc(pick(w, 'D', 'damage') || '-');
      // Weapon abilities (Assault, Devastating Wounds, …) live in `description`
      const kw    = esc(stripHtml(pick(w, 'description', 'keywords')));
      const rangeCell = isRanged ? `<td>${range}</td>` : '';
      return `<tr><td class="col-name">${name}</td>${rangeCell}<td>${att}</td><td>${skill}</td><td>${str}</td><td>${ap}</td><td>${dmg}</td><td class="col-kw">${kw}</td></tr>`;
    }).join('');
    return `<table class="weapon-table">${head}<tbody>${rows}</tbody></table>`;
  }

  return `<div class="weapons-section">${table(ranged, true)}${table(melee, false)}</div>`;
}

function renderKeywords(kwRows) {
  if (!kwRows || !kwRows.length) return '';
  const faction = [];
  const normal = [];
  for (const r of kwRows) {
    const kw = pick(r, 'keyword');
    if (!kw) continue;
    const isFaction = String(pick(r, 'is_faction_keyword')).toLowerCase() === 'true';
    (isFaction ? faction : normal).push(kw);
  }
  const uniq = arr => [...new Set(arr)];
  const parts = [];
  if (normal.length) {
    parts.push(`<div class="kw-line"><span class="kw-lbl">KEYWORDS:</span> ${esc(uniq(normal).join(', '))}</div>`);
  }
  if (faction.length) {
    parts.push(`<div class="kw-line kw-faction"><span class="kw-lbl">FACTION:</span> ${esc(uniq(faction).join(', '))}</div>`);
  }
  return parts.length ? `<div class="keywords-section">${parts.join('')}</div>` : '';
}

function renderAbilities(abilities) {
  if (!abilities.length) return '';
  const items = abilities.map(ab => {
    const desc = stripHtml(ab.description || '');
    return `<div class="ab-row"><span class="ab-name">${esc(ab.name)}: </span><span class="ab-text">${esc(desc)}</span></div>`;
  }).join('');
  return `<div class="abilities-section"><div class="section-hdr">ABILITIES</div>${items}</div>`;
}

function renderCard(unitName, ds, models, weapons, abilities, kwRows) {
  const ptsVal = pick(ds, 'points', 'cost');
  const pts = hasValue(ptsVal) ? `<span class="pts">${esc(ptsVal)} pts</span>` : '';

  const damagedW = pick(ds, 'damaged_w');
  const damagedDesc = stripHtml(pick(ds, 'damaged_description'));
  const damaged = damagedW && hasValue(damagedDesc)
    ? `<div class="damaged"><span class="damaged-lbl">DAMAGED (${esc(damagedW)} WOUNDS REMAINING): </span>${esc(damagedDesc)}</div>`
    : '';

  const compVal = stripHtml(pick(ds, 'unit_composition', 'composition'));
  const comp = hasValue(compVal)
    ? `<div class="composition">COMPOSITION: ${esc(compVal)}</div>` : '';

  return `
<div class="card">
  <div class="card-hdr">
    <span class="unit-name">${esc(stripPoints(unitName))}</span>${pts}
  </div>
  ${renderStats(ds, models)}
  ${renderWeapons(weapons)}
  ${renderAbilities(abilities)}
  ${comp}
  ${damaged}
  ${renderKeywords(kwRows)}
</div>`;
}

function stubCard(unitName) {
  return `
<div class="card">
  <div class="card-hdr">
    <span class="unit-name">${esc(stripPoints(unitName))}</span>
  </div>
  <div class="abilities-section">
    <div class="section-hdr" style="color:#999">No Wahapedia data found for this unit</div>
  </div>
</div>`;
}

const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
@page{size:A4 landscape;margin:1cm}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;background:#ccc;padding:.5cm;-webkit-print-color-adjust:exact;print-color-adjust:exact}
h1.pg-hdr{font-size:8pt;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#555;margin-bottom:.4cm}
.grid{display:grid;grid-template-columns:repeat(2,12.5cm);gap:.6cm;justify-content:center}
@media print{body{background:white;padding:0}.grid{gap:.4cm}}

/* ── Fixed-size card: 12.5 × 7.5 cm ── */
.card{
  width:12.5cm;height:7.5cm;
  overflow:hidden;
  background:#fff;
  border:1.5pt solid #111;
  border-radius:2pt;
  break-inside:avoid;page-break-inside:avoid;
  display:flex;flex-direction:column
}

/* Header */
.card-hdr{background:#111;color:#fff;padding:.18cm .35cm;display:flex;justify-content:space-between;align-items:baseline;gap:.25cm;flex-shrink:0}
.unit-name{font-size:7pt;font-weight:800;text-transform:uppercase;letter-spacing:.07em;line-height:1.3;flex:1}
.pts{font-size:5.5pt;color:#aaa;white-space:nowrap;flex-shrink:0}

/* Stats */
.stats-section{background:#f6edcf;border-bottom:1.5pt solid #b8911e;padding:.15cm .35cm;flex-shrink:0}
.model-lbl{font-size:4.5pt;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#8a6a10;margin-bottom:.06cm}
.stat-row{display:flex;align-items:flex-end;gap:.05cm}
.stat-box{text-align:center;flex:1;min-width:0}
.stat-lbl{font-size:4pt;text-transform:uppercase;letter-spacing:.08em;color:#9a7a20;font-weight:700;line-height:1.2;display:block}
.stat-val{font-size:9pt;font-weight:900;color:#111;line-height:1.1;display:block}
.invul{background:#8b1c1c;color:#fff;font-size:5pt;font-weight:700;letter-spacing:.06em;padding:.08cm .22cm;border-radius:2pt;white-space:nowrap;margin-left:.25cm;flex-shrink:0;align-self:center}

/* Weapons */
.weapon-table{width:100%;border-collapse:collapse}
.weapon-table thead tr{background:#1e3b18;color:#fff}
.weapon-table thead th{padding:.1cm .2cm;font-size:4.5pt;font-weight:700;letter-spacing:.06em;text-align:center;white-space:nowrap}
.weapon-table thead th.col-name{text-align:left;padding-left:.35cm}
.weapon-table thead th.col-kw{text-align:left;max-width:2.5cm}
.weapon-table tbody td{padding:.08cm .2cm;border-bottom:.5pt solid #e8e8e8;text-align:center;font-size:5.5pt;vertical-align:top}
.weapon-table tbody tr:nth-child(even) td{background:#f8f8f8}
.weapon-table tbody td.col-name{text-align:left;font-weight:600;padding-left:.35cm}
.weapon-table tbody td.col-kw{text-align:left;font-size:4.5pt;color:#555;font-style:italic;max-width:2.5cm;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}

/* Abilities */
.abilities-section{padding:.15cm .35cm;flex:1;overflow:hidden}
.section-hdr{font-size:4.5pt;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#777;margin-bottom:.1cm;padding-bottom:.08cm;border-bottom:.5pt solid #ddd}
.ab-row{font-size:5.5pt;line-height:1.4;margin-top:.1cm}
.ab-name{font-weight:700;color:#111}
.ab-text{color:#333}

/* Footer rows inside card */
.composition{font-size:4.5pt;color:#999;padding:.08cm .35cm;border-top:.5pt solid #eee;font-style:italic;flex-shrink:0}
.damaged{font-size:5pt;color:#7a1414;background:#fff5f5;border-top:.5pt solid #f0e0e0;padding:.1cm .35cm;line-height:1.4;flex-shrink:0}
.damaged-lbl{font-weight:700;font-size:4.5pt;text-transform:uppercase;letter-spacing:.05em}

/* Keywords footer */
.keywords-section{margin-top:auto;border-top:.5pt solid #ddd;padding:.1cm .35cm;flex-shrink:0;background:#fafafa}
.kw-line{font-size:4.5pt;line-height:1.35;color:#333;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.kw-lbl{font-weight:700;letter-spacing:.05em;color:#777}
.kw-faction .kw-lbl{color:#8a6a10}
.kw-faction{color:#8a6a10;font-weight:600}

.footer{margin-top:.4cm;font-size:5pt;color:#999;text-align:right}
.footer a{color:#999}
.no-data-warn{background:#fff3cd;border:1px solid #ffc107;border-radius:4pt;padding:.3cm .5cm;margin-bottom:.4cm;font-size:7pt;color:#7a5900;max-width:26.4cm}
@media print{.no-data-warn{display:none}}
`;

export async function generateUnitCardsHtml(roster, wahapediaData, config, onProgress) {
  const { units, unitSelections = {} } = roster;
  const report = msg => { try { onProgress?.(msg); } catch (_) {} };

  // The app loads datasheets lazily, so they may not be in React state yet when
  // export runs. Fall back to loading them here rather than emitting empty cards.
  // Datasheets are fetched first: they're required, and the successful fetch
  // pins the live edition so the remaining files skip the dead path.
  let datasheetRows = wahapediaData?.datasheetRows;
  if (!datasheetRows?.length) {
    report('Loading unit datasheets…');
    datasheetRows = await getDatasheetRows();
  }

  if (!datasheetRows.length) {
    throw new Error(
      'Could not load unit data from Wahapedia. Check your connection and try again.'
    );
  }

  // Stats, weapons and abilities enrich the cards but aren't required — if any
  // of them fail the cards still render with whatever did load.
  report('Loading stats, weapons, abilities and keywords…');
  const [modelRows, weaponRows, datasheetAbilityRows, keywordRows] = await Promise.all([
    getModelRows().catch(() => []),
    getWeaponRows().catch(() => []),
    wahapediaData?.datasheetAbilityRows?.length
      ? Promise.resolve(wahapediaData.datasheetAbilityRows)
      : getAbilityRows().catch(() => []),
    getKeywordRows().catch(() => []),
  ]);

  report('Building cards…');

  // Index every supporting table by datasheet_id
  const groupByDsId = rows => {
    const out = {};
    rows.forEach(r => {
      const k = pick(r, 'datasheet_id');
      if (!k) return;
      (out[k] = out[k] || []).push(r);
    });
    return out;
  };

  const modelsByDsId  = groupByDsId(modelRows);
  const weaponsByDsId = groupByDsId(weaponRows);
  const absByDsId     = groupByDsId(datasheetAbilityRows);
  const kwByDsId      = groupByDsId(keywordRows);

  const cards = [];
  const matched = [];
  const unmatched = [];
  const seenDsIds = new Set();

  for (const unitName of units) {
    const ds = datasheetRows.find(d => matchesRosterUnit(unitName, d.name));
    if (!ds) {
      unmatched.push(unitName);
      continue;
    }
    const dsId = pick(ds, 'id');
    if (seenDsIds.has(dsId)) continue;
    seenDsIds.add(dsId);
    matched.push(unitName);

    const models   = modelsByDsId[dsId] || [];
    const allWeapons = weaponsByDsId[dsId] || [];
    const kwRows   = kwByDsId[dsId] || [];
    // Keep datasheet-specific and wargear abilities; drop generic Core/Faction
    // entries, which are the same on every card and just eat space.
    const abilities = (absByDsId[dsId] || []).filter(ab => {
      const t = String(pick(ab, 'type')).toLowerCase();
      return t === '' || t === 'datasheet' || t === 'wargear';
    });
    const selections = unitSelections[unitName];

    const weapons = (selections && selections.length)
      ? allWeapons.filter(w => weaponInSelection(pick(w, 'name'), selections))
      : allWeapons;

    cards.push(renderCard(unitName, ds, models, weapons, abilities, kwRows));
  }

  const noDataWarning = unmatched.length
    ? `<div class="no-data-warn"><strong>No Wahapedia data found for:</strong> ${unmatched.map(u => esc(u)).join(', ')}</div>`
    : '';

  const title = [config.playerFaction, config.playerDetachment].filter(Boolean).join(' · ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Unit Cards${title ? ' — ' + title : ''}</title>
<style>${CSS}</style>
</head>
<body>
<h1 class="pg-hdr">Unit Cards${title ? ' — ' + title : ''}</h1>
${noDataWarning}
<div class="grid">${cards.join('\n')}</div>
<div class="footer">Data: <a href="https://wahapedia.ru">Wahapedia.ru</a> &middot; Warhammer 40K Turn Tracker</div>
</body>
</html>`;
}
