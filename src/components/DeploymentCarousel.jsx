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
// Scale: 176px = 44"  →  1" = 4px horizontal
//        260px = 60"  →  1" ≈ 4.33px vertical
// 9" offsets: 36px horizontal, 39px vertical
const W = 196, H = 280, P = 10;
const bw = W - 2 * P; // 176
const bh = H - 2 * P; // 260
const cx = P + bw / 2; // 98  — board centre x
const cy = P + bh / 2; // 140 — board centre y

// Standard 5-objective cross positions (9" from centre)
const OBJ = {
  c:  { x: cx,      y: cy      }, // 1 — centre
  l:  { x: cx - 36, y: cy      }, // 2 — left   (9" W)
  r:  { x: cx + 36, y: cy      }, // 3 — right  (9" E)
  t:  { x: cx,      y: cy - 39 }, // 4 — top    (9" N)
  b:  { x: cx,      y: cy + 39 }, // 5 — bottom (9" S)
};

// ─── Shared primitives ────────────────────────────────────────────────────────
function Obj({ x, y, n, dx = 7, dy = -7 }) {
  return (
    <g>
      <circle cx={x} cy={y} r={5.5} fill="none" stroke={C.obj} strokeWidth={1.5} />
      <circle cx={x} cy={y} r={2}   fill={C.obj} />
      <text x={x + dx} y={y + dy}
        fontSize="9" fontWeight="700" fill={C.obj}
        fontFamily="system-ui, sans-serif"
        dominantBaseline="auto" textAnchor="start"
      >{n}</text>
    </g>
  );
}

// Dimension line — auto-detects horizontal vs vertical.
// Vertical:   horizontal tick marks at each end; label to the RIGHT of midpoint.
// Horizontal: vertical tick marks at each end; label ABOVE the midpoint.
function Dim({ x1, y1, x2, y2, label }) {
  const isV = Math.abs(x2 - x1) < Math.abs(y2 - y1);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return (
    <g stroke={C.obj} strokeWidth={0.8} fill={C.obj}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      {isV ? (
        // Vertical line — horizontal end ticks, label to the right
        <>
          <line x1={x1 - 3} y1={y1} x2={x1 + 3} y2={y1} />
          <line x1={x2 - 3} y1={y2} x2={x2 + 3} y2={y2} />
          <text x={mx + 4} y={my + 3}
            fontSize="8" fontWeight="600"
            fontFamily="system-ui, sans-serif"
            textAnchor="start" dominantBaseline="middle"
            fill={C.obj}
          >{label}</text>
        </>
      ) : (
        // Horizontal line — vertical end ticks, label above
        <>
          <line x1={x1} y1={y1 - 3} x2={x1} y2={y1 + 3} />
          <line x1={x2} y1={y2 - 3} x2={x2} y2={y2 + 3} />
          <text x={mx} y={my - 4}
            fontSize="8" fontWeight="600"
            fontFamily="system-ui, sans-serif"
            textAnchor="middle" dominantBaseline="auto"
            fill={C.obj}
          >{label}</text>
        </>
      )}
    </g>
  );
}

