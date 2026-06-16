export const keywords = {

  // ══ WEAPON ABILITIES ══════════════════════════════════════════════════════

  'ANTI-[KEYWORD] X+': [
    'Against targets with the matching keyword, an unmodified Wound roll of X+ scores a Critical Wound.',
    "Critical Wounds bypass Toughness — the wound automatically succeeds regardless of target's T.",
    'e.g. Anti-Infantry 4+ scores a Critical Wound vs INFANTRY on a 4+. Pairs powerfully with Devastating Wounds.'
  ],
  'ASSAULT': [
    'A unit with one or more Assault weapons can shoot using Assault shooting: eligible if unengaged and it made an Advance move this turn.',
    'While using Assault shooting, only Assault weapons can be selected to make attacks.'
  ],
  'BLAST': [
    'Add 1 attack die (or X for Blast X) for every 5 models in the target unit, rounding down.',
    'Cannot be used to target a unit that is Engaged, even via Close-Quarters shooting.'
  ],
  'CLEAVE X': [
    'If only one target was selected for all of this weapon\'s attacks, add X additional attack dice for every 5 models in that target unit (rounding down).',
    'e.g. A Cleave 1 weapon with 3 Attacks targeting a single 16-model unit gathers 3 extra attack dice (6 total).'
  ],
  'CLOSE-QUARTERS': [
    'A unit with one or more Close-Quarters weapons can shoot using Close-Quarters shooting: eligible if engaged and it did not Advance this turn.',
    'While using Close-Quarters shooting, your unit can target enemy units it is engaged with.',
    'Non-Monster/Vehicle models can only make attacks with Close-Quarters weapons or their other ranged weapons, never both, when using another shooting type.',
    'Formerly named [PISTOL] — both terms are identical for all rules purposes; [CLOSE-QUARTERS] is superseding [PISTOL] as this edition progresses.'
  ],
  'DEVASTATING WOUNDS': [
    'A Critical Wound (unmodified 6 to wound, or triggered by Anti-) ends the attack sequence and inflicts mortal wounds equal to the weapon\'s Damage instead of normal damage.',
    'These mortal wounds can destroy a maximum of one model per Critical Wound — any surplus from that attack is lost.',
    'Note: auto-wounds from Lethal Hits are NOT Critical Wounds and do not trigger Devastating Wounds.'
  ],
  'EXTRA ATTACKS': [
    'Attack with this weapon in addition to one other selected melee weapon.',
    'The number of attacks with this weapon cannot be modified by any rule.'
  ],
  'HAZARDOUS': [
    'After a unit with this weapon shoots or fights, make a Hazard roll (1D6) for each Hazardous weapon selected, simultaneously.',
    'On a 1-2 that roll fails: the unit suffers 1 mortal wound, or 3 mortal wounds instead if every model in the unit is a Monster/Vehicle.',
    'In an Attached unit, mortal wounds are allocated following the normal mortal wound sequence (non-Character models first).'
  ],
  'HEAVY': [
    "In your Shooting phase, add +1 to the Hit roll for a Heavy weapon if the attacking unit is unengaged, was not set up on the battlefield this turn, and no model in it has moved more than 3\" this turn."
  ],
  'IGNORES COVER': [
    'Attacks from this weapon mean the target cannot have Benefit of Cover against that attack — including Benefit of Cover granted by rules such as Stealth.'
  ],
  'INDIRECT FIRE': [
    'Lets a unit shoot using Indirect shooting: eligible if unengaged, it did not Advance this turn, and it has one or more Indirect Fire weapons. Can target units not visible to the attacking model.',
    'The target has Benefit of Cover against the attack and hit rolls cannot be re-rolled.',
    'An unmodified Hit roll of 1-5 fails — unless the attacking unit Remained Stationary this turn and the target is visible to another friendly unit, in which case only 1-3 fails.'
  ],
  'LANCE': [
    "If the bearer's unit made a Charge move this turn, add +1 to Wound rolls."
  ],
  'LETHAL HITS': [
    'A Critical Hit (unmodified 6 to hit) lets you choose to automatically wound the target instead of making a Wound roll.',
    'This auto-wound is NOT a Critical Wound and does not trigger Devastating Wounds — you can decline it for that reason.'
  ],
  'MELTA X': [
    "When targeting a unit within half the weapon's range, increase Damage by X.",
    'e.g. Melta 2 with D6 Damage = D6+2 at half range.'
  ],
  'ONE SHOT': [
    'This weapon can only be selected to make attacks with once per battle.',
    'If a destroyed model is later revived, its One Shot weapons that already fired cannot be used again. New units added to the army get a fresh use of theirs.'
  ],
  'PRECISION': [
    'When an attack is made with one or more Precision weapons against an Attached unit, you may select the allocation group containing a visible Character to be the current allocation group.',
    'This lets you single out Characters that would otherwise be shielded by their Bodyguard.'
  ],
  'PSYCHIC': [
    'A weapon or ability with this tag is a psychic attack — there is no separate Psychic phase; it is used in the Shooting or Fight phase like any other weapon.',
    'Each time a Psychic attack is made, you can ignore any or all modifiers to that attack\'s BS/WS characteristic and to the Hit roll.'
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
    'Tested in the Command phase for every unit that is currently Battle-shocked OR at/below Half-strength: roll 2D6 vs Leadership.',
    'Pass while already Battle-shocked: the unit recovers immediately. Fail: the unit (and every model in it) becomes Battle-shocked.',
    'While Battle-shocked: OC becomes "-", the unit cannot be targeted by Stratagems, and it cannot start or complete Actions.',
    'A unit that uses Desperate Escape while Falling Back and was not already Battle-shocked must make a Battle-shock roll afterwards.'
  ],
  'DEADLY DEMISE X': [
    'When a model with this ability is destroyed, after any units embarked within it make their emergency disembark moves, roll 1D6.',
    'On a 6, every unit within 6" suffers X mortal wounds (rolled separately per unit if X is random).'
  ],
  'DEEP STRIKE': [
    'Each time this unit makes an Ingress move (arriving from Strategic Reserves), if every model in the unit has this ability, it can be set up anywhere more than 8" horizontally from all enemy units — even within the opponent\'s deployment zone.'
  ],
  'FEEL NO PAIN X+': [
    'Each time a model with this ability would lose a wound, roll 1D6.',
    'On X or higher, that wound is not lost. Roll separately for each wound, after all other saves.'
  ],
  'FIGHTS FIRST': [
    'Unit fights in the Resolve Fights First Combats step of the Fight phase, before Remaining Combats.',
    'Any unit that completed a Charge move this turn also gains Fights First until end of turn.',
    'If both players have eligible Fights First units, the active player selects one first, then players alternate.'
  ],
  'FIGHTS LAST': [
    'Unit fights only after all units without Fights Last have fought in Remaining Combats.',
    'Fight order: Fights First → Remaining Combats (Fights Last units last) → if several Fights Last units remain, the active player chooses the order.'
  ],
  'FIRING DECK X': [
    'When this Transport is selected to shoot, it can also use up to X embarked models\' ranged weapons (excluding One Shot weapons) in addition to its own.',
    'Until the end of the turn, units embarked within this Transport are not eligible to shoot themselves.'
  ],
  'HOVER': [
    'Each time this unit takes to the skies while making a Normal, Advance, Fall Back, or Charge move, do not subtract 2" from that move\'s maximum distance (unlike other FLY units).'
  ],
  'INFILTRATORS': [
    'During deployment, if every model in the unit has this ability, it can be set up anywhere on the battlefield more than 8" horizontally from the enemy deployment zone and all enemy units.'
  ],
  'LEADER': [
    'Before the battle, in the Muster Armies step, this Leader unit can be attached to one of its listed Bodyguard units, forming an Attached unit. Support units form Attached units the same way.',
    'While Attached, attacks against the unit use the highest Toughness among its Bodyguard models (or among the Leader/Support models if no Bodyguard remain).',
    'Rules triggered when a unit is destroyed only trigger once the last model that started the battle in the Attached unit is destroyed.'
  ],
  'LONE OPERATIVE': [
    'Unless part of an Attached unit, this unit is not visible to enemy models unless they are within 12" (or its stated range) of it, and cannot be targeted by Indirect Fire weapons from further away.',
    'Does not affect melee targeting.'
  ],
  'OBJECTIVE SECURED': [
    'When an objective is secured by your army, it remains under your control — even once you have no units within range of it — until your opponent\'s level of control becomes greater than yours at the end of a phase.',
    "Battle-shocked units' OC is '-' and cannot contribute to a player's level of control over an objective."
  ],
  'SCOUTS X"': [
    'In the Resolve Pre-battle Abilities step (after Declare Battle Formations, before Begin the Battle), if every model in a unit has this ability:',
    'A unit in Strategic Reserves can instead be set up wholly within your deployment zone, or a unit already wholly within your deployment zone can make a Scout move of up to X".',
    'A Scout move must end more than 8" horizontally from all enemy units. The first player to move Scouts units does so first; players then alternate.'
  ],
  'SMOKE': [
    'Unit keyword that enables the Smokescreen Core Stratagem (1 CP).',
    "When triggered at the start of the opponent's Shooting phase: attacks against this unit, or against a unit not fully visible because of it, give the target Benefit of Cover until end of phase."
  ],
  'STEALTH': [
    'If every model in the unit has this ability, each time a ranged attack targets the unit, it has Benefit of Cover against that attack — worsening the attacking weapon\'s BS by 1.',
    'Stacks with terrain-based Benefit of Cover the normal way (it does not apply twice; Benefit of Cover is binary).'
  ],

  // ══ VEHICLE / MONSTER SPECIAL RULES ══════════════════════════════════════

  'MONSTER': [
    'Unit type keyword — Monster models can shoot and fight while Engaged, even with non-Close-Quarters weapons (at -1 to Hit unless using a Close-Quarters weapon against an engaged target).',
    'Hazard rolls (e.g. from Hazardous weapons) inflict 3 mortal wounds instead of 1 on a unit where every model is a Monster/Vehicle.',
    'Many Monster datasheets have a Damaged threshold — characteristics are reduced when wounds drop below a set level.'
  ],
  'VEHICLE': [
    'Unit type keyword — Vehicle models can shoot and fight while Engaged, even with non-Close-Quarters weapons (at -1 to Hit unless using a Close-Quarters weapon against an engaged target).',
    'Hazard rolls (e.g. from Hazardous weapons) inflict 3 mortal wounds instead of 1 on a unit where every model is a Monster/Vehicle.',
    'Many Vehicle datasheets have a Damaged threshold — characteristics are reduced when wounds drop below a set level.'
  ],
  'ATTACHED UNIT': [
    'A unit containing a Leader or Support model and its Bodyguard — treated as a single unit for all rules purposes.',
    'Attacks against the unit use the highest Toughness among Bodyguard models; mortal wounds are allocated using the normal mortal wound sequence, which selects damaged non-Character models first.',
    'Characters can only be singled out via the Precision weapon ability while Bodyguard models remain.'
  ],
  'DAMAGED: X WOUNDS REMAINING': [
    'When reduced to X or fewer wounds, certain characteristics (Attacks, BS/WS) are reduced.',
    'Represents the model being crippled — exact threshold and penalty are listed on each datasheet.',
    'Healed wounds do not restore the lost characteristics once the threshold is crossed.'
  ],

  // ══ CORE STRATAGEMS (available to all armies) ════════════════════════════

  'COMMAND RE-ROLL': [
    '1 CP — Any phase, just after you make an Advance, Charge, Damage, Hazard, Hit, Save, or Wound roll (or a roll to determine the number of attacks generated by a weapon) for a friendly unit or model.',
    'Re-roll that roll. If rolling more than one die together, select one die to re-roll (charge rolls must be re-rolled in full).'
  ],
  'COUNTEROFFENSIVE': [
    '2 CP — Fight step of your opponent\'s Fight phase, just after an enemy unit has resolved its attacks.',
    'One friendly unit that is eligible to fight gains Fights First until end of phase and must be the next unit you select to fight.'
  ],
  'EPIC CHALLENGE': [
    '1 CP — Fight phase, just after a friendly CHARACTER unit is selected to fight.',
    "Select one Character model in that unit — until the end of the phase, that model's melee weapons gain [PRECISION]."
  ],
  'FIRE OVERWATCH': [
    "1 CP — End of your opponent's Movement phase.",
    'One friendly unengaged unit (excluding TITANIC units) shoots using Snap Shooting: target one visible enemy unit within 24", hitting only on unmodified 6s, no re-rolls.'
  ],
  'EXPLOSIVES': [
    '1 CP — Your Shooting phase.',
    'One friendly unengaged EXPLOSIVES/GRENADES unit that is eligible to shoot and did not Advance this turn rolls 6D6 against one unengaged enemy unit within 8" and visible to it — each 4+ deals 1 mortal wound.',
    'Formerly named GRENADE.'
  ],
  'HEROIC INTERVENTION': [
    "1 CP — End of your opponent's Charge phase.",
    'One friendly unengaged unit within 12" of one or more enemy units (Vehicles only if Character/Walker) resolves a charge, selecting one mode before the charge roll:',
    'Leap to Defend: can only target enemy units that made a charge move this phase.',
    'Into the Fray (+1 CP): cap the charge roll at 6, and can target any enemy unit within 6".'
  ],
  'INSANE BRAVERY': [
    '1 CP — Battle-shock step of your Command phase, just before a Battle-shock roll is made for a friendly unit. Once per battle.',
    'That battle-shock roll is automatically successful — use this before rolling, not after failing.'
  ],
  'RAPID INGRESS': [
    "1 CP — End of your opponent's Movement phase.",
    'One friendly unit in Strategic Reserves (excluding AIRCRAFT) makes an Ingress move immediately. Cannot be used during the first battle round.'
  ],
  'SMOKESCREEN': [
    "1 CP — Start of your opponent's Shooting phase.",
    'Target one friendly SMOKE unit. Until end of phase, attacks against it (or against a unit not fully visible because of it) give the target Benefit of Cover.'
  ],
  'CRUSHING IMPACT': [
    '1 CP — Your Charge phase, just after a friendly MONSTER/VEHICLE unit ends a charge move.',
    'Select one enemy unit engaged with it and one of your models engaged with that enemy. Roll a number of D6 equal to that model\'s Toughness: each 1 deals your unit 1 mortal wound; each 5+ deals the enemy unit 1 mortal wound (max 6 mortal wounds per unit).',
    'Formerly named TANK SHOCK.'
  ],
};

export const coreAlwaysVisible = new Set([
  'BATTLE-SHOCK', 'COMMAND RE-ROLL', 'INSANE BRAVERY', 'COUNTEROFFENSIVE',
  'EPIC CHALLENGE', 'FIRE OVERWATCH', 'EXPLOSIVES', 'CRUSHING IMPACT',
  'HEROIC INTERVENTION', 'RAPID INGRESS', 'SMOKESCREEN',
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
  if (t === 'PISTOL') return 'CLOSE-QUARTERS';
  if (t === 'GRENADE' || t === 'GRENADES') return 'EXPLOSIVES';
  if (t === 'TANK SHOCK') return 'CRUSHING IMPACT';
  const patterns = [
    [/^RAPID FIRE \d+$/, 'RAPID FIRE X'],
    [/^SUSTAINED HITS \d+$/, 'SUSTAINED HITS X'],
    [/^MELTA \d+$/, 'MELTA X'],
    [/^CLEAVE \d+$/, 'CLEAVE X'],
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
  if (upperText.includes('PISTOL')) into.add('CLOSE-QUARTERS');
  if (upperText.includes('GRENADE')) into.add('EXPLOSIVES');
  if (upperText.includes('TANK SHOCK')) into.add('CRUSHING IMPACT');
}
