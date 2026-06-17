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

export default function AbilitiesTab({ phaseId, roster, wahapediaHook }) {
  const { datasheetRows, datasheetAbilityRows } = wahapediaHook.wahapedia;

  const { abilitiesByDatasheetId, datasheetNameById } = useMemo(() => {
    const abilitiesByDatasheetId = {};
    datasheetAbilityRows.forEach(row => {
      if (!abilitiesByDatasheetId[row.datasheet_id]) abilitiesByDatasheetId[row.datasheet_id] = [];
      abilitiesByDatasheetId[row.datasheet_id].push(row);
    });
    const datasheetNameById = {};
    datasheetRows.forEach(row => { datasheetNameById[row.id] = row.name; });
    return { abilitiesByDatasheetId, datasheetNameById };
  }, [datasheetRows, datasheetAbilityRows]);

  const entries = useMemo(() => {
    if (!roster.loaded || !roster.units.length) return null;
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
      <div className="abilities-empty">
        <p>Load your roster on the setup screen to see unit abilities here.</p>
      </div>
    );
  }

  if (!datasheetRows.length) {
    return (
      <div className="abilities-empty">
        <p>Loading unit abilities from Wahapedia…</p>
      </div>
    );
  }

  if (!entries || !entries.length) {
    return <div className="abilities-empty"><p>No abilities for this phase.</p></div>;
  }

  return (
    <div className="abilities-tab">
      {entries.map(({ unitName, abilities }) => (
        <div key={unitName} className="abilities-unit-group">
          <div className="abilities-unit-name">{unitName}</div>
          {abilities.map(ab => (
            <div key={ab.name} className="ability-row">
              <span className="ability-name">{ab.name}</span>
              <p
                className="ability-text"
                dangerouslySetInnerHTML={{ __html: ab.description }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
