export const phases = [
  {
    id: 'command',
    title: 'Command Phase',
    items: [
      { type: 'action', text: 'Gain Core CP — both players gain 1 Command Point (CP), spent to activate Stratagems during any phase' },
      { type: 'action', text: 'Resolve army abilities — activate any faction or detachment abilities that trigger at the start of your Command phase (see abilities listed below)' },
      { type: 'command-abilities' },
      { type: 'action', text: 'Battle-shock — make a battle-shock roll (2D6 vs Leadership) for every unit that is currently Battle-shocked OR at/below Half-strength', keywords: ['BATTLE-SHOCK', 'INSANE BRAVERY'] },
      { type: 'note', text: 'Pass: if the unit was Battle-shocked, it recovers immediately. Fail: the unit (and every model in it) is Battle-shocked — OC becomes "-", it cannot be targeted by Stratagems, and it cannot start or complete Actions', keywords: ['BATTLE-SHOCK'] },
    ]
  },
  {
    id: 'movement',
    title: 'Movement Phase',
    items: [
      { type: 'action', text: 'Select each unit to move, one at a time — Remain Stationary, Normal, Advance, Fall Back, Disembark, or Ingress (Reserves arriving)' },
      { type: 'note', text: 'Normal and Advance moves require your unit to be unengaged' },
      { type: 'note', text: 'Advance: roll 1D6 and add it to your Move characteristic for this move. Afterwards your unit cannot declare a charge or start an Action this turn — exception: it can still shoot using Assault weapons', keywords: ['ASSAULT'], playerOnly: true },
      { type: 'note', text: 'Fall Back: your unit must be engaged. Select Ordered Retreat (only if not Battle-shocked) or Desperate Escape (mandatory otherwise — make a Hazard roll for each model). Afterwards your unit cannot shoot, charge, or start an Action this turn; if it used Desperate Escape and was not already Battle-shocked, it must also make a Battle-shock roll', keywords: ['BATTLE-SHOCK'] },
      { type: 'note', text: 'Leader / Support: Attached units (a Character or Support model plus its Bodyguard) move together as a single unit — they cannot separate', keywords: ['LEADER', 'ATTACHED UNIT'] },
      { type: 'note', text: 'Taking to the Skies: a FLY unit making a Normal, Advance, or Fall Back move can declare it will take to the skies — subtract 2" from the move\'s maximum distance (Hover models do not subtract this), then it can move through any models and terrain, ignoring vertical distance', keywords: ['HOVER'], playerOnly: true },
      { type: 'action', text: 'Ingress — units in Strategic Reserves can arrive now via an Ingress move. Units with Deep Strike can be set up anywhere more than 8" horizontally from all enemy units', keywords: ['DEEP STRIKE'] },
    ]
  },
  {
    id: 'shooting',
    title: 'Shooting Phase',
    items: [
      { type: 'action', text: 'Select a unit, then select its shooting type — Normal, Assault, Close-Quarters, or Indirect', keywords: ['INDIRECT FIRE'] },
      { type: 'note', text: 'Normal shooting: unit must be unengaged and must not have made an Advance move this turn' },
      { type: 'note', text: 'Assault shooting: unit must be unengaged, must have Advanced this turn, and must have one or more Assault weapons — only Assault weapons can be selected to make attacks', keywords: ['ASSAULT'], playerOnly: true },
      { type: 'note', text: 'Close-Quarters shooting: unit must be engaged, must not have Advanced this turn, and must have a Close-Quarters weapon or be a Monster/Vehicle — it can target enemy units it is engaged with. Monster/Vehicle models suffer -1 to Hit unless attacking with a Close-Quarters weapon at an engaged target; Blast weapons still cannot target an engaged unit', keywords: ['CLOSE-QUARTERS', 'MONSTER', 'VEHICLE', 'BLAST'], playerOnly: true },
      { type: 'note', text: 'Indirect shooting: unit must be unengaged, must not have Advanced this turn, and must have an Indirect Fire weapon — it can target units that are not visible. The target gets Benefit of Cover, hit rolls cannot be re-rolled, and an unmodified hit roll of 1-5 fails (1-3 if your unit Remained Stationary and the target is visible to another friendly unit)', keywords: ['INDIRECT FIRE'], playerOnly: true },
      { type: 'note', text: 'Units in Engagement Range can only use Close-Quarters shooting — Monsters, Vehicles, or units with a Close-Quarters (formerly Pistol) weapon', keywords: ['CLOSE-QUARTERS', 'MONSTER', 'VEHICLE'] },
      { type: 'note', text: 'Your Lone Operative units cannot be targeted by ranged attacks from more than 12" away (or its stated range)', keywords: ['LONE OPERATIVE'], playerOnly: true },
      { type: 'note', text: 'Enemy Lone Operative: you cannot target an enemy unit with this ability from more than 12" away (or its stated range)', keywords: ['LONE OPERATIVE'], enemyOnly: true },
      { type: 'note', text: 'One Shot: track any One Shot weapons used this turn — they cannot be selected to make attacks with again this battle', keywords: ['ONE SHOT'], playerOnly: true },
      { type: 'note', text: "Firing Deck: a Transport with this ability can use up to X embarked models' ranged weapons in addition to its own when it shoots", keywords: ['FIRING DECK X'], playerOnly: true },
      { type: 'note', text: 'Torrent: attacks automatically hit, skip the Hit roll', keywords: ['TORRENT'], playerOnly: true },
      { type: 'note', text: 'Rapid Fire X: if the target was within half range when targeted, add X attack dice', keywords: ['RAPID FIRE X'], playerOnly: true },
      { type: 'note', text: 'Blast: add 1 attack die (or X for Blast X) per 5 models in the target unit, rounding down. Cannot target a unit that is Engaged', keywords: ['BLAST'], playerOnly: true },
      { type: 'note', text: 'Heavy: in your Shooting phase, add +1 to the Hit roll if the attacking unit is unengaged, was not set up this turn, and has not moved more than 3" this turn', keywords: ['HEAVY'], playerOnly: true },
      { type: 'note', text: 'Benefit of Cover — if the target has Benefit of Cover against this attack, worsen the attacking weapon\'s BS characteristic by 1 before rolling Hit rolls (applies once per attack, regardless of source)' },
      { type: 'action', text: 'Roll Hit rolls — roll 1D6 per attack vs. the weapon\'s BS; equal or beat it to hit. Unmodified 6 = Critical Hit', keywords: ['LETHAL HITS', 'SUSTAINED HITS X'] },
      { type: 'action', text: 'Roll Wound rolls — compare Strength vs Toughness (S≥2×T: 2+, S>T: 3+, S=T: 4+, S<T: 5+, S≤½T: 6+). Unmodified 6 = Critical Wound', keywords: ['DEVASTATING WOUNDS', 'ANTI-[KEYWORD] X+'] },
      { type: 'action', text: 'Apply AP to saving throws — subtract AP from armour Save; roll 1D6 per wound and meet/beat it to block. Invulnerable saves ignore AP entirely' },
      { type: 'note', text: 'Your Feel No Pain: your models with this ability may roll to negate a lost wound after saves', keywords: ['FEEL NO PAIN X+'], playerOnly: true },
      { type: 'note', text: 'Enemy Feel No Pain: after your attacks wound, enemy models with this ability may roll to negate those lost wounds', keywords: ['FEEL NO PAIN X+'], enemyOnly: true },
      { type: 'note', text: 'Ignores Cover: the target cannot have Benefit of Cover against this attack, even from Stealth', keywords: ['IGNORES COVER'], playerOnly: true },
      { type: 'note', text: 'Twin-linked: re-roll the Wound roll', keywords: ['TWIN-LINKED'], playerOnly: true },
      { type: 'note', text: 'Melta X: if the target was within half range when targeted, add X to Damage', keywords: ['MELTA X'], playerOnly: true },
      { type: 'note', text: 'Mortal wounds are resolved one at a time: select a non-Character model that has already lost a wound, otherwise any non-Character model, otherwise a damaged Character, otherwise any Character. Devastating Wounds can only destroy one model per Critical Wound — any surplus mortal wounds from that attack are lost' },
      { type: 'note', text: 'After shooting: make a Hazard roll for each Hazardous weapon used this phase — on a 1-2, the unit suffers 1 mortal wound (3 if every model in the unit is a Monster/Vehicle)', keywords: ['HAZARDOUS'], playerOnly: true },
      { type: 'note', text: 'Your Deadly Demise: if a model with this ability is destroyed, roll D6 — on a 6, every unit within 6" suffers mortal wounds', keywords: ['DEADLY DEMISE X'], playerOnly: true },
      { type: 'note', text: 'Enemy Deadly Demise: when you destroy an enemy model with this ability, roll D6 — on a 6, your nearby units take mortal wounds', keywords: ['DEADLY DEMISE X'], enemyOnly: true },
    ]
  },
  {
    id: 'charge',
    title: 'Charge Phase',
    items: [
      { type: 'action', text: "Declare Charge — select an eligible unit: on the battlefield, unengaged, hasn't Advanced or Fallen Back this turn, and within 12\" of one or more enemy units" },
      { type: 'note', text: 'Charge targets do not need to be visible' },
      { type: 'action', text: 'Charge Roll — roll 2D6, the result is the maximum distance for the charge move. Select one or more enemy units within 12" and within that distance as charge targets, then attempt the move: every model must end closer to a charge target, engaged with one if possible, and the unit must end engaged with all of its charge targets and no other enemy unit', keywords: ['COMMAND RE-ROLL'] },
      { type: 'note', text: 'A unit that completes a charge move gains the Fights First ability until the end of the turn', keywords: ['FIGHTS FIRST'] },
      { type: 'note', text: 'Heroic Intervention (1CP, end of opponent\'s Charge phase): one of your unengaged units within 12" of an enemy unit can charge. Leap to Defend — can only target enemies that charged this phase. Into the Fray (+1CP) — charge roll is capped at 6, and can target any enemy within 6"', keywords: ['HEROIC INTERVENTION'] },
    ]
  },
  {
    id: 'fight',
    title: 'Fight Phase',
    items: [
      { type: 'action', text: 'Pile In — each unit that is Engaged, charged this turn, or is making an Overrun Fight can move up to 3" toward its pile-in targets (engaged enemies, or any enemy within 5" if unengaged), ending engaged if possible. The active player resolves all of their pile-in moves first', keywords: ['FIGHTS FIRST'] },
      { type: 'note', text: 'Fights First: units that charged this turn or otherwise have this ability fight before Remaining Combats. If both players have eligible Fights First units, the active player selects first, then players alternate', keywords: ['FIGHTS FIRST'] },
      { type: 'note', text: 'Fights Last: these units fight only after all other eligible units have fought in Remaining Combats; if several remain, the active player chooses the order', keywords: ['FIGHTS LAST'] },
      { type: 'action', text: 'Select units to fight — alternate (active player first in Fights First, then whoever moved into Remaining Combats) choosing one eligible unit at a time', keywords: ['COUNTEROFFENSIVE'] },
      { type: 'note', text: 'Normal Fight: your unit is engaged. Overrun Fight: your unit is unengaged now (or was engaged at the start of the Fight step) — it makes one extra pile-in move, then fights, potentially engaging units that hadn\'t fought yet' },
      { type: 'note', text: 'Lance: add +1 to the Wound roll if the bearer\'s unit made a charge move this turn', keywords: ['LANCE'], playerOnly: true },
      { type: 'note', text: 'Extra Attacks: the bearer attacks with this weapon in addition to one other selected melee weapon', keywords: ['EXTRA ATTACKS'], playerOnly: true },
      { type: 'note', text: 'Precision: when targeting an Attached unit, you may allocate the attack to a visible Character', keywords: ['PRECISION'], playerOnly: true },
      { type: 'action', text: 'Attack — Select weapon & targets.\nRoll Hit rolls (unmod 6s = Critical Hits) Wound rolls (unmod 6s = Critical Wounds)\nRoll saves (modified by AP) (Invulnerability cannot be modified)\nApply damage', keywords: ['LETHAL HITS', 'SUSTAINED HITS X', 'DEVASTATING WOUNDS', 'ANTI-[KEYWORD] X+'] },
      { type: 'note', text: 'Your Feel No Pain: your models with this ability may roll to negate a lost wound after saves', keywords: ['FEEL NO PAIN X+'], playerOnly: true },
      { type: 'note', text: 'Enemy Feel No Pain: after your attacks wound, enemy models with this ability may roll to negate those lost wounds', keywords: ['FEEL NO PAIN X+'], enemyOnly: true },
      { type: 'note', text: 'Twin-linked: re-roll the Wound roll', keywords: ['TWIN-LINKED'], playerOnly: true },
      { type: 'note', text: 'After fighting: make a Hazard roll for each Hazardous weapon used this phase — on a 1-2, the unit suffers 1 mortal wound (3 if every model in the unit is a Monster/Vehicle)', keywords: ['HAZARDOUS'], playerOnly: true },
      { type: 'note', text: 'Your Deadly Demise: if a model with this ability is destroyed in this fight, roll D6 — on a 6, every unit within 6" suffers mortal wounds', keywords: ['DEADLY DEMISE X'], playerOnly: true },
      { type: 'note', text: 'Enemy Deadly Demise: when you destroy an enemy model with this ability, roll D6 — on a 6, your nearby units take mortal wounds', keywords: ['DEADLY DEMISE X'], enemyOnly: true },
      { type: 'action', text: 'Consolidate — each unit that was eligible to fight this phase selects a mandatory mode: Ongoing (if engaged, move up to 3" toward an engaged enemy, staying engaged), Engaging (else if within 3" of an enemy, move toward and engage one), or Objective (else if within 3" of an objective, move into/closer to range of it)' },
      { type: 'note', text: 'Engaging Consolidation can pull in enemy units that haven\'t fought yet — each becomes eligible and must be selected to fight before the Fight step ends' },
      { type: 'note', text: 'Remaining Combats: all remaining eligible units now fight in this step — no unit can fight more than once per phase. If a new Fights First unit becomes eligible, return to Fights First before continuing', keywords: ['FIGHTS FIRST'] },
    ]
  },
];

