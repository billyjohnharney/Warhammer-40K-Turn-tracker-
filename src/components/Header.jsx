import { useGame } from '../context/GameContext.jsx';

export default function Header({ onChangeFactions }) {
  const { state } = useGame();
  const { playerFaction, enemyFaction } = state.gameConfig;

  if (state.appStep !== 'game' && state.appStep !== 'pregame') return null;

  return (
    <header>
      <div className="header-inner">
        <div className="title-block">
          <h1>{playerFaction}</h1>
          <p className="faction-badge">
            <span className="your-side">{playerFaction}</span>
            <span className="vs-sep">vs</span>
            <span className="enemy-side">{enemyFaction}</span>
          </p>
        </div>
        <button className="header-edit-btn" onClick={onChangeFactions}>Edit</button>
      </div>
    </header>
  );
}
