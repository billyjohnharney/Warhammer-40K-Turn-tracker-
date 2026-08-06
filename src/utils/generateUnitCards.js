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

async function fetchCsvText(url) {
  const enc = encodeURIComponent(url);
  const strategies = [
    () => fetch(`https://api.allorigins.win/get?url=${enc}`).then(r => r.json()).then(j => {
      if (!j.contents) throw new Error('empty');
      return j.contents;
    }),
    () => fetch(`https://corsproxy.io/?url=${enc}`).then(r => {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    }),
    () => fetch(`https://api.allorigins.win/raw?url=${enc}`).then(r => {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    }),
    () => fetch(url).then(r => {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    }),
  ];
  for (const fn of strategies) {
    try {
      const text = await fn();
      if (text && text.trim().length > 100 && text.indexOf('|') < 200) return text;
    } catch (_) { /* try next */ }
  }
  return null;
}

// Module-level cache so repeated exports don't re-fetch
let _modelRows = null;
let _weaponRows = null;

async function getModelRows() {
  if (_modelRows) return _modelRows;
  const cached = localStorage.getItem('wh_datasheet_models');
  if (cached && cached.length > 200) {
    _modelRows = parseCsv(cached);
    return _modelRows;
  }
  const text = await fetchCsvText('https://wahapedia.ru/wh40k10ed/Datasheets_models.csv');
  if (text) {
    try { localStorage.setItem('wh_datasheet_models', text); } catch (_) {}
    _modelRows = parseCsv(text);
  } else {
    _modelRows = [];
  }
  return _modelRows;
}

async function getWeaponRows() {
  if (_weaponRows) return _weaponRows;
  const cached = localStorage.getItem('wh_datasheet_weapons');
  if (cached && cached.length > 200) {
    _weaponRows = parseCsv(cached);
    return _weaponRows;
  }
  const text = await fetchCsvText('https://wahapedia.ru/wh40k10ed/Datasheets_weapons.csv');
  if (text) {
    try { localStorage.setItem('wh_datasheet_weapons', text); } catch (_) {}
    _weaponRows = parseCsv(text);
  } else {
    _weaponRows = [];
  }
  return _weaponRows;
}

