import { useState } from 'react';

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

export default function DeploymentCarousel({ zones, battleSize }) {
  const [idx, setIdx] = useState(0);

  if (!zones.length) return null;

  const zone = zones[idx];

  // Pick size-specific image for standard zones, single image for asymmetric
  const imgSrc = zone.images
    ? (zone.images[battleSize] ?? zone.images['incursion'])
    : zone.image;

  function prev() { setIdx(i => (i - 1 + zones.length) % zones.length); }
  function next() { setIdx(i => (i + 1) % zones.length); }

  return (
    <div className="dz-carousel">
      <div className="dz-frame">
        {imgSrc && (
          <img
            src={imgSrc}
            alt={zone.name}
            style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center bottom' }}
          />
        )}
      </div>

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