export const PHASE_ICONS = {
  command:  { label: 'Command',  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.84 22.42"><path fill="currentColor" d="M2.4,3.2c0-0.3,0.5-0.7,0.7-0.9C3.7,1.8,4.6,1,5.5,0.6c1.8-0.7,4.3-1,6,0.6c0.8,0.7,1.3,1.6,2,2.3c1,1.1,1.2,1.2,2.2,1.8c0,0,0.9,0.5,1.2,0.6c0.8,0.3,1.6,0.4,2,0.3l0.9-0.1c0,0,0,0.3-0.1,0.4c-0.1,0.2-0.3,0.4-0.7,0.8C18.1,8,17,8.6,15.8,8.7c-1.9,0.2-3.6-0.8-5.4-1.1c-1-0.3-2.1-0.2-3.2,0.1c-1.9,0.6-3.6,1.9-4.7,3.5L2.4,3.2z"/><rect fill="currentColor" y="0.5" width="1.4" height="21.9"/></svg>` },
  movement: { label: 'Movement', svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11.55 21.91"><path fill="currentColor" d="M9.37,7.9l2.18,2.19V0H1.47L3.71,2.24c-5.32,6-4.91,13.59,1.17,19.67l5.64-5.65A8.18,8.18,0,0,1,8,11.8,5.09,5.09,0,0,1,9.37,7.9"/></svg>` },
  shooting: { label: 'Shooting', svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.23 21.28"><path fill="currentColor" d="M16.7,10.14l.59,1.06H16l-.13-.46A7.63,7.63,0,0,0,10.5,5.38L10,5.25V4l1.05.58L11.68,0l2,4.12L16.78.81l-.84,4.48,4.48-.84L17.11,7.59l4.12,2Z"/><path fill="currentColor" d="M6.63,6V7.67a5.4,5.4,0,0,0-2,1.26,5.31,5.31,0,0,0-1.25,2H1.77A7,7,0,0,1,3.55,7.83,6.89,6.89,0,0,1,6.63,6"/><path fill="currentColor" d="M15.18,10.92H13.55a5.28,5.28,0,0,0-1.25-2h0a5.4,5.4,0,0,0-2-1.26V6a6.91,6.91,0,0,1,4.86,4.88"/><rect fill="currentColor" x="12.3" y="11.89" width="4.65" height="1.76"/><rect fill="currentColor" x="7.6" y="4.26" width="1.76" height="4.67"/><path fill="currentColor" d="M15.18,14.61a6.88,6.88,0,0,1-1.78,3.1,7,7,0,0,1-3.08,1.79V17.86a5.25,5.25,0,0,0,2-1.25,5.47,5.47,0,0,0,1.26-2Z"/><rect fill="currentColor" x="0" y="11.89" width="4.65" height="1.76"/><rect fill="currentColor" x="7.6" y="16.61" width="1.76" height="4.67"/><path fill="currentColor" d="M6.63,17.86V19.5a6.9,6.9,0,0,1-4.86-4.89H3.4a5.43,5.43,0,0,0,1.25,2,5.25,5.25,0,0,0,2,1.25"/></svg>` },
  charge:   { label: 'Charge',   svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22.97 24.67"><polygon fill="currentColor" points="11.48 7.11 17.23 14.21 22.97 14.21 11.48 0 0 14.21 5.74 14.21 11.48 7.11"/><polygon fill="currentColor" points="11.48 17.56 17.23 24.67 22.97 24.67 11.48 10.46 0 24.67 5.74 24.67 11.48 17.56"/></svg>` },
  fight:    { label: 'Fight',    svg: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 7.35 7"><defs><clipPath id="melee-clip" transform="translate(-2.21 -1.51)"><rect fill="none" width="12.29" height="10.15"/></clipPath></defs><g clip-path="url(#melee-clip)"><path fill="currentColor" d="M3.81,5.85l-.13-.31-.53.54.53.53-.59.59-.41.41-.13-.14-.34.34.35.35.35.35.34-.34L3.12,8l.4-.41L4.11,7l.53.53L5.18,7l-.31-.13-.19-.19L6.24,5.16l.65-.65c.38-.38,2.25-2.39,2.32-3-.62.05-2.62,1.94-3,2.32l-.62.63L4,6Z" transform="translate(-2.21 -1.51)"/><path fill="currentColor" d="M6.9,6.91,6.6,7l.53.53L7.66,7l.59.59L8.66,8l-.14.13.34.34.35-.35.35-.35-.33-.34-.14.14L8.68,7.2l-.59-.59.53-.53-.53-.54L8,5.85,7.77,6,6.21,4.48l-.65-.65c-.38-.38-2.38-2.25-3-2.32.06.62,1.95,2.62,2.32,3,0,0,.31.3.63.63L7.1,6.72Z" transform="translate(-2.21 -1.51)"/></g></svg>` },
};
