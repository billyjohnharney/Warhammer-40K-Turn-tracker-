export const phases = [
  {
    id: 'command',
    title: 'Command Phase',
    items: [
      { type: 'action', text: 'Both players gain 1CP — Command Points are spent to activate Stratagems during any phase' },
      { type: 'action', text: 'Resolve army abilities — activate any faction or detachment abilities that trigger at the start of your Command phase (see abilities listed below)' },
      { type: 'command-abilities' },
      { type: 'action', text: 'Check for Battle-Shock — for each unit below Half-strength, roll 2D6; equal or beat Leadership to pass', keywords: ['BATTLE-SHOCK', 'INSANE BRAVERY'] },
      { type: 'note', text: 'Failed Battle-shock: unit OC becomes 0, cannot use Stratagems until next Command phase. Battle-shocked units take Desperate Escape tests when Falling Back', keywords: ['BATTLE-SHOCK'] },
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
      { type: 'action', text: 'Players alternate selecting eligible units — defending player picks first. Counter-Offensive (2CP) can interrupt the sequence', keywords: ['COUNTER-OFFENSIVE'] },
      { type: 'action', text: 'Pile In: move each model up to 3" — must end closer to the nearest enemy model than it started, remaining in unit coherency' },
      { type: 'note', text: 'Lance: add +1 to Wound rolls if bearer charged this turn', keywords: ['LANCE'], playerOnly: true },
      { type: 'note', text: 'Extra Attacks: bearer attacks with this weapon in addition to other melee weapons', keywords: ['EXTRA ATTACKS'], playerOnly: true },
      { type: 'note', text: 'Precision: when targeting Attached unit, can allocate attack to visible Character', keywords: ['PRECISION'], playerOnly: true },
      { type: 'action', text: 'Attack: select weapon & targets → roll Hit rolls (unmodified 6s = Critical Hits) → roll Wound rolls (unmodified 6s = Critical Wounds) → apply saves (Invulnerable saves never modified by AP)', keywords: ['LETHAL HITS', 'SUSTAINED HITS X', 'DEVASTATING WOUNDS', 'ANTI-[KEYWORD] X+'] },
      { type: 'note', text: 'Your Feel No Pain: your models with FNP may roll to negate wounds after saves', keywords: ['FEEL NO PAIN X+'], playerOnly: true },
      { type: 'note', text: 'Enemy Feel No Pain: after your attacks wound, enemy models with FNP may roll to negate those wounds', keywords: ['FEEL NO PAIN X+'], enemyOnly: true },
      { type: 'note', text: 'Twin-linked: re-roll Wound rolls', keywords: ['TWIN-LINKED'], playerOnly: true },
      { type: 'note', text: 'After fighting: if Hazardous weapons used, roll 1D6 per weapon — on a 1, one model destroyed', keywords: ['HAZARDOUS'], playerOnly: true },
      { type: 'note', text: 'Your Deadly Demise: if your models with this ability are destroyed in this fight, roll D6 — on a 6 nearby units take mortal wounds', keywords: ['DEADLY DEMISE X'], playerOnly: true },
      { type: 'note', text: 'Enemy Deadly Demise: when you destroy an enemy model with this ability, roll D6 — on a 6 your nearby units take mortal wounds', keywords: ['DEADLY DEMISE X'], enemyOnly: true },
      { type: 'action', text: 'Consolidate: Move each model up to 3" closer to nearest enemy model or toward an objective marker.' },
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
  command:  { label: 'Command',  svg: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M2 12L3.5 7L6.5 9.5L8 4.5L9.5 9.5L12.5 7L14 12Z"/><line x1="2" y1="14" x2="14" y2="14"/></svg>` },
  movement: { label: 'Movement', svg: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M4 8L8 3L12 8"/><line x1="8" y1="3" x2="8" y2="14"/></svg>` },
  shooting: { label: 'Shooting', svg: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="3.5"/><line x1="8" y1="1" x2="8" y2="4.5"/><line x1="8" y1="11.5" x2="8" y2="15"/><line x1="1" y1="8" x2="4.5" y2="8"/><line x1="11.5" y1="8" x2="15" y2="8"/></svg>` },
  charge:   { label: 'Charge',   svg: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M2 5L6 8L2 11"/><path d="M7 5L11 8L7 11"/></svg>` },
  fight:    { label: 'Fight',    svg: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg"><line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/></svg>` },
  end:      { label: 'End',      svg: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><line x1="5" y1="1" x2="5" y2="15"/><path d="M5 2L13 5L5 9"/></svg>` },
};
