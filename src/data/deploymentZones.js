// type: 'standard'   → available for Incursion and Strike Force
// type: 'asymmetric' → available for Asymmetric War missions only
export const DEPLOYMENT_ZONES = [
  {
    id: 'crucible-of-battle',
    name: 'Crucible of Battle',
    type: 'standard',
    sizes: ['incursion', 'strike-force'],
    desc: 'Diagonal deployment zones cut corner to corner, with objectives scattered across the split battlefield.',
    images: {
      incursion:     '/deployment-zones/crucible-of-battle-incursion.png',
      'strike-force': '/deployment-zones/crucible-of-battle-strike-force.png',
    },
  },
  {
    id: 'dawn-of-war',
    name: 'Dawn of War',
    type: 'standard',
    sizes: ['incursion', 'strike-force'],
    desc: 'Players deploy in strips along opposite short table edges, separated by a wide No Man\'s Land.',
    images: {
      incursion:     '/deployment-zones/dawn-of-war-incursion.png',
      'strike-force': '/deployment-zones/dawn-of-war-strike-force.png',
    },
  },
  {
    id: 'hammer-and-anvil',
    name: 'Hammer and Anvil',
    type: 'standard',
    sizes: ['incursion', 'strike-force'],
    desc: 'Players deploy in strips along opposite long table edges, driving head-on into each other.',
    images: {
      incursion:     '/deployment-zones/hammer-and-anvil-incursion.png',
      'strike-force': '/deployment-zones/hammer-and-anvil-strike-force.png',
    },
  },
  {
    id: 'search-and-destroy',
    name: 'Search and Destroy',
    type: 'standard',
    sizes: ['incursion', 'strike-force'],
    desc: 'Players deploy in opposite corner quadrants with a circular No Man\'s Land objective in the centre.',
    images: {
      incursion:     '/deployment-zones/search-and-destroy-incursion.png',
      'strike-force': '/deployment-zones/search-and-destroy-strike-force.png',
    },
  },
  {
    id: 'sweeping-engagement',
    name: 'Sweeping Engagement',
    type: 'standard',
    sizes: ['incursion', 'strike-force'],
    desc: 'Deployment zones run along opposite long edges with protruding flanks pushing into No Man\'s Land.',
    images: {
      incursion:     '/deployment-zones/sweeping-engagement-incursion.png',
      'strike-force': '/deployment-zones/sweeping-engagement-strike-force.png',
    },
  },
  {
    id: 'tipping-point',
    name: 'Tipping Point',
    type: 'standard',
    sizes: ['incursion', 'strike-force'],
    desc: 'Asymmetric L-shaped deployment zones create uneven pressure points across the battlefield.',
    images: {
      incursion:     '/deployment-zones/tipping-point-incursion.png',
      'strike-force': '/deployment-zones/tipping-point-strike-force.png',
    },
  },
  // ── Asymmetric War ───────────────────────────────────────────────────────
  {
    id: 'tip-of-the-spear',
    name: 'Tip of the Spear',
    type: 'asymmetric',
    sizes: [],
    desc: 'Attacker deploys across a wide forward zone; Defender holds a pointed strongpoint.',
    image: '/deployment-zones/tip-of-the-spear.png',
  },
  {
    id: 'defensive-line',
    name: 'Defensive Line',
    type: 'asymmetric',
    sizes: [],
    desc: 'Defender holds a diagonal stronghold while the Attacker pushes in from a large flank zone.',
    image: '/deployment-zones/defensive-line.png',
  },
  {
    id: 'pincer-attack',
    name: 'Pincer Attack',
    type: 'asymmetric',
    sizes: [],
    desc: 'Attacker deploys in two flanking corner zones to encircle the Defender\'s central position.',
    image: '/deployment-zones/pincer-attack.png',
  },
  {
    id: 'breakout',
    name: 'Breakout',
    type: 'asymmetric',
    sizes: [],
    desc: 'Defender holds a narrow central corridor while the Attacker applies pressure from both ends.',
    image: '/deployment-zones/breakout.png',
  },
  {
    id: 'last-stand',
    name: 'Last Stand',
    type: 'asymmetric',
    sizes: [],
    desc: 'Defender holds a circular strongpoint in the centre while the Attacker surrounds from corner triangles.',
    image: '/deployment-zones/last-stand.png',
  },
];
