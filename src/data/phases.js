export const phases = [
  {
    id: 'command',
    title: 'Command Phase',
    items: [
      { type: 'action', text: 'Both players gain 1CP — Command Points are spent to activate Stratagems during any phase' },
      { type: 'action', text: 'Resolve army abilities — activate any faction or detachment abilities that trigger at the start of your Command phase (see abilities listed below)' },
      { type: 'command-abilities' },
      { type: 'action', text: 'Check for Battle-Shock — for each unit below Half-strength, roll 2D6; equal or beat Leadership to pass', keywords: ['BATTLE-SHOCK', 'INSANE BRAVERY'] },
      { type: 'note', text: 'Failed Battle-shock: unit OC becomes 0, cannot use Stratagems until next Command phase. Battle-shocked units take Desperate Escape tests when Falling Back' },
    ]
  },
  {
    id: 'movement',
    title: 'Movement Phase',
    items: [
      { type: 'action', text: 'Select each unit to move — Normal Move, Advance, Remain Stationary, or Fall Back' },
      { type: 'note', text: 'Units in Engagement Range can only Remain Stationary or Fall Back' },
      { type: 'note', text: 'Units that Advance cannot shoot or charge this turn — exception: Assault weapons can still fire', keywords: ['ASSAULT'], playerOnly: true },
      { type: 'note', text: 'Units that Remain Stationary get +1 to Hit rolls for Heavy weapons this turn', keywords: ['HEAVY'], playerOnly: true },
      { type: 'note', text: 'Units that Fall Back cannot shoot or charge this turn. Battle-shocked units must take Desperate Escape tests', keywords: ['BATTLE-SHOCK'] },
      { type: 'note', text: 'Leader: Attached units (Character + bodyguard) move together as a single unit — they cannot separate', keywords: ['LEADER', 'ATTACHED UNIT'] },
      { type: 'note', text: 'Scouts: eligible units make a pre-battle move of up to X" before Round 1 — resolve before other movement if not yet done', keywords: ['SCOUTS X"'], playerOnly: true },
      { type: 'note', text: 'Hover: declare Hover mode now if needed — model loses AIRCRAFT rules, Move becomes 20"', keywords: ['HOVER'], playerOnly: true },
      { type: 'action', text: 'Deploy reinforcements — Excluding the first round, deploy any units arriving from Deep Strike or Reserves', keywords: ['DEEP STRIKE'], playerOnly: true },
    ]
  },
  {
    id: 'shooting',
    title: 'Shooting Phase',
    items: [
      { type: 'action', text: 'Declare all targets — Complete before rolling', keywords: ['INDIRECT FIRE'] },
      { type: 'note', text: 'Skip units that Advanced or Fell Back — unless using Assault weapons', keywords: ['ASSAULT'] },
      { type: 'note', text: 'Indirect Fire: may target units not visible', keywords: ['INDIRECT FIRE'], playerOnly: true },
      { type: 'note', text: 'Units in Engagement Range cannot shoot — exceptions: Monsters, Vehicles, Pistol weapons', keywords: ['PISTOL', 'MONSTER', 'VEHICLE'] },
      { type: 'note', text: 'Pistol: must target a unit in Engagement Range, cannot mix with non-Pistol weapons', keywords: ['PISTOL'], playerOnly: true },
      { type: 'note', text: 'Your Lone Operative units cannot be targeted by ranged attacks from more than 12" away', keywords: ['LONE OPERATIVE'], playerOnly: true },
      { type: 'note', text: 'Enemy Lone Operative: you cannot target enemy units with this ability from more than 12" away', keywords: ['LONE OPERATIVE'], enemyOnly: true },
      { type: 'note', text: 'Your Stealth: enemies shooting at your units with Stealth from more than 12" suffer -1 to Hit rolls', keywords: ['STEALTH'], playerOnly: true },
      { type: 'note', text: 'Enemy Stealth: apply -1 to your Hit rolls when targeting an enemy unit with Stealth from more than 12"', keywords: ['STEALTH'], enemyOnly: true },
      { type: 'note', text: 'Psychic: weapons/abilities tagged [PSYCHIC] are resolved in this phase — no separate Psychic phase', keywords: ['PSYCHIC'], playerOnly: true },
      { type: 'note', text: 'One Shot: track any One Shot weapons used this turn — they cannot be fired again this battle', keywords: ['ONE SHOT'], playerOnly: true },
      { type: 'note', text: "Firing Deck: Transport models with Firing Deck may shoot using embarked models' weapons", keywords: ['FIRING DECK X'], playerOnly: true },
      { type: 'note', text: 'Torrent: attacks automatically hit, skip Hit roll', keywords: ['TORRENT'], playerOnly: true },
      { type: 'note', text: 'Rapid Fire X: check if target is within half range, if so add X to Attacks', keywords: ['RAPID FIRE X'], playerOnly: true },
      { type: 'note', text: 'Blast: add 1 to Attacks per 5 models in target unit. Cannot use vs units in Engagement Range of your own', keywords: ['BLAST'], playerOnly: true },
      { type: 'note', text: 'Heavy: add +1 to Hit rolls if unit Remained Stationary this turn', keywords: ['HEAVY'], playerOnly: true },
      { type: 'note', text: 'Indirect Fire with no visible target: -1 to Hit rolls, target has Benefit of Cover', keywords: ['INDIRECT FIRE'], playerOnly: true },
      { type: 'action', text: 'Roll Hit rolls — roll 1D6 per attack vs. your BS; equal or beat it to hit. Unmodified 6 = Critical Hit', keywords: ['LETHAL HITS', 'SUSTAINED HITS X'] },
      { type: 'action', text: 'Roll Wound rolls — compare Strength vs Toughness (S≥2×T: 2+, S>T: 3+, S=T: 4+, S<T: 5+, S≤½T: 6+). Unmodified 6 = Critical Wound', keywords: ['DEVASTATING WOUNDS', 'ANTI-[KEYWORD] X+'] },
      { type: 'action', text: 'Apply AP to saving throws — subtract AP from armour Save; roll 1D6 per wound and meet/beat it to block. Invulnerable saves ignore AP entirely' },
      { type: 'note', text: 'Your Feel No Pain: your models with FNP may roll to negate wounds after saves', keywords: ['FEEL NO PAIN X+'], playerOnly: true },
      { type: 'note', text: 'Enemy Feel No Pain: after your attacks wound, enemy models with FNP may roll to negate those wounds', keywords: ['FEEL NO PAIN X+'], enemyOnly: true },
      { type: 'note', text: 'Ignores Cover: target cannot use Benefit of Cover', keywords: ['IGNORES COVER'], playerOnly: true },
      { type: 'note', text: 'Twin-linked: re-roll Wound rolls', keywords: ['TWIN-LINKED'], playerOnly: true },
      { type: 'note', text: 'Melta X: check if target is within half range, if so add X to Damage', keywords: ['MELTA X'], playerOnly: true },
      { type: 'note', text: 'After shooting: if Hazardous weapons used, roll 1D6 per weapon — on a 1, one model destroyed', keywords: ['HAZARDOUS'], playerOnly: true },
      { type: 'note', text: 'Your Deadly Demise: if your models with this ability are destroyed (e.g. from Hazardous), roll D6 — on a 6 nearby units take mortal wounds', keywords: ['DEADLY DEMISE X'], playerOnly: true },
      { type: 'note', text: 'Enemy Deadly Demise: when you destroy an enemy model with this ability, roll D6 — on a 6 your nearby units take mortal wounds', keywords: ['DEADLY DEMISE X'], enemyOnly: true },
    ]
  },
  {
    id: 'charge',
    title: 'Charge Phase',
    items: [
      { type: 'action', text: "Select eligible units — Units within 12\" of enemy, haven't Advanced or Fell Back, not in Engagement Range" },
      { type: 'note', text: 'Targets do not need to be visible' },
      { type: 'action', text: 'Charge — Roll 2D6; move up to that distance. Must end within Engagement Range (≤1" horizontally) of all declared targets without moving within 1" of undeclared enemies, or the charge fails', keywords: ['COMMAND RE-ROLL'] },
      { type: 'note', text: 'Successful charge gives unit Fights First this turn', keywords: ['FIGHTS FIRST'] },
      { type: 'note', text: 'Heroic Intervention (2CP): after this charge, the opponent may spend 2CP to move one eligible unit within 6" into Engagement Range of your charging unit', keywords: ['HEROIC INTERVENTION'] },
    ]
  },
  {
    id: 'fight',
    title: 'Fight Phase',
    items: [
      { type: 'action', text: 'Resolve fight order', keywords: ['FIGHTS FIRST', 'FIGHTS LAST'] },
      { type: 'note', text: 'Fights First: Units with Fights First ability fight now — all units that charged this turn also fight in this step', keywords: ['FIGHTS FIRST'] },
      { type: 'note', text: 'Fights Last: units with this ability fight after all other units — select them only once all normal units have fought', keywords: ['FIGHTS LAST'] },
      { type: 'action', text: 'Select units — Players alternate selecting eligible units. Defending player picks first.', keywords: ['COUNTER-OFFENSIVE'] },
      { type: 'action', text: 'Pile In — Move each model up to 3". It must end closer to the nearest enemy model than it started, remaining in unit coherency.' },
      { type: 'note', text: 'Lance: add +1 to Wound rolls if bearer charged this turn', keywords: ['LANCE'], playerOnly: true },
      { type: 'note', text: 'Extra Attacks: bearer attacks with this weapon in addition to other melee weapons', keywords: ['EXTRA ATTACKS'], playerOnly: true },
      { type: 'note', text: 'Precision: when targeting Attached unit, can allocate attack to visible Character', keywords: ['PRECISION'], playerOnly: true },
      { type: 'action', text: 'Attack — Select weapon & targets.\nRoll Hit rolls (unmod 6s = Critical Hits) Wound rolls (unmod 6s = Critical Wounds)\nRoll saves (modified by AP) (Invulnerability cannot be modified)\nApply damage', keywords: ['LETHAL HITS', 'SUSTAINED HITS X', 'DEVASTATING WOUNDS', 'ANTI-[KEYWORD] X+'] },
      { type: 'note', text: 'Your Feel No Pain: your models with FNP may roll to negate wounds after saves', keywords: ['FEEL NO PAIN X+'], playerOnly: true },
      { type: 'note', text: 'Enemy Feel No Pain: after your attacks wound, enemy models with FNP may roll to negate those wounds', keywords: ['FEEL NO PAIN X+'], enemyOnly: true },
      { type: 'note', text: 'Twin-linked: re-roll Wound rolls', keywords: ['TWIN-LINKED'], playerOnly: true },
      { type: 'note', text: 'After fighting: if Hazardous weapons used, roll 1D6 per weapon — on a 1, one model destroyed', keywords: ['HAZARDOUS'], playerOnly: true },
      { type: 'note', text: 'Your Deadly Demise: if your models with this ability are destroyed in this fight, roll D6 — on a 6 nearby units take mortal wounds', keywords: ['DEADLY DEMISE X'], playerOnly: true },
      { type: 'note', text: 'Enemy Deadly Demise: when you destroy an enemy model with this ability, roll D6 — on a 6 your nearby units take mortal wounds', keywords: ['DEADLY DEMISE X'], enemyOnly: true },
      { type: 'action', text: 'Consolidate — Move each model up to 3" closer to nearest enemy model or toward an objective marker.' },
      { type: 'note', text: 'Remaining Combats: all remaining eligible units now fight — repeat the same sequence above. No unit can fight more than once per phase' },
    ]
  },
  {
    id: 'end',
    title: 'End of Turn',
    items: [
      { type: 'action', text: 'Check unit coherency — each model must be within 2" horizontally and 5" vertically of at least one other model in its unit; remove models that cannot maintain coherency' },
      { type: 'action', text: 'Score objectives — units with Objective Secured control markers even against non-ObjSec enemies', keywords: ['OBJECTIVE SECURED'] },
      { type: 'action', text: 'Note victory points scored this turn — tally VPs from Primary Mission objectives, Secondary Mission cards, and any other scoring rules triggered this turn' },
      { type: 'action', text: 'Pass to your opponent — your turn ends; opponent takes their turn. After both players have gone, the Battle Round is complete (game lasts 5 Battle Rounds)' },
    ]
  }
];

