import { useGame } from '../context/GameContext.jsx';
import { phases, PHASE_ICONS } from '../data/phases.js';

export default function TurnBar() {
  const { state, dispatch } = useGame();
  const { activePhaseIndex } = state;

  return (
    <div className="turn-bar">
      <div className="turn-bar-inner">
        <div className="phase-pills">
          {phases.map((phase, i) => {
            const isActive = i === activePhaseIndex;
            const cls = isActive ? 'active' : '';
            const meta = PHASE_ICONS[phase.id] || { svg: '', label: phase.id };
            return (
              <button
                key={phase.id}
                className={`phase-pill ${cls}`}
                onClick={() => {
                  dispatch({ type: 'SET_ACTIVE_PHASE', payload: i });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                title={phase.title}
              >
                <span
                  className="pill-icon"
                  dangerouslySetInnerHTML={{ __html: meta.svg }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
