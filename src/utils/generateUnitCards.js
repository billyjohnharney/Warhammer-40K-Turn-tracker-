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
  const cached = localStorage.getItem('wh11_datasheet_models');
  if (cached && cached.length > 200) {
    _modelRows = parseCsv(cached);
    return _modelRows;
  }
  const text = await fetchCsvText('https://wahapedia.ru/wh40k11ed/Datasheets_models.csv');
  if (text) {
    try { localStorage.setItem('wh11_datasheet_models', text); } catch (_) {}
    _modelRows = parseCsv(text);
  } else {
    _modelRows = [];
  }
  return _modelRows;
}

async function getWeaponRows() {
  if (_weaponRows) return _weaponRows;
  const cached = localStorage.getItem('wh11_datasheet_weapons');
  if (cached && cached.length > 200) {
    _weaponRows = parseCsv(cached);
    return _weaponRows;
  }
  const text = await fetchCsvText('https://wahapedia.ru/wh40k11ed/Datasheets_weapons.csv');
  if (text) {
    try { localStorage.setItem('wh11_datasheet_weapons', text); } catch (_) {}
    _weaponRows = parseCsv(text);
  } else {
    _weaponRows = [];
  }
  return _weaponRows;
}

function normalizeUnitName(s) {
  return s.toLowerCase()
    .replace(/\s*[\[(]?\d+\s*pts?[\])]?\s*/gi, '') // strip points
    .replace(/^\d+[x×]\s*/i, '')                    // strip leading quantity
    .replace(/\s+squad$/i, '')                       // "Intercessor Squad" → "Intercessor"
    .replace(/s$/i, '')                              // normalise plural: "Intercessors" → "Intercessor"
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

.footer{margin-top:.4cm;font-size:5pt;color:#999;text-align:right}
.footer a{color:#999}
.no-data-warn{background:#fff3cd;border:1px solid #ffc107;border-radius:4pt;padding:.3cm .5cm;margin-bottom:.4cm;font-size:7pt;color:#7a5900;max-width:26.4cm}
@media print{.no-data-warn{display:none}}
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
  const matched = [];
  const unmatched = [];
  const seenDsIds = new Set();

  for (const unitName of units) {
    const ds = datasheetRows.find(d => matchesRosterUnit(unitName, d.name));
    if (!ds) {
      unmatched.push(unitName);
      continue;
    }
    if (seenDsIds.has(ds.id)) continue;
    seenDsIds.add(ds.id);
    matched.push(unitName);

    const models   = modelsByDsId[ds.id] || [];
    const allWeapons = weaponsByDsId[ds.id] || [];
    const abilities  = (absByDsId[ds.id] || []).filter(ab => ab.type === 'Datasheet');
    const selections = unitSelections[unitName];

    const weapons = (selections && selections.length)
      ? allWeapons.filter(w => weaponInSelection(w.name || '', selections))
      : allWeapons;

    cards.push(renderCard(unitName, ds, models, weapons, abilities));
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
