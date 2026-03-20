import { useGame } from '../context/GameContext.jsx';
import Header from './Header.jsx';
import { pregameSteps } from '../data/pregameSteps.js';

export default function PreGameScreen({ onBeginBattle, onChangeFactions }) {
  return (
    <>
      <Header onChangeFactions={onChangeFactions} />
      <main className="pregame-screen">
        <p className="pregame-intro">Complete these steps before the first turn begins.</p>
        {pregameSteps.map((step, i) => (
          <div key={i} className="pregame-card">
            <p className="pregame-card-title">{step.title}</p>
            <p className="pregame-card-desc">{step.description}</p>
          </div>
        ))}
      </main>
      <div className="setup-start-bar">
        <button className="faction-start-btn" onClick={onBeginBattle}>
          Begin Battle
        </button>
      </div>
    </>
  );
}
