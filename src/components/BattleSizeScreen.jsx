import { useState } from 'react';
import { MISSIONS } from '../data/missions.js';
import { DEPLOYMENT_ZONES } from '../data/deploymentZones.js';
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
const PAGE_LABELS = ['Mission', 'Army Size', 'Deployment'];

function getFilteredZones(selectedSize, selectedMission) {
  const missionIsAsymmetric =
    selectedMission &&
    MISSIONS.find(m => m.id === selectedMission)?.category === 'Asymmetric War';

  if (missionIsAsymmetric) {
    return DEPLOYMENT_ZONES.filter(z => z.type === 'asymmetric');
  }
  if (selectedSize) {
    return DEPLOYMENT_ZONES.filter(
      z => z.type === 'standard' && z.sizes.includes(selectedSize),
    );
  }
  return DEPLOYMENT_ZONES;
}

export default function BattleSizeScreen({ onSelect }) {
  const [page, setPage] = useState(0);
  const [selectedMission, setSelectedMission] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedDeployment, setSelectedDeployment] = useState(null);
  const [modalMissionId, setModalMissionId] = useState(null);

  function handleMissionClick(missionId) {
    setSelectedMission(missionId);
    setModalMissionId(missionId);
  }

  function handleSizeClick(sizeId) {
    setSelectedSize(sizeId);
    // Reset deployment if it's no longer in the filtered list
    const stillValid = getFilteredZones(sizeId, selectedMission).some(
      z => z.id === selectedDeployment,
    );
    if (!stillValid) setSelectedDeployment(null);
    setPage(2);
  }

  function handleDone() {
    onSelect({
      battleSize: selectedSize,
      mission: selectedMission,
      deploymentZone: selectedDeployment,
    });
  }

  const filteredZones = getFilteredZones(selectedSize, selectedMission);

  return (
    <main className="options-screen">
      <h1 className="setup-page-title">Build Battle</h1>

      {/* ── Pagination dots ────────────────────────────────────────────── */}
      <div className="bb-dots" aria-label="Steps">
        {PAGE_LABELS.map((label, i) => (
          <button
            key={i}
            className={`bb-dot${i === page ? ' bb-dot--active' : ''}${i < page ? ' bb-dot--done' : ''}`}
            onClick={() => { if (i < page) setPage(i); }}
            aria-label={label}
            aria-current={i === page ? 'step' : undefined}
          >
            <span className="bb-dot-pip" />
            <span className="bb-dot-label">{label}</span>
          </button>
        ))}
      </div>

      {/* ── Page 0: Mission ────────────────────────────────────────────── */}
      {page === 0 && (
        <>
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
          <div className="bb-nav">
            <button className="bb-nav-next" onClick={() => setPage(1)}>
              Next
            </button>
          </div>
        </>
      )}

      {/* ── Page 1: Battle size ────────────────────────────────────────── */}
      {page === 1 && (
        <>
          <p className="options-subtitle">Select the scale of your engagement.</p>
          <div className="battle-size-cards">
            {BATTLE_SIZES.map(size => (
              <button
                key={size.id}
                className={`battle-size-card${selectedSize === size.id ? ' battle-size-card--selected' : ''}`}
                onClick={() => handleSizeClick(size.id)}
              >
                <span className="battle-size-label">{size.label}</span>
                <span className="battle-size-desc">{size.desc}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── Page 2: Deployment zone ────────────────────────────────────── */}
      {page === 2 && (
        <>
          <p className="options-subtitle">Select a deployment zone.</p>
          <div className="mission-cards">
            {filteredZones.map(zone => (
              <button
                key={zone.id}
                className={`mission-card${selectedDeployment === zone.id ? ' mission-card--selected' : ''}`}
                onClick={() => setSelectedDeployment(zone.id)}
              >
                <span className="mission-card-title">{zone.name}</span>
                <span className="mission-card-summary">{zone.desc}</span>
              </button>
            ))}
          </div>
          <div className="bb-nav">
            <button className="bb-nav-next" onClick={handleDone}>
              Begin Setup
            </button>
          </div>
        </>
      )}

      <MissionModal
        missionId={modalMissionId}
        onClose={() => setModalMissionId(null)}
      />
    </main>
  );
}
