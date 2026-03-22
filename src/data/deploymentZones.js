// type: 'standard'   → available for Incursion and Strike Force
// type: 'asymmetric' → available for Asymmetric War missions only
export const DEPLOYMENT_ZONES = [
  {
    id: 'crucible-of-battle',
    name: 'Crucible of Battle',
    type: 'standard',
    sizes: ['incursion', 'strike-force'],
    desc: 'Diagonal deployment zones cut corner to corner, with objectives scattered across the split battlefield.',
  },
  {
    id: 'dawn-of-war',
    name: 'Dawn of War',
    type: 'standard',
    sizes: ['incursion', 'strike-force'],
    desc: 'Players deploy in strips along opposite short table edges, separated by a wide No Man\'s Land.',
  },
  {
    id: 'hammer-and-anvil',
    name: 'Hammer and Anvil',
    type: 'standard',
    sizes: ['incursion', 'strike-force'],
    desc: 'Players deploy in strips along opposite long table edges, driving head-on into each other.',
  },
  {
    id: 'search-and-destroy',
    name: 'Search and Destroy',
    type: 'standard',
    sizes: ['incursion', 'strike-force'],
    desc: 'Players deploy in opposite corner quadrants with a circular No Man\'s Land objective in the centre.',
  },
  {
    id: 'sweeping-engagement',
    name: 'Sweeping Engagement',
    type: 'standard',
    sizes: ['incursion', 'strike-force'],
    desc: 'Deployment zones run along opposite long edges with protruding flanks pushing into No Man\'s Land.',
  },
  {
    id: 'tipping-point',
    name: 'Tipping Point',
    type: 'standard',
    sizes: ['incursion', 'strike-force'],
    desc: 'Asymmetric L-shaped deployment zones create uneven pressure points across the battlefield.',
  },
  // ── Asymmetric War ───────────────────────────────────────────────────────
  {
    id: 'tip-of-the-spear',
    name: 'Tip of the Spear',
    type: 'asymmetric',
    sizes: [],
    desc: 'Attacker deploys across a wide forward zone; Defender holds a pointed strongpoint.',
  },
  {
    id: 'defensive-line',
    name: 'Defensive Line',
    type: 'asymmetric',
    sizes: [],
    desc: 'Defender holds a diagonal stronghold while the Attacker pushes in from a large flank zone.',
  },
  {
    id: 'pincer-attack',
    name: 'Pincer Attack',
    type: 'asymmetric',
    sizes: [],
    desc: 'Attacker deploys in two flanking corner zones to encircle the Defender\'s central position.',
  },
];
