import { useMemo } from 'react';

function detectPhases(html) {
  const t = html.toLowerCase().replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const phases = new Set();

  if (/\bany phase\b/.test(t)) return ['command', 'movement', 'shooting', 'charge', 'fight'];

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

  // Passive attack-resolution abilities (apply when attacks are resolved against you)
  const defenceResolution = [
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
  if (defenceResolution.some(re => re.test(t))) {
    phases.add('shooting');
    phases.add('fight');
  }

  return [...phases];
}

// Classify whether an ability is used on your turn (attack), opponent's turn
// (defence), or either / always-on (either).
function detectTurn(html) {
  const t = html.toLowerCase().replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

  const attackSignals = [
    /\bwhen this (model|unit) is selected to (fight|shoot)\b/,
    /\bwhen this unit (makes? a )?normal move\b/,
    /\bwhen this unit (advances|falls? back)\b/,
    /\bwhen this unit declares? a charge\b/,
    /\bwhen this unit charges\b/,
    /\beach time (a model in this unit|this model) makes (a |an )?(melee|ranged) attack\b/,
    /\bwhen making (a |an )?(melee|ranged) attack\b/,
    /\bin your (movement|shooting|fight|charge) phase\b/,
    /\byour (movement|shooting|fight|charge) phase\b/,
    /\bat the start of your (movement|shooting|fight|charge) phase\b/,
  ];

  const defenceSignals = [
    /\bfeel no pain\b/,
    /\binvulnerable save\b/,
    /\beach time (a |an )?(model |unit )?(in this unit )?is allocated (a |an )?wound\b/,
    /\beach time (a |an )?attack is allocated\b/,
    /\beach time this (model|unit) (is |)suffer(s|ed)? (a |an )?wound\b/,
    /\bsave roll\b/,
    /\bsaving throw\b/,
    /\bignore(s)? (wounds?|damage)\b/,
    /\bnegate(s)? (wounds?|damage)\b/,
    /\breduces? (the )?damage\b/,
    /\bwhen (this unit|a model in this unit) is (selected as the )?target(ed)?\b/,
    /\bwhen this unit is charged\b/,
    /\bin (your )?opponent'?s? (turn|phase)\b/,
  ];

  const isAttack  = attackSignals.some(re => re.test(t));
  const isDefence = defenceSignals.some(re => re.test(t));

  if (isAttack && !isDefence) return 'attack';
  if (isDefence && !isAttack) return 'defence';
  return 'either';
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
          <div className="strat-legend" dangerouslySetInnerHTML={{ __html: ab.description }} />
        )}
      </div>
    </div>
  );
}

function AbilitySubSection({ label, cls, items }) {
  if (!items.length) return null;

  // Group by unit within this turn section
  const byUnit = [];
  const seen = new Map();
  for (const { unitName, ab } of items) {
    if (!seen.has(unitName)) { seen.set(unitName, []); byUnit.push(unitName); }
    seen.get(unitName).push(ab);
  }

  return (
    <>
      <div className={`fs-subsection-label ${cls}`}>{label}</div>
      {byUnit.map(unitName => (
        <div key={unitName}>
          <div className="fs-unit-label">{stripPoints(unitName)}</div>
          {seen.get(unitName).map(ab => <AbilityItem key={ab.name} ab={ab} />)}
        </div>
      ))}
    </>
  );
}

export default function AbilitiesTab({ phaseId, roster, wahapediaHook }) {
  const { datasheetRows, datasheetAbilityRows } = wahapediaHook.wahapedia;

  const abilitiesByDatasheetId = useMemo(() => {
    const map = {};
    datasheetAbilityRows.forEach(row => {
      if (!map[row.datasheet_id]) map[row.datasheet_id] = [];
      map[row.datasheet_id].push(row);
    });
    return map;
  }, [datasheetAbilityRows]);

  // Flat list of { unitName, ab } for the current phase, tagged with turn
  const groups = useMemo(() => {
    const result = { attack: [], either: [], defence: [] };
    if (!roster.loaded || !roster.units.length || !datasheetRows.length) return result;

    for (const rosterUnit of roster.units) {
      const matchingSheets = datasheetRows.filter(ds => matchesRosterUnit(rosterUnit, ds.name));
      const seenNames = new Set();
      for (const ds of matchingSheets) {
        for (const ab of (abilitiesByDatasheetId[ds.id] || [])) {
          if (ab.type !== 'Datasheet') continue;
          if (seenNames.has(ab.name)) continue;
          if (!detectPhases(ab.description || '').includes(phaseId)) continue;
          seenNames.add(ab.name);
          result[detectTurn(ab.description || '')].push({ unitName: rosterUnit, ab });
        }
      }
    }
    return result;
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

  const total = groups.attack.length + groups.either.length + groups.defence.length;
  if (!total) {
    return (
      <div className="fs-section">
        <div className="fs-status">No abilities for this phase.</div>
      </div>
    );
  }

  return (
    <div className="fs-section">
      <AbilitySubSection label="Attack"  cls="fs-attack"  items={groups.attack} />
      <AbilitySubSection label="Either"  cls="fs-either"  items={groups.either} />
      <AbilitySubSection label="Defence" cls="fs-defence" items={groups.defence} />
      <div className="fs-attribution">
        Ability data: <a href="https://wahapedia.ru" target="_blank" rel="noopener">Wahapedia</a>
      </div>
    </div>
  );
}
