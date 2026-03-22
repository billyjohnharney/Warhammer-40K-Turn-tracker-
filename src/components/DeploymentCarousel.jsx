import { useState } from 'react';

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  bg:     '#cfcdb6',
  zA:     '#c2c0ab',  // player A zone
  zB:     '#9e9c8e',  // player B zone
  sk:     '#848370',  // zone borders
  border: '#5f5e4e',  // board outline
  obj:    '#3e5e38',  // objective markers — muted forest green
};

// Portrait board: 196 × 280, 10px padding → board area 176 × 260, centre (98,140)
const W = 196, H = 280, P = 10;
const bw = W - 2 * P; // 176
const bh = H - 2 * P; // 260
const cx = P + bw / 2; // 98
const cy = P + bh / 2; // 140

// ─── Shared primitives ────────────────────────────────────────────────────────
// n = objective number label; dx/dy nudge the label off the circle
function Obj({ x, y, n = '', dx = 7, dy = -7 }) {
  return (
    <g>
      <circle cx={x} cy={y} r={5.5} fill="none" stroke={C.obj} strokeWidth={1.5} />
      <circle cx={x} cy={y} r={2}   fill={C.obj} />
      {n !== '' && (
        <text x={x + dx} y={y + dy}
          fontSize="9" fontWeight="700" fill={C.obj}
          fontFamily="system-ui, sans-serif"
          dominantBaseline="auto" textAnchor="start"
        >{n}</text>
      )}
    </g>
  );
}

// Dimension line: draws a ruled measurement annotation in green
// x1,y1 → x2,y2 with a centred label; orient='h' or 'v'
function Dim({ x1, y1, x2, y2, label }) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return (
    <g stroke={C.obj} strokeWidth={1} fill={C.obj}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <line x1={x1 - 3} y1={y1} x2={x1 + 3} y2={y1} />
      <line x1={x2 - 3} y1={y2} x2={x2 + 3} y2={y2} />
      <text x={mx} y={my - 3} fontSize="8" fontWeight="600"
        fontFamily="system-ui, sans-serif"
        textAnchor="middle" dominantBaseline="auto"
      >{label}</text>
    </g>
  );
}

function Board({ children }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', width: '100%', height: '100%' }}
      aria-hidden="true"
    >
      <rect x={P} y={P} width={bw} height={bh}
        fill={C.bg} stroke={C.border} strokeWidth={1.5} rx={2} />
      {children}
    </svg>
  );
}

