import { useState } from 'react';
import Header from './Header.jsx';
import { pregameSteps } from '../data/pregameSteps.js';
import { ChevronDownIcon } from './Icons.jsx';

export default function PreGameScreen({ onBeginBattle, onChangeFactions }) {
  const [expanded, setExpanded] = useState({});

  function toggle(i) {
    setExpanded(prev => ({ ...prev, [i]: !prev[i] }));
  }

  return (
    <>
      <Header onChangeFactions={onChangeFactions} />
      <main className="pregame-screen">
        <p className="pregame-intro">Complete these steps before the first turn begins.</p>
        {pregameSteps.map((step, i) => {
          const isOpen = !!expanded[i];
          return (
            <div key={i} className={`pregame-card ${isOpen ? 'is-open' : ''}`}>
              <button className="pregame-card-header" onClick={() => toggle(i)} aria-expanded={isOpen}>
                <span className="pregame-card-title">{step.title}</span>
                <ChevronDownIcon className="pregame-card-chevron" />
              </button>
              <p className="pregame-card-summary">{step.summary}</p>
              <div className="pregame-card-body">
                <p className="pregame-card-desc">{step.description}</p>
              </div>
            </div>
          );
        })}
      </main>
      <div className="setup-start-bar">
        <button className="faction-start-btn" onClick={onBeginBattle}>
          Begin Battle
        </button>
      </div>
    </>
  );
}
