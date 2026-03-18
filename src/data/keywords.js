export const keywords = {

  // ══ WEAPON ABILITIES ══════════════════════════════════════════════════════

  'ANTI-[KEYWORD] X+': [
    'Against targets with the matching keyword, an unmodified Wound roll of X+ scores a Critical Wound.',
    "Critical Wounds bypass Toughness — the wound automatically succeeds regardless of target's T.",
    'e.g. Anti-Infantry 4+ scores a Critical Wound vs INFANTRY on a 4+. Pairs powerfully with Devastating Wounds.'
  ],
  'ASSAULT': [
    "Can shoot even if the bearer's unit Advanced this turn.",
    'If the unit Advanced and shoots, it may only use Assault weapons that turn.'
  ],
  'BLAST': [
    'Add +1 to Attacks for every 5 models in the target unit (round down).',
    'Cannot target units within Engagement Range of any friendly units.'
  ],
  'DEVASTATING WOUNDS': [
    'A Critical Wound (unmodified 6 to wound, or triggered by Anti-) bypasses all saves — including invulnerable.',
    "Inflicts mortal wounds equal to the weapon's Damage instead of normal damage.",
    'Note: auto-wounds from Lethal Hits are NOT Critical Wounds and do not trigger Devastating Wounds.'
  ],
  'EXTRA ATTACKS': [
    'Attack with this weapon in addition to one other selected melee weapon.',
    'The number of attacks with this weapon cannot be modified by any rule.'
  ],
  'HAZARDOUS': [
    'After shooting or fighting, roll 1D6 per Hazardous weapon used.',
    'On a 1: CHARACTER, VEHICLE, or MONSTER suffers 3 mortal wounds; otherwise one model is destroyed.',
    'In an Attached unit, mortal wounds from Hazardous are allocated to the Character model, not bodyguards.'
  ],
  'HEAVY': [
    "If the bearer's unit Remained Stationary this turn, add +1 to Hit rolls."
  ],
  'IGNORES COVER': [
    'Attacks from this weapon ignore Benefit of Cover — targets cannot apply the +1 save from Light or Dense Cover.'
  ],
  'INDIRECT FIRE': [
    'Can target units not visible to the attacking model.',
    'If no models in the target are visible: -1 to Hit rolls and target has Benefit of Cover.'
  ],
  'LANCE': [
    "If the bearer's unit made a Charge move this turn, add +1 to Wound rolls."
  ],
  'LETHAL HITS': [
    'A Critical Hit (unmodified 6 to hit) automatically wounds — no Wound roll is made.',
    'This auto-wound is NOT a Critical Wound and does not trigger Devastating Wounds.'
  ],
  'MELTA X': [
    "When targeting a unit within half the weapon's range, increase Damage by X.",
    'e.g. Melta 2 with D6 Damage = D6+2 at half range.'
  ],
  'ONE SHOT': [
    'This weapon can only be fired once per battle.',
    'Track usage — after firing it cannot be used again for the rest of the game.'
  ],
  'PISTOL': [
    'Can shoot while within Engagement Range of enemies.',
    'Must target one of the enemy units in Engagement Range.',
    'Cannot mix with non-Pistol weapons when shooting (unless the model is a MONSTER or VEHICLE).'
  ],
  'PRECISION': [
    'When an attack wounds an Attached unit, the attacker may allocate it to any visible CHARACTER in that unit.',
    'Allocate all Precision attacks that wound before making any saving throws.'
  ],
  'PSYCHIC': [
    'This attack or ability counts as a Psychic Attack.',
    'No separate Psychic phase — Psychic weapons are used during Shooting or Fight phases like any other weapon.',
    'Any model armed with a Psychic weapon can use it regardless of whether it has the PSYKER keyword.'
  ],
  'RAPID FIRE X': [
    "When targeting a unit within half the weapon's range, increase Attacks by X.",
    'e.g. Rapid Fire 1 at half range = +1 Attack.'
  ],
  'SUSTAINED HITS X': [
    'A Critical Hit (unmodified 6 to hit) scores X additional hits.',
    'e.g. Sustained Hits 2: each Critical Hit generates 2 extra hits that then wound normally.'
  ],
  'TORRENT': [
    'Attacks automatically hit — no Hit roll required.',
    'Wound rolls, saving throws, and damage are still resolved normally.'
  ],
  'TWIN-LINKED': [
    'You may re-roll the Wound roll for each attack made with this weapon.'
  ],

  // ══ UNIT ABILITIES ════════════════════════════════════════════════════════

  'BATTLE-SHOCK': [
    'Tested in Command phase for each unit Below Half-strength: roll 2D6 vs Leadership.',
    'If failed, unit is Battle-shocked until next Command phase: OC becomes 0, cannot use Stratagems.',
    'Battle-shocked units must take Desperate Escape tests (D6 per model, 1-2 = destroyed) when Falling Back.'
  ],
  'DEADLY DEMISE X': [
    'When this model is destroyed, roll 1D6 before removing it.',
    'On a 6, every unit within 6" suffers X mortal wounds.',
    'Models disembarking a destroyed Transport are not affected; instead roll D6 per model — on a 1, that unit suffers 1 mortal wound.'
  ],
  'DEEP STRIKE': [
    'Unit can be held in Reserves and deployed during the Reinforcements step of any Movement phase.',
    'Every model must be placed more than 9" horizontally from all enemy models on arrival.',
    'Cannot arrive in Battle Round 1 in standard matched play unless a specific rule overrides this.'
  ],
  'FEEL NO PAIN X+': [
    'Each time this model would lose a wound (including from mortal wounds), roll 1D6.',
    'On X or higher, that wound is not lost. Roll separately for each wound.',
    'Common values: 4+, 5+, 6+. Resolved after all other saves.'
  ],
  'FIGHTS FIRST': [
    'Unit fights in the Fights First step of the Fight phase.',
    'All units that made a Charge move this turn also gain Fights First until end of turn.',
    'Defending player selects eligible Fights First units before the active player.'
  ],
  'FIGHTS LAST': [
    'Unit fights after all units without Fights Last have fought in Remaining Combats.',
    'Fight order: Fights First → Remaining Combats → Fights Last.',
    'If multiple Fights Last units remain, the active player chooses the order.'
  ],
  'FIRING DECK X': [
    'When this TRANSPORT shoots, it can make additional attacks using up to X weapons from embarked models.',
    "The transport makes these attacks — rules affecting the transport apply, not the embarked model's rules.",
    'Cannot be used for Overwatch or other out-of-phase shooting.'
  ],
  'HOVER': [
    'Declare Hover mode at the start of the battle or when deployed. Lasts the rest of the battle.',
    'While in Hover mode: Move becomes 20" and the AIRCRAFT keyword and all Aircraft movement rules are lost.',
    'Hover models deploy and operate like standard units — not automatically placed in Reserves.'
  ],
  'INFILTRATORS': [
    'Set up during Deployment anywhere more than 9" from the enemy deployment zone and all enemy models.',
    'Cannot be placed in Reserves — they deploy directly onto the battlefield.',
    'If both players have Infiltrators, the first player deploys theirs first, then players alternate.'
  ],
  'LEADER': [
    'Before the battle, this CHARACTER can attach to one of its listed Bodyguard units, forming an Attached unit.',
    "While Attached: wounds allocated to Bodyguard first; CHARACTER uses Bodyguard's Toughness.",
    'Once all Bodyguard models are destroyed, the CHARACTER operates as a standalone unit.'
  ],
  'LONE OPERATIVE': [
    'Cannot be selected as a ranged attack target unless the attacking model is within 12".',
    'Does not affect melee targeting.'
  ],
  'OBJECTIVE SECURED': [
    'While this unit is on an objective, it controls it even if an enemy unit is also present.',
    'If both sides have ObjSec units on the same objective, the player with more ObjSec models controls it.',
    "Battle-shocked units' OC is 0 and cannot contribute to objective control."
  ],
  'SCOUTS X"': [
    'Before the first battle round begins (after deployment), this unit can make a Normal Move of up to X".',
    'Cannot end within Engagement Range of enemy units. Cannot declare a Charge in the first battle round.',
    'First player moves their Scouts units first; players then alternate.'
  ],
  'SMOKE': [
    'Unit keyword that enables the Smokescreen Core Stratagem (1 CP).',
    "When triggered in the opponent's Shooting phase: this unit gains Benefit of Cover and Stealth until end of phase."
  ],
  'STEALTH': [
    'Enemy units targeting this unit from more than 12" away suffer -1 to Hit rolls.',
    'Subject to the standard modifier cap — maximum -1 total penalty from all sources combined.'
  ],

  // ══ VEHICLE / MONSTER SPECIAL RULES ══════════════════════════════════════

  'MONSTER': [
    'Unit type keyword — MONSTER models can shoot and fight while in Engagement Range, even with non-Pistol weapons.',
    'Hazardous rolls of 1 inflict 3 mortal wounds on the MONSTER model rather than destroying it outright.',
    'Many MONSTER datasheets have a DAMAGED threshold — characteristics are reduced when wounds drop below a set level.'
  ],
  'VEHICLE': [
    'Unit type keyword — VEHICLE models can shoot and fight while in Engagement Range, even with non-Pistol weapons.',
    'Hazardous rolls of 1 inflict 3 mortal wounds on the VEHICLE model rather than destroying it outright.',
    'Many VEHICLE datasheets have a DAMAGED threshold — characteristics are reduced when wounds drop below a set level.'
  ],
  'ATTACHED UNIT': [
    'A unit containing a LEADER — the Character and Bodyguard are treated as a single unit.',
    'Wounds are always allocated to Bodyguard models until all are destroyed.',
    'Characters can only be singled out via the Precision weapon ability while Bodyguard remain.'
  ],
  'DAMAGED: X WOUNDS REMAINING': [
    'When reduced to X or fewer wounds, certain characteristics (Attacks, BS/WS) are reduced.',
    'Represents the model being crippled — exact threshold and penalty are listed on each datasheet.',
    'Healed wounds do not restore the lost characteristics once the threshold is crossed.'
  ],

  // ══ CORE STRATAGEMS (available to all armies) ════════════════════════════

  'COMMAND RE-ROLL': [
    '1 CP — Any phase.',
    'Re-roll one Advance, Charge, Desperate Escape, Hazardous, Hit, Wound, Damage, or Save roll for one unit.'
  ],
  'COUNTER-OFFENSIVE': [
    '2 CP — Fight phase, just after an enemy unit fights.',
    'One of your units in Engagement Range that has not yet fought this phase fights next.'
  ],
  'EPIC CHALLENGE': [
    '1 CP — Fight phase, when a CHARACTER unit is selected to fight.',
    "One Character model's melee attacks gain [PRECISION] for the phase."
  ],
  'FIRE OVERWATCH': [
    "1 CP — Opponent's Movement or Charge phase, when an enemy unit is selected to move or charge.",
    'One friendly unit within 24" of the moving/arriving enemy shoots at it — hits only on unmodified 6s. Once per turn.'
  ],
  'GO TO GROUND': [
    "1 CP — Opponent's Shooting phase, when one of your INFANTRY units is selected as the target.",
    'That unit gains a 6+ invulnerable save and Benefit of Cover until end of phase.'
  ],
  'GRENADE': [
    '1 CP — Your Shooting phase.',
    'A GRENADES unit not in Engagement Range rolls 6D6 against a visible enemy within 8" — each 4+ deals 1 mortal wound.'
  ],
  'HEROIC INTERVENTION': [
    "2 CP — Opponent's Charge phase, after an enemy Charge move is made.",
    'One friendly unit within 6" of the charging enemy makes an immediate charge against it. No Fights First bonus.',
    'VEHICLE units may only use this if they also have the WALKER keyword.'
  ],
  'INSANE BRAVERY': [
    '1 CP — Command phase, Battle-shock step. Once per battle.',
    'One unit automatically passes one Battle-shock test.'
  ],
  'NEW ORDERS': [
    '1 CP — Your Command phase or end of any of your phases. Once per battle.',
    'Discard your current Secondary Mission card and draw a new one.'
  ],
  'RAPID INGRESS': [
    "1 CP — End of opponent's Movement phase (Reinforcements step).",
    'One of your Reserves units arrives immediately using normal Reinforcements rules.',
    'Deep Strike rules apply if the unit has Deep Strike. Cannot arrive a round earlier than normally allowed.'
  ],
  'SMOKESCREEN': [
    "1 CP — Opponent's Shooting phase, when a SMOKE unit is selected as a target.",
    'That unit gains Benefit of Cover and Stealth until end of phase.'
  ],
  'TANK SHOCK': [
    '1 CP — Charge phase, after a VEHICLE unit makes a Charge move.',
    "Select one enemy unit in Engagement Range; roll dice equal to one melee weapon's Strength — each 5+ deals 1 mortal wound."
  ],
};

