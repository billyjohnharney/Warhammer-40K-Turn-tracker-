export const MISSIONS = [
  // ── Standard ─────────────────────────────────────────────────────────────
  {
    id: 'only-war',
    title: 'Only War',
    category: 'Standard',
    summary: 'The default mission — no special primary rules, fight for control of objective markers.',
    details: `No special Primary Mission rules apply. Players score Victory Points by controlling objective markers according to the standard rules.`,
  },
  {
    id: 'take-and-hold',
    title: 'Take and Hold',
    category: 'Standard',
    summary: 'Score 5 VP for each objective marker you control at the end of your Command phase.',
    details: `SECOND BATTLE ROUND ONWARDS
WHEN: End of the Command phase (or the end of your turn if it is the fifth battle round and you are going second).

The player whose turn it is scores:
• For each objective marker that they control → 5 VP (MAX 15VP)`,
  },
  {
    id: 'burden-of-trust',
    title: 'Burden of Trust',
    category: 'Standard',
    summary: 'Guard objective markers you control and score VP each turn based on how many you hold.',
    details: `At the end of the Command phase, for each objective marker that the player whose turn it is controls, they can select one unit from their army (excluding AIRCRAFT) within range of that objective marker to guard it until the start of their next turn.

SECOND BATTLE ROUND ONWARDS
WHEN: End of the Command phase (or the end of your turn if it is the fifth battle round and you are going second).

The player whose turn it is scores:
• For each objective marker they control that is not within their deployment zone → 4 VP

SECOND BATTLE ROUND ONWARDS
WHEN: End of each player's turn.

The opponent of the player whose turn it is scores:
• For each of their units (excluding Battle-shocked units) that are within range of and guarding an objective marker they control → 2 VP`,
  },
  {
    id: 'hidden-supplies',
    title: 'Hidden Supplies',
    category: 'Standard',
    summary: 'An extra objective marker in No Man\'s Land shifts position each turn, forcing constant repositioning.',
    details: `SETUP: In the Place Objective Markers step, players must set up one additional objective marker in No Man's Land.

Before setting up this new marker, players must first move the objective marker in the centre of the battlefield 6″ directly towards one of the corners. Players roll off, and the winner selects which corner. Players then set up the new objective marker 6″ from the centre towards the diagonally opposite corner to the previously moved objective marker.

SECOND BATTLE ROUND ONWARDS
WHEN: End of the Command phase (or the end of your turn if it is the fifth battle round and you are going second).

The player whose turn it is scores:
• They control one objective marker not within their deployment zone → 5 VP
  AND
• They control two objective markers not within their deployment zone → 5 VP
  AND
• They control more objective markers than their opponent controls → 5 VP`,
  },
  {
    id: 'linchpin',
    title: 'Linchpin',
    category: 'Standard',
    summary: 'Control the objective marker in your deployment zone as a linchpin to unlock bigger VP bonuses each turn.',
    details: `SECOND BATTLE ROUND ONWARDS
WHEN: End of the Command phase (or the end of your turn if it is the fifth battle round and you are going second).

IF the player whose turn it is does NOT control the objective marker in their deployment zone:
• For each objective marker that the player controls → 3 VP

OR

IF the player whose turn it is DOES control the objective marker in their deployment zone:
• For controlling the objective marker in their deployment zone → 3 VP
  AND
• For each other objective marker that the player controls → 5 VP (MAX 10VP)`,
  },
  {
    id: 'purge-the-foe',
    title: 'Purge the Foe',
    category: 'Standard',
    summary: 'Destroy enemy units each battle round to score VP based on kills and objective control.',
    details: `SECOND BATTLE ROUND ONWARDS
WHEN: End of the battle round.

Each player scores:
• If one or more enemy units were destroyed this battle round → 4 VP

SECOND BATTLE ROUND ONWARDS
WHEN: End of the battle round.

Each player scores:
• If more enemy units than friendly units were destroyed this battle round → 4 VP

SECOND BATTLE ROUND ONWARDS
WHEN: End of the Command phase (or the end of your turn if it is the fifth battle round and you are going second).

The player whose turn it is scores:
• If they control one or more objective markers → 4 VP
  AND
• If the player controls more objective markers than their opponent controls → 4 VP`,
  },
  {
    id: 'scorched-earth',
    title: 'Scorched Earth',
    category: 'Standard',
    summary: 'Burn objective markers outside your deployment zone to deny them to your opponent and score VP.',
    details: `BURN OBJECTIVE (ACTION)
WHEN: Your Shooting phase, from the second battle round onwards.
UNITS: One unit from your army within range of an objective marker that is not within your deployment zone.
COMPLETES: End of your opponent's next turn or the end of the battle (whichever comes first), if your unit is still within range of the same objective marker and you control that objective marker.
IF COMPLETED: That objective marker is burned and removed from the battlefield.

SECOND BATTLE ROUND ONWARDS
WHEN: Any time.

Each time a player burns an objective marker:
• Objective marker was in No Man's Land → 5 VP
• Objective marker was in their opponent's deployment zone → 10 VP

SECOND BATTLE ROUND ONWARDS
WHEN: End of the Command phase (or the end of your turn if it is the fifth battle round and you are going second).

• For each objective marker that the player controls → 5 VP (MAX 10VP)`,
  },
  {
    id: 'supply-drop',
    title: 'Supply Drop',
    category: 'Standard',
    summary: 'Two special objective markers in No Man\'s Land become increasingly valuable as battle rounds progress.',
    details: `Start of the Battle: Players randomly select two different objective markers in No Man's Land that are not in the centre of the battlefield. The first selected is the Alpha α objective, the second is the Omega Ω objective.

Start of the Fourth Battle Round: The Alpha α Objective is removed from the battlefield.
Start of the Fifth Battle Round: The Omega Ω Objective is removed from the battlefield.

SECOND BATTLE ROUND ONWARDS
WHEN: End of the Command phase (or the end of your turn if it is the fifth battle round and you are going second).

The player whose turn it is scores the following VP for each objective marker within No Man's Land that they control, depending on the current battle round:
• Second and third battle rounds → 5 VP
• Fourth battle round → 8 VP
• Fifth battle round → 15 VP`,
  },
  {
    id: 'terraform',
    title: 'Terraform',
    category: 'Standard',
    summary: 'Terraform objective markers outside your deployment zone to score bonus VP beyond normal control.',
    details: `TERRAFORM (ACTION)
WHEN: Your Shooting phase.
UNITS: One or more units from your army, each within range of a different objective marker that is not within your deployment zone.
COMPLETES: End of the turn, if the unit performing this Action is still within range of the same objective marker and you control that objective marker.
IF COMPLETED: Each of those objective markers is terraformed by you. If that objective marker was terraformed by your opponent, it no longer is.

SECOND BATTLE ROUND ONWARDS
WHEN: End of the Command phase (or the end of your turn if it is the fifth battle round and you are going second).

The player whose turn it is scores:
• For each objective marker they control → 4 VP (MAX 12VP)

SECOND BATTLE ROUND ONWARDS
WHEN: End of the turn.

Each player scores:
• For each objective marker that is terraformed by them → 1 VP`,
  },
  {
    id: 'the-ritual',
    title: 'The Ritual',
    category: 'Standard',
    summary: 'Perform the Ritual action to reposition objective markers in No Man\'s Land and score VP for controlling them.',
    details: `THE RITUAL (ACTION)
STARTS: Your Shooting phase.
UNITS: One unit from your army.
IF COMPLETED: Set up one objective marker anywhere on the battlefield wholly within No Man's Land and within 1″ of your unit, provided it can be set up exactly 12″ from one other objective marker within No Man's Land and not within 4″ of any other objective marker.

SECOND BATTLE ROUND ONWARDS
WHEN: End of the Command phase (or the end of your turn if it is the fifth battle round and you are going second).

• For each objective marker that the player controls in No Man's Land → 5 VP (MAX 15VP)`,
  },
  {
    id: 'unexploded-ordnance',
    title: 'Unexploded Ordnance',
    category: 'Standard',
    summary: 'Move hazardous objective markers in No Man\'s Land towards your opponent\'s deployment zone to score escalating VP.',
    details: `Start of the Battle: The objective markers within No Man's Land become Hazard objective markers.

MOVE HAZARD (ACTION)
STARTS: Your Shooting phase.
UNITS: One or more units from your army, each within range of a different Hazard objective marker you control.
COMPLETES: End of your turn, if the unit performing this Action is still within range of the same Hazard objective marker and you control that objective marker.
IF COMPLETED: You can move each of those objective markers up to 6″. That objective marker cannot end that move on top of any other objective marker, model, or inside impassable parts of terrain features.

SECOND BATTLE ROUND ONWARDS
WHEN: End of each player's turn.

The player whose turn it is scores for each Hazard objective marker that is:
• Wholly within their opponent's deployment zone → 8 VP
• Wholly within 6″ of their opponent's deployment zone → 5 VP
• Wholly within 12″ of their opponent's deployment zone → 2 VP`,
  },

  // ── Asymmetric War ────────────────────────────────────────────────────────
  {
    id: 'syphoned-power',
    title: 'Syphoned Power',
    category: 'Asymmetric War',
    summary: 'The Attacker syphons objective markers to drain the Defender\'s starting 50 VP pool.',
    details: `Start of the Battle: The Defender scores 50 VP.

SYPHON POWER (ACTION)
STARTS: Your Shooting phase, from the second battle round onwards, if you are the Attacker.
UNITS: Any number of units from your army, each within range of a different objective marker you control.
COMPLETES: End of your turn, if your unit is still within range of the same objective marker and you control that objective marker.
IF COMPLETED: That objective marker is syphoned.

ANY TIME (ATTACKER)
WHEN: Any time.

Each time you syphon an objective marker, the Defender loses VP (to a minimum of 0) and you score the same amount of VP, depending on where that objective marker is:
• If it is within your deployment zone → 2 VP
  AND
• If it is wholly within No Man's Land → 3 VP
  AND
• If it is within your opponent's deployment zone → 5 VP (MAX 10VP)`,
  },
  {
    id: 'hold-out',
    title: 'Hold Out',
    category: 'Asymmetric War',
    summary: 'Score 5 VP for each objective marker you control at the end of your Command phase.',
    details: `SECOND BATTLE ROUND ONWARDS
WHEN: End of the Command phase (or the end of your turn if it is the fifth battle round and you are going second).

The player whose turn it is scores:
• For each objective marker that they control → 5 VP (MAX 15VP)`,
  },
  {
    id: 'denied-resources',
    title: 'Denied Resources',
    category: 'Asymmetric War',
    summary: 'The Defender denies objective markers to the Attacker by removing them from the battlefield.',
    details: `ANY BATTLE ROUND (DEF)
At the start of your turn, select one objective marker. At the end of your opponent's next turn or the end of the battle (whichever comes first), if you control that objective marker, it is denied and removed from the battlefield.

SECOND BATTLE ROUND ONWARDS (DEF)
WHEN: Any time.

Each time you deny an objective marker, you score VP depending on where that objective marker is:
• If it is within your deployment zone → 7 VP
• If it is wholly within No Man's Land → 10 VP
• If it is within your opponent's deployment zone → 16 VP

SECOND BATTLE ROUND ONWARDS (ATK)
WHEN: End of your Command phase.

You score VP as follows:
• For each objective marker you control that is within your deployment zone → 3 VP
• For each objective marker you control that is within No Man's Land → 5 VP
• For each objective marker you control that is within your opponent's deployment zone → 8 VP (MAX 15VP)`,
  },
  {
    id: 'establish-control',
    title: 'Establish Control',
    category: 'Asymmetric War',
    summary: 'Control the objective marker in your deployment zone as a linchpin to unlock larger VP bonuses each turn.',
    details: `SECOND BATTLE ROUND ONWARDS
WHEN: End of the Command phase (or the end of your turn if it is the fifth battle round and you are going second).

IF the player whose turn it is does NOT control each objective marker in their deployment zone:
• For each objective marker that the player controls → 3 VP

OR

IF the player whose turn it is DOES control each objective marker in their deployment zone:
• For controlling each objective marker in their deployment zone → 3 VP
  AND
• For each other objective marker that the player controls → 5 VP (MAX 15VP)`,
  },
  {
    id: 'uneven-ground',
    title: 'Uneven Ground',
    category: 'Asymmetric War',
    summary: 'Score escalating VP based on how far into enemy territory your controlled objective markers are.',
    details: `SECOND BATTLE ROUND ONWARDS
WHEN: End of the Command phase (or the end of your turn if it is the fifth battle round and you are going second).

The player whose turn it is scores VP as follows:
• For each objective marker within their deployment zone that they control → 2 VP
  AND
• For each objective marker within No Man's Land that they control → 4 VP
  AND
• For each objective marker within their opponent's deployment zone that they control → 6 VP (MAX 15VP)`,
  },
];
