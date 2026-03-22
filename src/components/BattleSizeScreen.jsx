const BATTLE_SIZES = [
  {
    id: 'combat-patrol',
    label: 'Combat Patrol',
    desc: 'Small-scale engagements ideal for fast, focused skirmishes.',
  },
  {
    id: 'strike-force',
    label: 'Strike Force',
    desc: 'Standard matched play battles — the definitive Warhammer 40,000 experience.',
  },
  {
    id: 'onslaught',
    label: 'Onslaught',
    desc: 'Massive clashes fought across a wider battlefield with larger armies.',
  },
];

export default function BattleSizeScreen({ onSelect }) {
  return (
    <main className="options-screen">
      <h1 className="setup-page-title">Battle Size</h1>
      <p className="options-subtitle">Select the scale of your engagement.</p>
      <div className="battle-size-cards">
        {BATTLE_SIZES.map(size => (
          <button
            key={size.id}
            className="battle-size-card"
            onClick={() => onSelect(size.id)}
          >
            <span className="battle-size-label">{size.label}</span>
            <span className="battle-size-desc">{size.desc}</span>
          </button>
        ))}
      </div>
    </main>
  );
}
