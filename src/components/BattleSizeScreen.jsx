import { useState } from 'react';
import { MISSIONS } from '../data/missions.js';
import MissionModal from './MissionModal.jsx';

const BATTLE_SIZES = [
  {
    id: 'combat-patrol',
    label: 'Combat Patrol',
    desc: 'Small-scale engagements ideal for fast, focused skirmishes.',
  },
  {
    id: 'incursion',
    label: 'Incursion',
    desc: 'Mid-sized battles offering more tactical depth than Combat Patrol.',
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

const MISSION_CATEGORIES = ['Standard', 'Asymmetric War'];

export default function BattleSizeScreen({ onSelect }) {
  const [selectedMission, setSelectedMission] = useState(null);
  const [modalMissionId, setModalMissionId] = useState(null);

  function handleMissionClick(missionId) {
    setSelectedMission(missionId);
    setModalMissionId(missionId);
  }

  function handleSizeSelect(sizeId) {
    onSelect({ battleSize: sizeId, mission: selectedMission });
  }

  return (
    <main className="options-screen">
      <h1 className="setup-page-title">Build Battle</h1>

      {/* ── Mission ─────────────────────────────────────────────────────── */}
      <p className="options-subtitle">Select a primary mission.</p>
      <div className="mission-section">
        {MISSION_CATEGORIES.map(category => (
          <div key={category} className="mission-category-group">
            <p className="mission-category-label">{category}</p>
            <div className="mission-cards">
              {MISSIONS.filter(m => m.category === category).map(mission => (
                <button
                  key={mission.id}
                  className={`mission-card${selectedMission === mission.id ? ' mission-card--selected' : ''}`}
                  onClick={() => handleMissionClick(mission.id)}
                >
                  <span className="mission-card-title">{mission.title}</span>
                  <span className="mission-card-summary">{mission.summary}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Battle size ──────────────────────────────────────────────────── */}
      <p className="options-subtitle battle-size-subtitle">Select the scale of your engagement.</p>
      <div className="battle-size-cards">
        {BATTLE_SIZES.map(size => (
          <button
            key={size.id}
            className="battle-size-card"
            onClick={() => handleSizeSelect(size.id)}
          >
            <span className="battle-size-label">{size.label}</span>
            <span className="battle-size-desc">{size.desc}</span>
          </button>
        ))}
      </div>

      <MissionModal
        missionId={modalMissionId}
        onClose={() => setModalMissionId(null)}
      />
    </main>
  );
}