// Standard cross objective dimensions — one horizontal "9″" + one vertical "9″".
// Lines run from left/top objective to centre, placed slightly offset to avoid
// overlapping the objective circles.
function CrossDims() {
  return (
    <>
      {/* Horizontal: left obj → centre, line runs above the objectives */}
      <Dim x1={OBJ.l.x} y1={OBJ.l.y - 9} x2={OBJ.c.x} y2={OBJ.c.y - 9} label='9"' />
      {/* Vertical: top obj → centre, line runs to the right of the objectives */}
      <Dim x1={OBJ.t.x + 9} y1={OBJ.t.y} x2={OBJ.c.x + 9} y2={OBJ.c.y} label='9"' />
    </>
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
      <CrossDims />
      <Obj x={OBJ.c.x} y={OBJ.c.y} n={1} />
      <Obj x={OBJ.l.x} y={OBJ.l.y} n={2} />
      <Obj x={OBJ.r.x} y={OBJ.r.y} n={3} />
      <Obj x={OBJ.t.x} y={OBJ.t.y} n={4} />
      <Obj x={OBJ.b.x} y={OBJ.b.y} n={5} />
    </Board>
  ),

  // Strips along the short (top/bottom) edges — 12" deep
  'dawn-of-war': () => {
    const zoneH = 52; // 12" × 260/60 ≈ 52px
    return (
      <Board>
        <rect x={P} y={P}          width={bw} height={zoneH} fill={C.zA} stroke={C.sk} strokeWidth={1} />
        <rect x={P} y={H-P-zoneH}  width={bw} height={zoneH} fill={C.zB} stroke={C.sk} strokeWidth={1} />
        {/* Zone depth — vertical line inside the top zone, left side */}
        <Dim x1={P + 8} y1={P} x2={P + 8} y2={P + zoneH} label='12"' />
        <CrossDims />
        <Obj x={OBJ.c.x} y={OBJ.c.y} n={1} />
        <Obj x={OBJ.l.x} y={OBJ.l.y} n={2} />
        <Obj x={OBJ.r.x} y={OBJ.r.y} n={3} />
        <Obj x={OBJ.t.x} y={OBJ.t.y} n={4} />
        <Obj x={OBJ.b.x} y={OBJ.b.y} n={5} />
      </Board>
    );
  },

  // Strips along the long (left/right) edges — 9" deep
  'hammer-and-anvil': () => {
    const zoneW = 36; // 9" × 176/44 = 36px
    return (
      <Board>
        <rect x={P}          y={P} width={zoneW} height={bh} fill={C.zA} stroke={C.sk} strokeWidth={1} />
        <rect x={W-P-zoneW}  y={P} width={zoneW} height={bh} fill={C.zB} stroke={C.sk} strokeWidth={1} />
        {/* Zone depth — horizontal line inside the left zone, top area */}
        <Dim x1={P} y1={P + 10} x2={P + zoneW} y2={P + 10} label='9"' />
        <CrossDims />
        <Obj x={OBJ.c.x} y={OBJ.c.y} n={1} />
        <Obj x={OBJ.l.x} y={OBJ.l.y} n={2} />
        <Obj x={OBJ.r.x} y={OBJ.r.y} n={3} />
        <Obj x={OBJ.t.x} y={OBJ.t.y} n={4} />
        <Obj x={OBJ.b.x} y={OBJ.b.y} n={5} />
      </Board>
    );
  },

  // Opposite corner quadrants
  'search-and-destroy': () => (
    <Board>
      <rect x={P}  y={P}   width={88} height={130} fill={C.zA} stroke={C.sk} strokeWidth={1} />
      <rect x={98} y={140} width={88} height={130} fill={C.zB} stroke={C.sk} strokeWidth={1} />
      <CrossDims />
      <Obj x={OBJ.c.x} y={OBJ.c.y} n={1} />
      <Obj x={OBJ.l.x} y={OBJ.l.y} n={2} />
      <Obj x={OBJ.r.x} y={OBJ.r.y} n={3} />
      <Obj x={OBJ.t.x} y={OBJ.t.y} n={4} />
      <Obj x={OBJ.b.x} y={OBJ.b.y} n={5} />
    </Board>
  ),

  // Long-edge strips with interlocking flank protrusions
  'sweeping-engagement': () => (
    <Board>
      <polygon points="10,10 186,10 186,140 98,140 98,80 10,80"
        fill={C.zA} stroke={C.sk} strokeWidth={1} />
      <polygon points="10,140 98,140 98,200 186,200 186,270 10,270"
        fill={C.zB} stroke={C.sk} strokeWidth={1} />
      <CrossDims />
      <Obj x={OBJ.c.x} y={OBJ.c.y} n={1} />
      <Obj x={OBJ.l.x} y={OBJ.l.y} n={2} />
      <Obj x={OBJ.r.x} y={OBJ.r.y} n={3} />
      <Obj x={OBJ.t.x} y={OBJ.t.y} n={4} />
      <Obj x={OBJ.b.x} y={OBJ.b.y} n={5} />
    </Board>
  ),

  // Asymmetric interlocking L-shapes
  'tipping-point': () => (
    <Board>
      <polygon points="10,10 186,10 186,80 98,80 98,186 10,186"
        fill={C.zA} stroke={C.sk} strokeWidth={1} />
      <polygon points="98,80 186,80 186,270 10,270 10,186 98,186"
        fill={C.zB} stroke={C.sk} strokeWidth={1} />
      <CrossDims />
      <Obj x={OBJ.c.x} y={OBJ.c.y} n={1} />
      <Obj x={OBJ.l.x} y={OBJ.l.y} n={2} />
      <Obj x={OBJ.r.x} y={OBJ.r.y} n={3} />
      <Obj x={OBJ.t.x} y={OBJ.t.y} n={4} />
      <Obj x={OBJ.b.x} y={OBJ.b.y} n={5} />
    </Board>
  ),

  // Attacker wide top strip; Defender pointed triangle at bottom
  'tip-of-the-spear': () => {
    const zoneH = 52; // 12" deep
    return (
      <Board>
        <rect x={P} y={P} width={bw} height={zoneH}
          fill={C.zA} stroke={C.sk} strokeWidth={1} />
        <polygon points="56,270 140,270 98,200"
          fill={C.zB} stroke={C.sk} strokeWidth={1} />
        {/* Attacker zone depth */}
        <Dim x1={P + 8} y1={P} x2={P + 8} y2={P + zoneH} label='12"' />
        {/* Objective position dims — horizontal only (3 in a row) */}
        <Dim x1={OBJ.l.x} y1={OBJ.l.y - 9} x2={OBJ.c.x} y2={OBJ.c.y - 9} label='9"' />
        <Obj x={OBJ.c.x} y={OBJ.c.y} n={1} />
        <Obj x={OBJ.l.x} y={OBJ.l.y} n={2} />
        <Obj x={OBJ.r.x} y={OBJ.r.y} n={3} />
        <Obj x={OBJ.t.x} y={OBJ.t.y} n={4} />
      </Board>
    );
  },

  // Diagonal split — attacker large flank, defender diagonal stronghold
  'defensive-line': () => (
    <Board>
      <polygon points="10,10 116,10 76,270 10,270"
        fill={C.zA} stroke={C.sk} strokeWidth={1} />
      <polygon points="116,10 186,10 186,270 76,270"
        fill={C.zB} stroke={C.sk} strokeWidth={1} />
      <CrossDims />
      <Obj x={OBJ.c.x} y={OBJ.c.y} n={1} />
      <Obj x={OBJ.l.x} y={OBJ.l.y} n={2} />
      <Obj x={OBJ.r.x} y={OBJ.r.y} n={3} />
      <Obj x={OBJ.t.x} y={OBJ.t.y} n={4} />
      <Obj x={OBJ.b.x} y={OBJ.b.y} n={5} />
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
      <rect x={50} y={95} width={96} height={90}
        fill="none" stroke={C.sk} strokeWidth={1} strokeDasharray="5 3" />
      <CrossDims />
      <Obj x={OBJ.c.x} y={OBJ.c.y} n={1} />
      <Obj x={OBJ.l.x} y={OBJ.l.y} n={2} />
      <Obj x={OBJ.r.x} y={OBJ.r.y} n={3} />
      <Obj x={OBJ.t.x} y={OBJ.t.y} n={4} />
      <Obj x={OBJ.b.x} y={OBJ.b.y} n={5} />
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
