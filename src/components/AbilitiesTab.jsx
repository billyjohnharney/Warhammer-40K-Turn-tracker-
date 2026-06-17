import { useMemo } from 'react';

function detectPhases(html) {
  const t = html.toLowerCase().replace(/<[^>]+>/g, ' ');
  const phases = [];
  if (t.includes('fight phase') || t.includes('melee attack')) phases.push('fight');
  if (t.includes('shooting phase')) phases.push('shooting');
  if (t.includes('movement phase') || t.includes('advance roll') || t.includes('fall back')) phases.push('movement');
  if (t.includes('command phase') || t.includes('battle-shock')) phases.push('command');
  if (t.includes('charge phase') || t.includes('heroic intervention')) phases.push('charge');
  return phases.length ? phases : ['any'];
}

function matchesRosterUnit(rosterName, datasheetName) {
  const r = rosterName.toLowerCase().trim();
  const d = datasheetName.toLowerCase().trim();
  return r === d || d.startsWith(r + ' ') || d.startsWith(r + ',') || r.startsWith(d + ' ');
}

function stripPoints(name) {
  return name.replace(/\s*[\[(]?\d+\s*pts?[\])]?\s*/gi, '').trim();
}

function briefText(html) {
  const raw = (html || '').replace(/<[^>]+>/g, '').trim();
  return raw.length > 110 ? raw.slice(0, 107) + '…' : raw;
}

function AbilityItem({ ab }) {
  return (
    <div className="stratagem-item ability-item">
      <div className="item-content">
        <span className="strat-name">{ab.name}</span>
        {briefText(ab.description) && (
          <div className="strat-legend">{briefText(ab.description)}</div>
        )}
      </div>
    </div>
  );
}

export default function AbilitiesTab({ phaseId, roster, wahapediaHook }) {
  const { datasheetRows, datasheetAbilityRows } = wahapediaHook.wahapedia;

  const { abilitiesByDatasheetId } = useMemo(() => {
    const abilitiesByDatasheetId = {};
    datasheetAbilityRows.forEach(row => {
      if (!abilitiesByDatasheetId[row.datasheet_id]) abilitiesByDatasheetId[row.datasheet_id] = [];
      abilitiesByDatasheetId[row.datasheet_id].push(row);
    });
    return { abilitiesByDatasheetId };
  }, [datasheetAbilityRows]);

  const entries = useMemo(() => {
    if (!roster.loaded || !roster.units.length || !datasheetRows.length) return [];
    const matched = [];
    for (const rosterUnit of roster.units) {
      const matchingSheets = datasheetRows.filter(ds => matchesRosterUnit(rosterUnit, ds.name));
      const seenNames = new Set();
      const abilities = matchingSheets.flatMap(ds => abilitiesByDatasheetId[ds.id] || [])
        .filter(ab => {
          if (ab.type !== 'Datasheet') return false;
          if (seenNames.has(ab.name)) return false;
          seenNames.add(ab.name);
          const phases = detectPhases(ab.description || '');
          return phases.includes(phaseId) || phases.includes('any');
        });
      if (abilities.length) matched.push({ unitName: rosterUnit, abilities });
    }
    return matched;
  }, [roster, phaseId, datasheetRows, abilitiesByDatasheetId]);

  if (!roster.loaded) {
    return (
      <div className="fs-section">
        <div className="fs-status">Load your roster on the setup screen to see unit abilities here.</div>
      </div>
    );
  }

  if (!datasheetRows.length) {
    return (
      <div className="fs-section">
        <div className="fs-status">Loading unit abilities from Wahapedia…</div>
      </div>
    );
  }

  if (!entries.length) {
    return (
      <div className="fs-section">
        <div className="fs-status">No abilities for this phase.</div>
      </div>
    );
  }

  return (
    <div className="fs-section">
      {entries.map(({ unitName, abilities }) => (
        <div key={unitName}>
          <div className="fs-subsection-label">{stripPoints(unitName)}</div>
          {abilities.map(ab => <AbilityItem key={ab.name} ab={ab} />)}
        </div>
      ))}
      <div className="fs-attribution">
        Ability data: <a href="https://wahapedia.ru" target="_blank" rel="noopener">Wahapedia</a>
      </div>
    </div>
  );
}