// ─── Zone map components ──────────────────────────────────────────────────────
const ZONE_MAPS = {

  // Diagonal split corner-to-corner
  'crucible-of-battle': () => (
    <Board>
      <polygon points={`${P},${P} ${W-P},${P} ${P},${H-P}`}
        fill={C.zA} stroke={C.sk} strokeWidth={1} />
      <polygon points={`${W-P},${P} ${W-P},${H-P} ${P},${H-P}`}
        fill={C.zB} stroke={C.sk} strokeWidth={1} />
      <Obj x={cx}  y={cy}  n={1} dx={7}  dy={-7} />
      <Obj x={58}  y={72}  n={2} dx={7}  dy={-7} />
      <Obj x={138} y={208} n={3} dx={7}  dy={-7} />
      <Obj x={52}  y={198} n={4} dx={7}  dy={-7} />
      <Obj x={144} y={82}  n={5} dx={7}  dy={-7} />
    </Board>
  ),

  // Strips along the short (top/bottom) edges
  'dawn-of-war': () => (
    <Board>
      <rect x={P}  y={P}       width={bw} height={60} fill={C.zA} stroke={C.sk} strokeWidth={1} />
      <rect x={P}  y={H-P-60}  width={bw} height={60} fill={C.zB} stroke={C.sk} strokeWidth={1} />
      {/* Zone depth dimension */}
      <Dim x1={188} y1={P} x2={188} y2={P+60} label='12"' />
      <Obj x={cx}  y={cy}  n={1} dx={7}  dy={-7} />
      <Obj x={57}  y={cy}  n={2} dx={7}  dy={-7} />
      <Obj x={139} y={cy}  n={3} dx={7}  dy={-7} />
      <Obj x={cx}  y={100} n={4} dx={7}  dy={-7} />
      <Obj x={cx}  y={180} n={5} dx={7}  dy={-7} />
    </Board>
  ),

  // Strips along the long (left/right) edges
  'hammer-and-anvil': () => (
    <Board>
      <rect x={P}       y={P} width={50}  height={bh} fill={C.zA} stroke={C.sk} strokeWidth={1} />
      <rect x={W-P-50}  y={P} width={50}  height={bh} fill={C.zB} stroke={C.sk} strokeWidth={1} />
      {/* Zone depth dimension */}
      <Dim x1={P} y1={272} x2={P+50} y2={272} label='9"' />
      <Obj x={cx}  y={cy}  n={1} dx={7}  dy={-7} />
      <Obj x={cx}  y={88}  n={2} dx={7}  dy={-7} />
      <Obj x={cx}  y={192} n={3} dx={7}  dy={-7} />
      <Obj x={57}  y={cy}  n={4} dx={7}  dy={-7} />
      <Obj x={139} y={cy}  n={5} dx={7}  dy={-7} />
    </Board>
  ),

  // Opposite corner quadrants
  'search-and-destroy': () => (
    <Board>
      <rect x={P}   y={P}   width={88} height={130} fill={C.zA} stroke={C.sk} strokeWidth={1} />
      <rect x={98}  y={140} width={88} height={130} fill={C.zB} stroke={C.sk} strokeWidth={1} />
      <Obj x={cx}  y={cy}  n={1} dx={7}  dy={-7} />
      <Obj x={54}  y={196} n={2} dx={7}  dy={-7} />
      <Obj x={142} y={84}  n={3} dx={7}  dy={-7} />
      <Obj x={54}  y={84}  n={4} dx={7}  dy={-7} />
      <Obj x={142} y={196} n={5} dx={7}  dy={-7} />
    </Board>
  ),

  // Long-edge strips with interlocking flank protrusions
  'sweeping-engagement': () => (
    <Board>
      {/* Zone A: full-width top band + right-side protrusion toward centre */}
      <polygon points="10,10 186,10 186,140 98,140 98,80 10,80"
        fill={C.zA} stroke={C.sk} strokeWidth={1} />
      {/* Zone B: left-side protrusion + full-width bottom band */}
      <polygon points="10,140 98,140 98,200 186,200 186,270 10,270"
        fill={C.zB} stroke={C.sk} strokeWidth={1} />
      <Obj x={cx}  y={cy}  n={1} dx={7}  dy={-7} />
      <Obj x={57}  y={50}  n={2} dx={7}  dy={-7} />
      <Obj x={139} y={230} n={3} dx={7}  dy={-7} />
      <Obj x={57}  y={230} n={4} dx={7}  dy={-7} />
      <Obj x={139} y={50}  n={5} dx={7}  dy={-7} />
    </Board>
  ),

  // Asymmetric interlocking L-shapes
  'tipping-point': () => (
    <Board>
      {/* Zone A: top band + left column */}
      <polygon points="10,10 186,10 186,80 98,80 98,186 10,186"
        fill={C.zA} stroke={C.sk} strokeWidth={1} />
      {/* Zone B: right column + bottom band */}
      <polygon points="98,80 186,80 186,270 10,270 10,186 98,186"
        fill={C.zB} stroke={C.sk} strokeWidth={1} />
      <Obj x={cx}  y={cy}  n={1} dx={7}  dy={-7} />
      <Obj x={57}  y={50}  n={2} dx={7}  dy={-7} />
      <Obj x={139} y={230} n={3} dx={7}  dy={-7} />
      <Obj x={60}  y={160} n={4} dx={7}  dy={-7} />
      <Obj x={136} y={120} n={5} dx={7}  dy={-7} />
    </Board>
  ),

  // Attacker wide top strip; Defender pointed triangle at bottom
  'tip-of-the-spear': () => (
    <Board>
      <rect x={P} y={P} width={bw} height={65}
        fill={C.zA} stroke={C.sk} strokeWidth={1} />
      <polygon points="56,270 140,270 98,195"
        fill={C.zB} stroke={C.sk} strokeWidth={1} />
      {/* Zone depth dimension */}
      <Dim x1={188} y1={P} x2={188} y2={P+65} label='12"' />
      <Obj x={cx}  y={cy}  n={1} dx={7}  dy={-7} />
      <Obj x={57}  y={cy}  n={2} dx={7}  dy={-7} />
      <Obj x={139} y={cy}  n={3} dx={7}  dy={-7} />
      <Obj x={cx}  y={88}  n={4} dx={7}  dy={-7} />
    </Board>
  ),

  // Diagonal split — attacker large flank, defender diagonal stronghold
  'defensive-line': () => (
    <Board>
      <polygon points="10,10 116,10 76,270 10,270"
        fill={C.zA} stroke={C.sk} strokeWidth={1} />
      <polygon points="116,10 186,10 186,270 76,270"
        fill={C.zB} stroke={C.sk} strokeWidth={1} />
      <Obj x={cx}  y={cy}  n={1} dx={7}  dy={-7} />
      <Obj x={52}  y={80}  n={2} dx={7}  dy={-7} />
      <Obj x={52}  y={210} n={3} dx={7}  dy={-7} />
      <Obj x={144} y={80}  n={4} dx={7}  dy={-7} />
      <Obj x={144} y={210} n={5} dx={7}  dy={-7} />
    </Board>
  ),

  // Attacker: two flanking corner blocks; Defender: implied centre
  'pincer-attack': () => (
    <Board>
      <rect x={106} y={10}  width={80} height={115}
        fill={C.zA} stroke={C.sk} strokeWidth={1} />
      <rect x={10}  y={155} width={80} height={115}
        fill={C.zA} stroke={C.sk} strokeWidth={1} />
      {/* Defender centre — dashed outline */}
      <rect x={50}  y={95}  width={96} height={90}
        fill="none" stroke={C.sk} strokeWidth={1} strokeDasharray="5 3" />
      <Obj x={cx}  y={cy}  n={1} dx={7}  dy={-7} />
      <Obj x={146} y={62}  n={2} dx={7}  dy={-7} />
      <Obj x={50}  y={218} n={3} dx={7}  dy={-7} />
      <Obj x={50}  y={62}  n={4} dx={7}  dy={-7} />
      <Obj x={146} y={218} n={5} dx={7}  dy={-7} />
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

  const zone  = zones[idx];
  const MapFn = ZONE_MAPS[zone.id];

  function prev() { setIdx(i => (i - 1 + zones.length) % zones.length); }
  function next() { setIdx(i => (i + 1) % zones.length); }

  return (
    <div className="dz-carousel">
      {/* Portrait map — no frame border */}
      <div className="dz-frame">
        {MapFn && <MapFn />}
      </div>

      {/* Chevrons flank the title + description */}
      <div className="dz-nav-row">
        <button className="dz-chevron" onClick={prev} aria-label="Previous deployment zone">
          <Chevron dir="left" />
        </button>

        <div className="dz-info">
          <span className="dz-counter">{idx + 1} / {zones.length}</span>
          <span className="dz-name">{zone.name}</span>
          <p className="dz-desc">{zone.desc}</p>
        </div>

        <button className="dz-chevron" onClick={next} aria-label="Next deployment zone">
          <Chevron dir="right" />
        </button>
      </div>
    </div>
  );
}
