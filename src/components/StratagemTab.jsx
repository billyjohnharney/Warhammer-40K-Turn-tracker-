import { useGame } from '../context/GameContext.jsx';
import { wahapediaPhaseId } from '../hooks/useWahapedia.js';

function stratagemTurn(s) {
  const t = (s.turn || '').toLowerCase();
  if (t.includes('opponent')) return 'defence';
  if (t === 'your turn') return 'attack';
  return 'either';
}

function StratagemItem({ s }) {
  const { dispatch } = useGame();
  const name = s.name || 'Unknown';
  const cp = s.cp_cost ? `${s.cp_cost}CP` : '';
  const desc = s.description || '';
  const effIdx = desc.indexOf('<b>EFFECT:</b>');
  let brief = '';
  if (effIdx !== -1) {
    const raw = desc.slice(effIdx + '<b>EFFECT:</b>'.length).replace(/<[^>]+>/g, '').trim();
    brief = raw.length > 110 ? raw.slice(0, 107) + '…' : raw;
  } else {
    brief = s.legend || '';
  }

  return (
    <div
      className="stratagem-item"
      onClick={() => dispatch({ type: 'OPEN_MODAL', modal: 'stratagem', data: s.id })}
    >
      <div className="item-content">
        <div>
          <span className="strat-name">{name}</span>
          {cp && <span className="strat-cp">{cp}</span>}
        </div>
        {brief && <div className="strat-legend">{brief}</div>}
      </div>
    </div>
  );
}

function SubSection({ label, items, cls }) {
  if (!items.length) return null;
  return (
    <>
      <div className={`fs-subsection-label ${cls}`}>{label}</div>
      {items.map((s, i) => <StratagemItem key={s.id || i} s={s} />)}
    </>
  );
}

export default function StratagemTab({ phaseId, wahapediaHook }) {
  const { wahapedia, factionStrats } = wahapediaHook;

  if (wahapedia.loading) {
    return <div className="fs-section"><div className="fs-status">Loading faction stratagems…</div></div>;
  }
  if (wahapedia.error) {
    return <div className="fs-section"><div className="fs-status">{wahapedia.error}</div></div>;
  }
  if (!wahapedia.loaded) return null;

  const filterFn = s => {
    const p = wahapediaPhaseId(s.phase);
    return p === phaseId || (phaseId === 'command' && p === 'any');
  };

  const allItems = [
    ...factionStrats.universal.filter(filterFn),
    ...factionStrats.player.filter(filterFn),
  ];

  if (!allItems.length) {
    return <div className="fs-section"><div className="fs-status">No stratagems for this phase.</div></div>;
  }

  const attackItems  = allItems.filter(s => stratagemTurn(s) === 'attack');
  const defenceItems = allItems.filter(s => stratagemTurn(s) === 'defence');
  const eitherItems  = allItems.filter(s => stratagemTurn(s) === 'either');

  return (
    <div className="fs-section">
      <SubSection label="Attack" items={attackItems} cls="fs-attack" />
      <SubSection label="Defence" items={defenceItems} cls="fs-defence" />
      <SubSection label="Either" items={eitherItems} cls="fs-either" />
      <div className="fs-attribution">
        Stratagem data: <a href="https://wahapedia.ru" target="_blank" rel="noopener">Wahapedia</a>
      </div>
    </div>
  );
}
