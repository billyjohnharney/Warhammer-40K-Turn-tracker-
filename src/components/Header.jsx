import { useGame } from '../context/GameContext.jsx';

export default function Header({ onChangeFactions }) {
  const { state } = useGame();
  const { playerFaction, enemyFaction } = state.gameConfig;

  if (state.appStep !== 'game') return null;

  return (
    <header>
      <div className="header-inner">
        <div className="title-block">
          <h1>{playerFaction}</h1>
          <p className="faction-badge" onClick={onChangeFactions}>
            <span className="your-side">{playerFaction}</span>
            <span className="vs-sep">vs</span>
            <span className="enemy-side">{enemyFaction}</span>
            {' '}
            <span style={{ marginLeft: 8, opacity: 0.5, cursor: 'pointer' }} title="Change factions">✎</span>
          </p>
        </div>
      </div>
    </header>
  );
}