export const coreAlwaysVisible = new Set([
  'BATTLE-SHOCK', 'COMMAND RE-ROLL', 'INSANE BRAVERY', 'COUNTER-OFFENSIVE',
  'EPIC CHALLENGE', 'FIRE OVERWATCH', 'GO TO GROUND', 'GRENADE',
  'HEROIC INTERVENTION', 'NEW ORDERS', 'RAPID INGRESS', 'SMOKESCREEN', 'TANK SHOCK',
  'OBJECTIVE SECURED', 'LEADER', 'ATTACHED UNIT', 'FIGHTS FIRST', 'FIGHTS LAST',
  'MONSTER', 'VEHICLE',
]);

export const stratagemKeywords = new Set(
  Object.entries(keywords)
    .filter(([, rules]) => /^\d+ CP/i.test(rules[0] || ''))
    .map(([kw]) => kw)
);

export function normalizeKeyword(raw) {
  const t = raw.trim().toUpperCase();
  if (keywords[t]) return t;
  const patterns = [
    [/^RAPID FIRE \d+$/, 'RAPID FIRE X'],
    [/^SUSTAINED HITS \d+$/, 'SUSTAINED HITS X'],
    [/^MELTA \d+$/, 'MELTA X'],
    [/^SCOUTS? \d+"?$/, 'SCOUTS X"'],
    [/^FEEL NO PAIN \d\+$/, 'FEEL NO PAIN X+'],
    [/^DEADLY DEMISE (?:D\d+|\d+)$/, 'DEADLY DEMISE X'],
    [/^ANTI-.+ \d\+$/, 'ANTI-[KEYWORD] X+'],
    [/^FIRING DECK \d+$/, 'FIRING DECK X'],
    [/^TWIN.+/, 'TWIN-LINKED'],
  ];
  for (const [re, mapped] of patterns) if (re.test(t)) return mapped;
  return null;
}

export function scanTextForKeywords(upperText, into) {
  for (const kw of Object.keys(keywords)) {
    const base = kw.replace(/ X\+?$/, '').replace(/ X"$/, '').replace(/\[KEYWORD\] /, '');
    if (upperText.includes(base)) { into.add(kw); continue; }
    if (base.endsWith('S') && upperText.includes(base.slice(0, -1))) into.add(kw);
  }
}
