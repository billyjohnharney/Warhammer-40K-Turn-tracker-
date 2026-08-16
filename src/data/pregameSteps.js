export const pregameSteps = [
  {
    title: 'Determine Attacker & Defender',
    summary: 'Roll off — the winner chooses who is Attacker and who is Defender.',
    description: 'Both players roll one D6. The player who rolls highest chooses whether to be the Attacker or the Defender; their opponent takes the other role. On a tie, re-roll. The deployment map will show each player\'s deployment zone based on this result.',
  },
  {
    title: 'Muster Armies',
    summary: 'For each Leader and Support unit, choose the Bodyguard unit it leads.',
    description: 'Before the battle, in the Muster Armies step, for each Leader and Support unit in your army you can select one friendly Bodyguard unit for it to lead, forming an Attached unit with it. Unless otherwise stated, each Bodyguard unit can only have one Leader and one Support unit attached to it.',
  },
  {
    title: 'Declare Battle Formations',
    summary: 'Secretly note, then simultaneously reveal: embarked units and Strategic Reserves.',
    description: 'Each player secretly notes down the following, then both players reveal their choices simultaneously:\n1. Which units start the battle embarked within which Transport models.\n2. Which units will start the battle in Strategic Reserves — unless otherwise stated, their combined points value (including units embarked within Transports also in Reserves) cannot exceed half your army\'s points limit for the battle size.',
  },
  {
    title: 'Deploy Armies',
    summary: 'Alternate deploying units into your deployment zone, Attacker first.',
    description: 'Players alternate deploying units one at a time, starting with the Attacker. All models must be set up wholly within their controlling player\'s deployment zone. If one player finishes deploying first, their opponent continues deploying the remainder of their units. Units with abilities that allow them to be set up after both armies are deployed (e.g. Infiltrators) are set up last — if both players have such units, roll off and alternate, starting with the winner.',
  },
  {
    title: 'Redeploy Units',
    summary: 'Resolve any rules that allow units to redeploy after deployment.',
    description: 'Some rules allow players to redeploy certain units after both armies are fully deployed. Unless otherwise stated, these are resolved now — before the first turn is determined. Players alternate resolving any such rules, starting with the Attacker.',
  },
  {
    title: 'Determine First Turn',
    summary: 'Roll off — the winner chooses who takes the first turn.',
    description: 'Both players roll one D6. The player who rolls highest chooses who takes the first turn. On a tie, re-roll. The same player always takes the first turn in each subsequent battle round.',
  },
  {
    title: 'Resolve Pre-battle Abilities',
    summary: 'Resolve Scout moves and any other pre-battle abilities, first-turn player goes first.',
    description: 'Players alternate resolving any pre-battle abilities their units have, starting with the player who will take the first turn. This is when Scouts X" is resolved — a unit wholly within its deployment zone can make a Scout move of up to X", a unit in Strategic Reserves can instead be set up wholly within its deployment zone, and an eligible Dedicated Transport can make a Scout move on behalf of its embarked passengers. A Scout move must end more than 8" horizontally from all enemy units. This step comes after Declare Battle Formations and before the battle begins.',
  },
];