export const PHASE_ICONS = {
  command:  { label: 'Command',  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.84 22.42"><path fill="currentColor" d="M2.4,3.2c0-0.3,0.5-0.7,0.7-0.9C3.7,1.8,4.6,1,5.5,0.6c1.8-0.7,4.3-1,6,0.6c0.8,0.7,1.3,1.6,2,2.3c1,1.1,1.2,1.2,2.2,1.8c0,0,0.9,0.5,1.2,0.6c0.8,0.3,1.6,0.4,2,0.3l0.9-0.1c0,0,0,0.3-0.1,0.4c-0.1,0.2-0.3,0.4-0.7,0.8C18.1,8,17,8.6,15.8,8.7c-1.9,0.2-3.6-0.8-5.4-1.1c-1-0.3-2.1-0.2-3.2,0.1c-1.9,0.6-3.6,1.9-4.7,3.5L2.4,3.2z"/><rect fill="currentColor" y="0.5" width="1.4" height="21.9"/></svg>` },
  movement: { label: 'Movement', svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11.55 21.91"><path fill="currentColor" d="M9.37,7.9l2.18,2.19V0H1.47L3.71,2.24c-5.32,6-4.91,13.59,1.17,19.67l5.64-5.65A8.18,8.18,0,0,1,8,11.8,5.09,5.09,0,0,1,9.37,7.9"/></svg>` },
  shooting: { label: 'Shooting', svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.23 21.28"><path fill="currentColor" d="M16.7,10.14l.59,1.06H16l-.13-.46A7.63,7.63,0,0,0,10.5,5.38L10,5.25V4l1.05.58L11.68,0l2,4.12L16.78.81l-.84,4.48,4.48-.84L17.11,7.59l4.12,2Z"/><path fill="currentColor" d="M6.63,6V7.67a5.4,5.4,0,0,0-2,1.26,5.31,5.31,0,0,0-1.25,2H1.77A7,7,0,0,1,3.55,7.83,6.89,6.89,0,0,1,6.63,6"/><path fill="currentColor" d="M15.18,10.92H13.55a5.28,5.28,0,0,0-1.25-2h0a5.4,5.4,0,0,0-2-1.26V6a6.91,6.91,0,0,1,4.86,4.88"/><rect fill="currentColor" x="12.3" y="11.89" width="4.65" height="1.76"/><rect fill="currentColor" x="7.6" y="4.26" width="1.76" height="4.67"/><path fill="currentColor" d="M15.18,14.61a6.88,6.88,0,0,1-1.78,3.1,7,7,0,0,1-3.08,1.79V17.86a5.25,5.25,0,0,0,2-1.25,5.47,5.47,0,0,0,1.26-2Z"/><rect fill="currentColor" x="0" y="11.89" width="4.65" height="1.76"/><rect fill="currentColor" x="7.6" y="16.61" width="1.76" height="4.67"/><path fill="currentColor" d="M6.63,17.86V19.5a6.9,6.9,0,0,1-4.86-4.89H3.4a5.43,5.43,0,0,0,1.25,2,5.25,5.25,0,0,0,2,1.25"/></svg>` },
  charge:   { label: 'Charge',   svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22.97 24.67"><polygon fill="currentColor" points="11.48 7.11 17.23 14.21 22.97 14.21 11.48 0 0 14.21 5.74 14.21 11.48 7.11"/><polygon fill="currentColor" points="11.48 17.56 17.23 24.67 22.97 24.67 11.48 10.46 0 24.67 5.74 24.67 11.48 17.56"/></svg>` },
  fight:    { label: 'Fight',    svg: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 7.35 7"><defs><clipPath id="melee-clip" transform="translate(-2.21 -1.51)"><rect fill="none" width="12.29" height="10.15"/></clipPath></defs><g clip-path="url(#melee-clip)"><path fill="currentColor" d="M3.81,5.85l-.13-.31-.53.54.53.53-.59.59-.41.41-.13-.14-.34.34.35.35.35.35.34-.34L3.12,8l.4-.41L4.11,7l.53.53L5.18,7l-.31-.13-.19-.19L6.24,5.16l.65-.65c.38-.38,2.25-2.39,2.32-3-.62.05-2.62,1.94-3,2.32l-.62.63L4,6Z" transform="translate(-2.21 -1.51)"/><path fill="currentColor" d="M6.9,6.91,6.6,7l.53.53L7.66,7l.59.59L8.66,8l-.14.13.34.34.35-.35.35-.35-.33-.34-.14.14L8.68,7.2l-.59-.59.53-.53-.53-.54L8,5.85,7.77,6,6.21,4.48l-.65-.65c-.38-.38-2.38-2.25-3-2.32.06.62,1.95,2.62,2.32,3,0,0,.31.3.63.63L7.1,6.72Z" transform="translate(-2.21 -1.51)"/></g></svg>` },
  end:      { label: 'End',      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.95 21.2"><path fill="currentColor" d="M12.79,14.08c-.11.5-.48,1.28-.89,1.37s-3-.52-3.59-1.37C8,13.62,9.73,13.44,10.62,13s1.07-.78,1.58-.51a1.53,1.53,0,0,1,.59,1.56m-4.52,3.5c-.33,0-.43-.94-.79-1s-.47.94-.79,1-.5-.25-.18-1.23a2.41,2.41,0,0,1,1-1.35,2.42,2.42,0,0,1,1,1.35c.32,1,.15,1.28-.17,1.23M3.05,15.45c-.41-.09-.78-.87-.89-1.37a1.54,1.54,0,0,1,.6-1.56c.5-.27.68.1,1.57.51s2.65.59,2.31,1.05c-.61.85-3.18,1.46-3.59,1.37M14.32,9.21c.21-.54,1.52-2.44-.4-5.81S7.48,0,7.48,0,3,0,1,3.4.42,8.67.64,9.21A5.43,5.43,0,0,1,1,11.87c-.21.79-.85,1.43-.79,1.89s.7.82.79,1.49-.09,1.71.86,2,1.77-.15,2,.15-.46,2.53-.21,3,1,.52,1,.52S4.54,20,5.23,20c.35,0,.58.28.58.69a2.14,2.14,0,0,1,0,.5,2.78,2.78,0,0,0,1.12,0S6.69,20,7.48,20s.57,1.17.57,1.17a2.82,2.82,0,0,0,1.13,0,2.14,2.14,0,0,1,0-.5c0-.41.22-.69.58-.69.68,0,.5.95.5.95s.79-.06,1-.52-.49-2.68-.22-3,1.1.12,2-.15.76-1.31.85-2,.73-1,.79-1.49-.58-1.1-.79-1.89a5.31,5.31,0,0,1,.37-2.66"/></svg>` },
};
