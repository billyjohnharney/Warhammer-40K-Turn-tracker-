import { useState } from 'react';

// ─── Palette (matches app CSS variables) ──────────────────────────────────────
const C = {
  bg:     '#cfcdb6',
  zA:     '#c2c0ab',  // player A zone (gray-100)
  zB:     '#9e9c8e',  // player B zone (gray-300)
  sk:     '#848370',  // zone borders  (gray-400)
  border: '#5f5e4e',  // board outline  (gray-600)
  obj:    '#141408',  // objective markers
};

// ─── SVG primitives ───────────────────────────────────────────────────────────
function Obj({ cx, cy }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={5.5} fill="none" stroke={C.obj} strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={2}   fill={C.obj} />
    </g>
  );
}

function Board({ children }) {
  return (
    <svg
      viewBox="0 0 280 196"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', width: '100%', height: '100%' }}
      aria-hidden="true"
    >
      {/* Board surface */}
      <rect x={10} y={10} width={260} height={176}
        fill={C.bg} stroke={C.border} strokeWidth={1.5} rx={2} />
      {children}
    </svg>
  );
}

// ─── Deployment zone maps ─────────────────────────────────────────────────────
const ZONE_MAPS = {
  'crucible-of-battle': () => (
    <Board>
      {/* Diagonal split: Zone A top-left, Zone B bottom-right */}
      <polygon points="10,10 270,10 10,186"       fill={C.zA} stroke={C.sk} strokeWidth={1} />
      <polygon points="270,10 270,186 10,186"      fill={C.zB} stroke={C.sk} strokeWidth={1} />
      <Obj cx={140} cy={98} />
      <Obj cx={75}  cy={72} />
      <Obj cx={205} cy={124} />
      <Obj cx={68}  cy={150} />
      <Obj cx={212} cy={48} />
    </Board>
  ),

  'dawn-of-war': () => (
    <Board>
      {/* Strips along the short (left/right) edges */}
      <rect x={10}  y={10} width={65} height={176} fill={C.zA} stroke={C.sk} strokeWidth={1} />
      <rect x={205} y={10} width={65} height={176} fill={C.zB} stroke={C.sk} strokeWidth={1} />
      <Obj cx={140} cy={98} />
      <Obj cx={140} cy={54} />
      <Obj cx={140} cy={142} />
      <Obj cx={108} cy={98} />
      <Obj cx={172} cy={98} />
    </Board>
  ),

  'hammer-and-anvil': () => (
    <Board>
      {/* Strips along the long (top/bottom) edges */}
      <rect x={10} y={10}  width={260} height={50} fill={C.zA} stroke={C.sk} strokeWidth={1} />
      <rect x={10} y={136} width={260} height={50} fill={C.zB} stroke={C.sk} strokeWidth={1} />
      <Obj cx={140} cy={98} />
      <Obj cx={83}  cy={98} />
      <Obj cx={197} cy={98} />
      <Obj cx={140} cy={60} />
      <Obj cx={140} cy={136} />
    </Board>
  ),

  'search-and-destroy': () => (
    <Board>
      {/* Opposite corner quadrants */}
      <rect x={10}  y={10}  width={125} height={88} fill={C.zA} stroke={C.sk} strokeWidth={1} />
      <rect x={145} y={98}  width={125} height={88} fill={C.zB} stroke={C.sk} strokeWidth={1} />
      <Obj cx={140} cy={98} />
      <Obj cx={70}  cy={148} />
      <Obj cx={210} cy={54} />
      <Obj cx={72}  cy={54} />
      <Obj cx={208} cy={148} />
    </Board>
  ),

  'sweeping-engagement': () => (
    <Board>
      {/* Zone A: top strip + left-side protrusion into centre */}
      <polygon
        points="10,10 270,10 270,54 140,54 140,98 10,98"
        fill={C.zA} stroke={C.sk} strokeWidth={1}
      />
      {/* Zone B: bottom strip + right-side protrusion into centre */}
      <polygon
        points="140,98 270,98 270,186 10,186 10,142 140,142"
        fill={C.zB} stroke={C.sk} strokeWidth={1}
      />
      <Obj cx={140} cy={98} />
      <Obj cx={75}  cy={54} />
      <Obj cx={205} cy={142} />
      <Obj cx={75}  cy={142} />
      <Obj cx={205} cy={54} />
    </Board>
  ),

  'tipping-point': () => (
    <Board>
      {/* Zone A: wraps top and left  */}
      <polygon
        points="10,10 270,10 270,54 140,54 140,142 10,142"
        fill={C.zA} stroke={C.sk} strokeWidth={1}
      />
      {/* Zone B: wraps bottom and right */}
      <polygon
        points="140,54 270,54 270,186 10,186 10,142 140,142"
        fill={C.zB} stroke={C.sk} strokeWidth={1}
      />
      <Obj cx={140} cy={98} />
      <Obj cx={75}  cy={75} />
      <Obj cx={205} cy={120} />
      <Obj cx={85}  cy={163} />
      <Obj cx={195} cy={32} />
    </Board>
  ),

  'tip-of-the-spear': () => (
    <Board>
      {/* Attacker: wide strip across the top */}
      <rect x={10} y={10} width={260} height={65} fill={C.zA} stroke={C.sk} strokeWidth={1} />
      {/* Defender: pointed triangle at the bottom centre */}
      <polygon points="95,186 185,186 140,121" fill={C.zB} stroke={C.sk} strokeWidth={1} />
      <Obj cx={140} cy={98} />
      <Obj cx={85}  cy={98} />
      <Obj cx={195} cy={98} />
      <Obj cx={140} cy={55} />
    </Board>
  ),

  'defensive-line': () => (
    <Board>
      {/* Attacker: large left-side zone with diagonal far edge */}
      <polygon points="10,10 160,10 100,186 10,186" fill={C.zA} stroke={C.sk} strokeWidth={1} />
      {/* Defender: diagonal stronghold on the right */}
      <polygon points="160,10 270,10 270,186 100,186" fill={C.zB} stroke={C.sk} strokeWidth={1} />
      <Obj cx={140} cy={98} />
      <Obj cx={70}  cy={68} />
      <Obj cx={70}  cy={142} />
      <Obj cx={195} cy={68} />
      <Obj cx={195} cy={142} />
    </Board>
  ),

  'pincer-attack': () => (
    <Board>
      {/* Attacker: two flanking corner zones (same colour = same force) */}
      <rect x={10}  y={10}  width={115} height={88} fill={C.zA} stroke={C.sk} strokeWidth={1} />
      <rect x={155} y={98}  width={115} height={88} fill={C.zA} stroke={C.sk} strokeWidth={1} />
      {/* Defender: implied central area shown with dashed outline */}
      <rect x={100} y={10}  width={80}  height={176}
        fill="none" stroke={C.sk} strokeWidth={1} strokeDasharray="5 3" />
      <Obj cx={140} cy={98} />
      <Obj cx={63}  cy={54} />
      <Obj cx={217} cy={142} />
      <Obj cx={63}  cy={142} />
      <Obj cx={217} cy={54} />
    </Board>
  ),
};

