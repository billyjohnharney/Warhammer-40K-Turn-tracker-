import { useMemo } from 'react';

function detectPhases(html) {
  const t = html.toLowerCase().replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const phases = new Set();

  // Explicit "any phase" → all phases
  if (/\bany phase\b/.test(t)) return ['command', 'movement', 'shooting', 'charge', 'fight'];

  // Command phase
  if (/\bcommand phase\b/.test(t))                    phases.add('command');
  if (/\bbattle[- ]shock\b/.test(t))                  phases.add('command');
  if (/\bcommand point/.test(t))                      phases.add('command');
  if (/\bstart of (your|the) (command )?turn\b/.test(t)) phases.add('command');

  // Movement phase
  if (/\bmovement phase\b/.test(t))                   phases.add('movement');
  if (/\bnormal move\b/.test(t))                      phases.add('movement');
  if (/\badvance roll\b/.test(t))                     phases.add('movement');
  if (/\bwhen (this|a) unit advances\b/.test(t))      phases.add('movement');
  if (/\bfall(s)? back\b/.test(t))                    phases.add('movement');
  if (/\bremains stationary\b/.test(t))               phases.add('movement');

  // Shooting phase
  if (/\bshooting phase\b/.test(t))                   phases.add('shooting');
  if (/\branged attack\b/.test(t))                    phases.add('shooting');
  if (/\bselected to shoot\b/.test(t))                phases.add('shooting');
  if (/\bballistic skill\b/.test(t))                  phases.add('shooting');
  if (/\bbenefit of cover\b/.test(t))                 phases.add('shooting');

  // Charge phase
  if (/\bcharge phase\b/.test(t))                     phases.add('charge');
  if (/\bdeclares? a charge\b/.test(t))               phases.add('charge');
  if (/\bcharge move\b/.test(t))                      phases.add('charge');
  if (/\bwhen (this|a) unit charges\b/.test(t))       phases.add('charge');
  if (/\bheroic intervention\b/.test(t))              phases.add('charge');
  if (/\boverwatch\b/.test(t))                        phases.add('charge');

  // Fight phase
  if (/\bfight phase\b/.test(t))                      phases.add('fight');
  if (/\bmelee attack\b/.test(t))                     phases.add('fight');
  if (/\bselected to fight\b/.test(t))                phases.add('fight');
  if (/\bclose[- ]combat\b/.test(t))                  phases.add('fight');
  if (/\bstrikes? (first|last)\b/.test(t))            phases.add('fight');
  if (/\bpile[- ]in\b/.test(t))                       phases.add('fight');
  if (/\bconsolidat(e|ion)\b/.test(t))                phases.add('fight');
  if (/\bweapon skill\b/.test(t))                     phases.add('fight');

  // Empty → passive ability, shown in no phase tab
  return [...phases];
}

function matchesRosterUnit(rosterName, datasheetName) {
  const r = rosterName.toLowerCase().trim();
  const d = datasheetName.toLowerCase().trim();
  return r === d || d.startsWith(r + ' ') || d.startsWith(r + ',') || r.startsWith(d + ' ');
}

function stripPoints(name) {
  return name.replace(/\s*[\[(]?\d+\s*pts?[\])]?\s*/gi, '').trim();
}

function AbilityItem({ ab }) {
  return (
    <div className="stratagem-item ability-item">
      <div className="item-content">
        <span className="strat-name">{ab.name}</span>
        {ab.description && (
          <div
            className="strat-legend"
            dangerouslySetInnerHTML={{ __html: ab.description }}
          />
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
          return phases.includes(phaseId);
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
