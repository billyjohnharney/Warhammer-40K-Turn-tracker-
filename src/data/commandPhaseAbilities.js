export const commandPhaseAbilities = {
  'Space Marines': {
    'Gladius Task Force': [
      { name: 'Oath of Moment', text: 'Select one enemy unit — your models re-roll Hit rolls targeting that unit until your next Command phase.' },
    ],
    'Ironstorm Spearhead': [
      { name: 'Armoured Superiority', text: 'Select one enemy VEHICLE or MONSTER — friendly units re-roll Wound rolls targeting that unit until your next Command phase.' },
    ],
    'Stormlance Task Force': [
      { name: 'Thunderous Charge', text: 'Select one friendly unit that has not yet moved — it may make a free Normal Move of up to 6".' },
    ],
    'Anvil Siege Force': [
      { name: 'Devastator Doctrine', text: 'Select one enemy unit visible to a friendly unit — until end of your Shooting phase, friendly units get +1 to wound rolls against that target.' },
    ],
    'Firestorm Assault Force': [
      { name: 'Rapid Assault', text: 'Select one friendly unit — until end of turn it may shoot and charge even if it Advanced this turn.' },
    ],
    'Vanguard Spearhead': [
      { name: 'Guerrilla Tactics', text: 'Select one friendly unit wholly within your deployment zone or within 6" of a battlefield edge — it may be placed into Strategic Reserves.' },
    ],
  },
  'Black Templars': {
    'Righteous Crusaders': [
      { name: 'Vow of Crusade', text: 'Select one enemy unit — Black Templars units that charge or are charged by that unit gain +1 Attack until your next Command phase.' },
    ],
  },
  'Blood Angels': {
    'Sons of Sanguinius': [
      { name: 'Of Noble Birth', text: 'Select one friendly CHARACTER unit — it may issue one Heroic Inspiration ability to a friendly unit within 6".' },
    ],
  },
  'Dark Angels': {
    'Unforgiven Task Force': [
      { name: 'Grim Resolve', text: 'Select one friendly INFANTRY unit — until your next Command phase it auto-passes Battleshock tests and gains Objective Secured.' },
    ],
  },
  'Space Wolves': {
    'Stormlance Task Force': [
      { name: 'Oath of Kinship', text: 'Select one enemy unit — Space Wolves units re-roll Hit rolls of 1 targeting that unit until your next Command phase.' },
    ],
  },
  'Tyranids': {
    'Invasion Fleet': [
      { name: 'Synaptic Imperatives', text: 'Select one Synaptic Imperative — it remains active for all Synapse units until your next Command phase.' },
    ],
    'Crusher Stampede': [
      { name: 'Shadow in the Warp', text: 'Each enemy unit within 12" of a MONSTER suffers -1 Leadership until your next Command phase.' },
    ],
    'Assimilation Swarm': [
      { name: 'Endless Swarm', text: 'Select one destroyed CORE unit with 10 or fewer starting models — it may be set up again in Strategic Reserves at half strength. Once per battle.' },
    ],
  },
  'Necrons': {
    'Awakened Dynasty': [
      { name: 'Command Protocols', text: 'Activate one Command Protocol — its bonus applies to all Awakened Dynasty units until your next Command phase.' },
    ],
    'Hypercrypt Legion': [
      { name: 'Dimensional Sanctum', text: 'Select one friendly unit not in Engagement Range — it may be removed from the battlefield and placed into Strategic Reserves.' },
    ],
  },
  'Astra Militarum': {
    '*': [
      { name: 'Voice of Command', text: 'Each OFFICER issues up to 2 orders to friendly INFANTRY units within 6".' },
      { name: 'Tank Orders', text: 'Each OFFICER issues 1 order to a friendly VEHICLE unit within 6".' },
    ],
  },
  'Chaos Space Marines': {
    'Slaves to Darkness': [
      { name: 'Dark Pacts', text: "Select one unit — choose a Dark Pact ability, then roll 1D6: on 2+ gain the ability until your next Command phase; on 1, one model suffers 1 mortal wound." },
    ],
  },
  'Death Guard': {
    'Plague Company': [
      { name: 'Contagions of Nurgle', text: 'Each enemy unit within 6" of one or more Death Guard units gains a Contagion token (max 2). Tokens increase the potency of your plague abilities.' },
    ],
  },
  'Thousand Sons': {
    'Cult of Magic': [
      { name: 'Cabbalistic Rituals', text: 'Select one ritual — it empowers your psychic attacks and Smite abilities until your next Command phase.' },
    ],
  },
  'Adeptus Custodes': {
    'Shield Host': [
      { name: "Martial Ka'tah", text: "Select one Ka'tah stance (Dakka, Rendax, or Hykanatoi) — all Shield Host units gain its bonus until your next Command phase." },
    ],
  },
  'Adepta Sororitas': {
    '*': [
      { name: 'Acts of Faith', text: 'Generate Miracle dice — roll one D6 for each Acts of Faith trigger this phase and add the result to your Miracle dice pool.' },
    ],
  },
  'Imperial Knights': {
    'Noble Lance': [
      { name: 'Exalted Court', text: 'Each CHARACTER KNIGHT uses one Bondsman ability, affecting friendly ARMIGER units within 12".' },
    ],
  },
  'Chaos Knights': {
    'Traitoris Lance': [
      { name: 'Damnation', text: 'Each friendly CHARACTER CHAOS KNIGHT uses one Damnation ability, affecting friendly WAR DOG units within 12".' },
    ],
  },
  'Leagues of Votann': {
    'Oathband': [
      { name: 'Ancestral Sentence', text: 'Each enemy unit within 12" of a JUDGE that does not yet have a Judgement token gains one. Tokens increase damage from Votann attacks targeting that unit.' },
    ],
  },
  'Aeldari': {
    'Warhost': [
      { name: 'Strands of Fate', text: 'If you have Fate dice remaining, you may discard any number — re-roll an equal number of dice from your Fate dice pool.' },
    ],
  },
  'Grey Knights': {
    'Teleport Assault': [
      { name: 'Teleport Shunt', text: 'Select one friendly unit not in Engagement Range — remove it from the battlefield and set it up again anywhere on the battlefield more than 9" from all enemy units.' },
    ],
  },
};