// ─── Chevron icon ─────────────────────────────────────────────────────────────
function Chevron({ dir }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      {dir === 'left'
        ? <polyline points="15 18 9 12 15 6" />
        : <polyline points="9 18 15 12 9 6" />}
    </svg>
  );
}

// ─── Carousel ─────────────────────────────────────────────────────────────────
export default function DeploymentCarousel({ zones }) {
  const [idx, setIdx] = useState(0);

  if (!zones.length) return null;

  const zone = zones[idx];
  const MapFn = ZONE_MAPS[zone.id];

  function prev() { setIdx(i => (i - 1 + zones.length) % zones.length); }
  function next() { setIdx(i => (i + 1) % zones.length); }

  return (
    <div className="dz-carousel">
      <div className="dz-viewer">
        <button className="dz-chevron" onClick={prev} aria-label="Previous deployment zone">
          <Chevron dir="left" />
        </button>

        <div className="dz-frame">
          {MapFn && <MapFn />}
        </div>

        <button className="dz-chevron" onClick={next} aria-label="Next deployment zone">
          <Chevron dir="right" />
        </button>
      </div>

      <div className="dz-info">
        <span className="dz-counter">{idx + 1} / {zones.length}</span>
        <span className="dz-name">{zone.name}</span>
        <p className="dz-desc">{zone.desc}</p>
      </div>
    </div>
  );
}
