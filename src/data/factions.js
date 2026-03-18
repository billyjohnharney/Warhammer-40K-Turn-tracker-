export const factions = [
  'Adeptus Custodes',
  'Adeptus Mechanicus',
  'Adepta Sororitas',
  'Aeldari',
  'Astra Militarum',
  'Black Templars',
  'Blood Angels',
  'Chaos Daemons',
  'Chaos Knights',
  'Chaos Space Marines',
  'Dark Angels',
  'Death Guard',
  'Deathwatch',
  'Drukhari',
  'Genestealer Cults',
  'Grey Knights',
  'Imperial Knights',
  'Leagues of Votann',
  'Necrons',
  'Orks',
  'Space Marines',
  'Space Wolves',
  "T'au Empire",
  'Thousand Sons',
  'Tyranids',
  'World Eaters',
];

export const SUB_FACTION_IDS = {
  'Black Templars': ['SM'],
  'Blood Angels':   ['SM'],
  'Dark Angels':    ['SM'],
  'Deathwatch':     ['AoI', 'SM'],
  'Space Wolves':   ['SM'],
};

export const keywordFactions = {};

export const smSuccessors = new Set([
  'Dark Angels', 'Blood Angels', 'Space Wolves', 'Black Templars', 'Grey Knights',
]);