function matchesRosterUnit(rosterName, datasheetName) {
  const r = rosterName.toLowerCase().replace(/\s*[\[(]?\d+\s*pts?[\])]?\s*/gi, '').trim();
  const d = datasheetName.toLowerCase().trim();
  return r === d || d.startsWith(r + ' ') || d.startsWith(r + ',') || r.startsWith(d + ' ');
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

function renderStats(ds, models) {
  const STATS = ['M', 'T', 'SV', 'W', 'LD', 'OC'];
  const hasModels = models && models.length > 0;

  const invulHtml = ds.invul_save && ds.invul_save !== '-' && ds.invul_save !== '0'
    ? `<div class="invul">INV ${esc(ds.invul_save)}</div>` : '';

  if (!hasModels) {
    return invulHtml ? `<div class="stats-section"><div class="stats-row">${invulHtml}</div></div>` : '';
  }

  const rows = models.map((m, i) => {
    const labelHtml = models.length > 1
      ? `<div class="model-lbl">${esc(m.name || '')}</div>` : '';
    const cells = STATS.map(s => {
      const val = m[s] || m[s.toLowerCase()] || '-';
      return `<div class="stat-box"><div class="stat-lbl">${s}</div><div class="stat-val">${esc(val)}</div></div>`;
    }).join('');
    return `${labelHtml}<div class="stat-row">${cells}${i === 0 ? invulHtml : ''}</div>`;
  }).join('');

  return `<div class="stats-section">${rows}</div>`;
}

function renderWeapons(weapons, hasSelectionData) {
  if (!weapons.length) return '';

  const ranged = weapons.filter(w => {
    const t = (w.type || w.Type || '').toLowerCase();
    return t === 'ranged' || t === 'r';
  });
  const melee = weapons.filter(w => {
    const t = (w.type || w.Type || '').toLowerCase();
    return t === 'melee' || t === 'm' || t === '';
  });

  function table(ws, isRanged) {
    if (!ws.length) return '';
    const label = isRanged ? 'RANGED WEAPONS' : 'MELEE WEAPONS';
    const thExtra = isRanged ? '<th>RNG</th>' : '';
    const head = `<thead><tr><th class="col-name">${label}</th>${thExtra}<th>A</th><th>${isRanged ? 'BS' : 'WS'}</th><th>S</th><th>AP</th><th>D</th><th class="col-kw">KEYWORDS</th></tr></thead>`;
    const rows = ws.map(w => {
      const name  = esc(w.name || w.Name || '');
      const range = esc(w.range || w.Range || '-');
      const att   = esc(w.attacks || w.A || '-');
      const skill = esc(w.skill || w.BS || w.WS || '-');
      const str   = esc(w.strength || w.S || '-');
      const ap    = esc(w.ap || w.AP || '-');
      const dmg   = esc(w.damage || w.D || '-');
      const kw    = esc(w.keywords || w.Keywords || '');
      const rangeCell = isRanged ? `<td>${range}</td>` : '';
      return `<tr><td class="col-name">${name}</td>${rangeCell}<td>${att}</td><td>${skill}</td><td>${str}</td><td>${ap}</td><td>${dmg}</td><td class="col-kw">${kw}</td></tr>`;
    }).join('');
    return `<table class="weapon-table">${head}<tbody>${rows}</tbody></table>`;
  }

  return `<div class="weapons-section">${table(ranged, true)}${table(melee, false)}</div>`;
}

function renderAbilities(abilities) {
  if (!abilities.length) return '';
  const items = abilities.map(ab => {
    const desc = stripHtml(ab.description || '');
    return `<div class="ab-row"><span class="ab-name">${esc(ab.name)}: </span><span class="ab-text">${esc(desc)}</span></div>`;
  }).join('');
  return `<div class="abilities-section"><div class="section-hdr">ABILITIES</div>${items}</div>`;
}

function renderCard(unitName, ds, models, weapons, abilities) {
  const pts = ds.points && ds.points !== '0' && ds.points !== ''
    ? `<span class="pts">${esc(ds.points)} pts</span>` : '';
  const damaged = ds.damaged_w && ds.damaged_description && ds.damaged_description !== '-'
    ? `<div class="damaged"><span class="damaged-lbl">DAMAGED (${esc(ds.damaged_w)} WOUNDS REMAINING): </span>${esc(ds.damaged_description)}</div>`
    : '';
  const comp = ds.unit_composition && ds.unit_composition !== '-'
    ? `<div class="composition">COMPOSITION: ${esc(ds.unit_composition)}</div>` : '';

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
@page{margin:1.2cm;size:A4}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;background:#e8e8e8;padding:.75rem;font-size:11px;color:#111;-webkit-print-color-adjust:exact;print-color-adjust:exact}
h1.pg-hdr{font-size:.8rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#444;margin-bottom:.625rem}
.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:.625rem}
@media(max-width:560px){.grid{grid-template-columns:1fr}}
.card{background:#fff;border:2px solid #111;border-radius:3px;overflow:hidden;break-inside:avoid;page-break-inside:avoid;display:flex;flex-direction:column}
.card-hdr{background:#111;color:#fff;padding:.35rem .6rem;display:flex;justify-content:space-between;align-items:center;gap:.5rem;flex-shrink:0}
.unit-name{font-size:.75rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;line-height:1.2;flex:1}
.pts{font-size:.6rem;color:#bbb;white-space:nowrap;flex-shrink:0}
.stats-section{background:#f5edd8;border-bottom:2px solid #b8911e;padding:.35rem .5rem}
.model-lbl{font-size:.5rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#8a6a10;margin-bottom:.1rem}
.stat-row{display:flex;align-items:center;gap:.125rem}
.stat-box{text-align:center;flex:1;min-width:0}
.stat-lbl{font-size:.48rem;text-transform:uppercase;letter-spacing:.08em;color:#9a7a20;font-weight:700;line-height:1.2}
.stat-val{font-size:.875rem;font-weight:900;color:#111;line-height:1.1}
.invul{background:#8b1c1c;color:#fff;font-size:.55rem;font-weight:700;letter-spacing:.07em;padding:.15rem .4rem;border-radius:2px;white-space:nowrap;margin-left:.375rem;flex-shrink:0}
.weapons-section{}
.weapon-table{width:100%;border-collapse:collapse;font-size:.63rem}
.weapon-table thead tr{background:#1e3b18;color:#fff}
.weapon-table thead th{padding:.2rem .3rem;font-size:.53rem;font-weight:700;letter-spacing:.06em;text-align:center;white-space:nowrap}
.weapon-table thead th.col-name{text-align:left;padding-left:.5rem}
.weapon-table thead th.col-kw{text-align:left}
.weapon-table tbody td{padding:.18rem .3rem;border-bottom:1px solid #ebebeb;text-align:center;vertical-align:top}
.weapon-table tbody tr:nth-child(even) td{background:#f7f7f7}
.weapon-table tbody td.col-name{text-align:left;font-weight:600;padding-left:.5rem}
.weapon-table tbody td.col-kw{text-align:left;font-size:.52rem;color:#555;font-style:italic}
.abilities-section{padding:.35rem .5rem;flex:1}
.section-hdr{font-size:.52rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#777;margin-bottom:.2rem;padding-bottom:.15rem;border-bottom:1px solid #eee}
.ab-row{font-size:.63rem;line-height:1.45;margin-top:.25rem}
.ab-name{font-weight:700;color:#111}
.ab-text{color:#333}
.composition{font-size:.55rem;color:#888;padding:.2rem .5rem;border-top:1px solid #f0f0f0;font-style:italic}
.damaged{font-size:.6rem;color:#7a1414;background:#fff5f5;border-top:1px solid #f0e0e0;padding:.25rem .5rem;line-height:1.45}
.damaged-lbl{font-weight:700;text-transform:uppercase;font-size:.5rem;letter-spacing:.06em}
.footer{margin-top:.625rem;font-size:.55rem;color:#999;text-align:right}
.footer a{color:#999}
@media print{body{background:#fff;padding:0}.card{box-shadow:none;border:1.5pt solid #111}}
`;

export async function generateUnitCardsHtml(roster, wahapediaData, config) {
  const { units, unitSelections = {} } = roster;
  const { datasheetRows, datasheetAbilityRows } = wahapediaData;

  const [modelRows, weaponRows] = await Promise.all([getModelRows(), getWeaponRows()]);

  // Index lookups
  const modelsByDsId = {};
  modelRows.forEach(m => {
    const k = m.datasheet_id;
    if (!k) return;
    if (!modelsByDsId[k]) modelsByDsId[k] = [];
    modelsByDsId[k].push(m);
  });

  const weaponsByDsId = {};
  weaponRows.forEach(w => {
    const k = w.datasheet_id || w.Datasheet_id;
    if (!k) return;
    if (!weaponsByDsId[k]) weaponsByDsId[k] = [];
    weaponsByDsId[k].push(w);
  });

  const absByDsId = {};
  datasheetAbilityRows.forEach(ab => {
    const k = ab.datasheet_id;
    if (!k) return;
    if (!absByDsId[k]) absByDsId[k] = [];
    absByDsId[k].push(ab);
  });

  const cards = [];
  const seenDsIds = new Set();

  for (const unitName of units) {
    const ds = datasheetRows.find(d => matchesRosterUnit(unitName, d.name));
    if (!ds) { cards.push(stubCard(unitName)); continue; }
    if (seenDsIds.has(ds.id)) continue;
    seenDsIds.add(ds.id);

    const models   = modelsByDsId[ds.id] || [];
    const allWeapons = weaponsByDsId[ds.id] || [];
    const abilities  = (absByDsId[ds.id] || []).filter(ab => ab.type === 'Datasheet');
    const selections = unitSelections[unitName];

    const weapons = (selections && selections.length)
      ? allWeapons.filter(w => weaponInSelection(w.name || '', selections))
      : allWeapons;

    cards.push(renderCard(unitName, ds, models, weapons, abilities));
  }

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
<div class="grid">${cards.join('\n')}</div>
<div class="footer">Data: <a href="https://wahapedia.ru">Wahapedia.ru</a> &middot; Warhammer 40K Turn Tracker</div>
</body>
</html>`;
}
