import { useMemo } from 'react';

function detectPhases(html) {
  const t = html.toLowerCase().replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const phases = new Set();

  // Explicit "any phase" → all phases
  if (/\bany phase\b/.test(t)) return ['command', 'movement', 'shooting', 'charge', 'fight'];

  // ── Explicit phase triggers ───────────────────────────────────────────────

  // Command
  if (/\bcommand phase\b/.test(t))                         phases.add('command');
  if (/\bbattle[- ]shock\b/.test(t))                       phases.add('command');
  if (/\bcommand point/.test(t))                           phases.add('command');
  if (/\bstart of (your|the) (command )?turn\b/.test(t))   phases.add('command');
  if (/\bleadership\b/.test(t))                            phases.add('command');

  // Movement
  if (/\bmovement phase\b/.test(t))                        phases.add('movement');
  if (/\bnormal move\b/.test(t))                           phases.add('movement');
  if (/\badvance roll\b/.test(t))                          phases.add('movement');
  if (/\bwhen (this|a) unit advances\b/.test(t))           phases.add('movement');
  if (/\bfall(s)? back\b/.test(t))                         phases.add('movement');
  if (/\bremains stationary\b/.test(t))                    phases.add('movement');
  if (/\bdeep strike\b/.test(t))                           phases.add('movement');
  if (/\bfly\b/.test(t))                                   phases.add('movement');

  // Shooting
  if (/\bshooting phase\b/.test(t))                        phases.add('shooting');
  if (/\branged attack\b/.test(t))                         phases.add('shooting');
  if (/\bselected to shoot\b/.test(t))                     phases.add('shooting');
  if (/\bballistic skill\b/.test(t))                       phases.add('shooting');
  if (/\bbenefit of cover\b/.test(t))                      phases.add('shooting');
  if (/\branged weapon\b/.test(t))                         phases.add('shooting');
  if (/\bignores? cover\b/.test(t))                        phases.add('shooting');
  if (/\blone operative\b/.test(t))                        phases.add('shooting');
  if (/\bstealth\b/.test(t))                               phases.add('shooting');

  // Charge
  if (/\bcharge phase\b/.test(t))                          phases.add('charge');
  if (/\bdeclares? a charge\b/.test(t))                    phases.add('charge');
  if (/\bcharge move\b/.test(t))                           phases.add('charge');
  if (/\bwhen (this|a) unit charges\b/.test(t))            phases.add('charge');
  if (/\bheroic intervention\b/.test(t))                   phases.add('charge');
  if (/\boverwatch\b/.test(t))                             phases.add('charge');

  // Fight
  if (/\bfight phase\b/.test(t))                           phases.add('fight');
  if (/\bmelee attack\b/.test(t))                          phases.add('fight');
  if (/\bselected to fight\b/.test(t))                     phases.add('fight');
  if (/\bclose[- ]combat\b/.test(t))                       phases.add('fight');
  if (/\bstrikes? (first|last)\b/.test(t))                 phases.add('fight');
  if (/\bpile[- ]in\b/.test(t))                            phases.add('fight');
  if (/\bconsolidat(e|ion)\b/.test(t))                     phases.add('fight');
  if (/\bweapon skill\b/.test(t))                          phases.add('fight');
  if (/\bmelee weapon\b/.test(t))                          phases.add('fight');

  // ── Passive but phase-relevant ────────────────────────────────────────────
  // Abilities that resolve during attack sequences apply to both attack phases.
  // If explicit signals already placed this in one of the two, extend to both.
  const attackPatterns = [
    /\bfeel no pain\b/,
    /\binvulnerable save\b/,
    /\beach time (a |an |this )?(model |unit )?(in this unit )?is allocated (a |an )?wound\b/,
    /\beach time (a |an )?attack is allocated\b/,
    /\beach time this (model|unit) (is |)suffer(s|ed)? (a |an )?wound\b/,
    /\bsave roll\b/,
    /\bsaving throw\b/,
    /\bignore(s)? (wounds?|damage)\b/,
    /\bnegate(s)? (wounds?|damage)\b/,
    /\breduces? (the )?damage\b/,
    /\bdamage characteristic\b/,
  ];
  if (attackPatterns.some(re => re.test(t))) {
    phases.add('shooting');
    phases.add('fight');
  }

  // Abilities keyed to ranged weapons only extend to shooting alone
  if (!phases.has('fight') && /\branged\b/.test(t) && phases.has('shooting')) {
    // already correctly scoped to shooting only — do nothing
  }

  // Empty → passive ability with no detectable phase, not shown in any tab
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
