import { Dialog } from '@base-ui/react/dialog';
import { useGame } from '../context/GameContext.jsx';
import { phases } from '../data/phases.js';
import { CloseIcon } from './Icons.jsx';
import { keywords, stratagemKeywords } from '../data/keywords.js';
import { keywordFactions } from '../data/factions.js';

function isKeywordVisible(kw, gameConfig, roster, enemyRoster, coreAlwaysVisible) {
  return kwForPlayer(kw, gameConfig, roster, coreAlwaysVisible) ||
         kwForEnemy(kw, gameConfig, enemyRoster, coreAlwaysVisible);
}

function kwForPlayer(kw, gameConfig, roster, coreAlwaysVisible) {
  if (coreAlwaysVisible.has(kw)) return true;
  const fl = keywordFactions[kw];
  if (fl && !fl.includes(gameConfig.playerFaction)) return false;
  if (roster.loaded) return roster.activeKeywords.has(kw);
  return true;
}

function kwForEnemy(kw, gameConfig, enemyRoster, coreAlwaysVisible) {
  if (coreAlwaysVisible.has(kw)) return true;
  const fl = keywordFactions[kw];
  if (fl && !fl.includes(gameConfig.enemyFaction)) return false;
  if (enemyRoster.loaded) return enemyRoster.activeKeywords.has(kw);
  return true;
}

export default function StepModal({ coreAlwaysVisible }) {
  const { state, dispatch } = useGame();
  const modal = state.modals.step;

  if (!modal) {
    return (
      <Dialog.Root open={false}>
        <Dialog.Portal>
          <Dialog.Popup className="modal-popup">
            <div className="strat-modal-card" />
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  const { phaseId, itemIndex } = modal;
  const phase = phases.find(p => p.id === phaseId);
  const item = phase?.items[itemIndex];

  if (!phase || !item) return null;

  const text = item.text.replace(/<[^>]+>/g, '');
  const sep = text.search(/\s*[→—]\s*/);
  const title = sep === -1 ? text : text.slice(0, sep);
  const support = sep === -1 ? '' : text.slice(sep).replace(/^\s*[→—]\s*/, '');

  const notes = [];
  for (let k = itemIndex + 1; k < phase.items.length; k++) {
    const next = phase.items[k];
    if (next.type === 'action') break;
    if (next.type === 'note') notes.push(next);
  }

  function KwTags({ item: it }) {
    const kws = (it.keywords || []).filter(kw =>
      isKeywordVisible(kw, state.gameConfig, state.roster, state.enemyRoster, coreAlwaysVisible) &&
      !stratagemKeywords.has(kw)
    );
    if (!kws.length) return null;
    return (
      <div className="keyword-tags" style={{ marginTop: 8 }}>
        {kws.map(kw => (
          <span
            key={kw}
            className="keyword-tag"
            onClick={e => {
              e.stopPropagation();
              dispatch({ type: 'CLOSE_MODAL', modal: 'step' });
              dispatch({ type: 'OPEN_MODAL', modal: 'keyword', data: kw });
            }}
          >
            {kw}
          </span>
        ))}
      </div>
    );
  }

  return (
    <Dialog.Root
      open={true}
      onOpenChange={open => { if (!open) dispatch({ type: 'CLOSE_MODAL', modal: 'step' }); }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="modal-backdrop" />
        <Dialog.Popup className="modal-popup">
          <div className="strat-modal-card">
            <div className="strat-modal-header">
              <Dialog.Title className="strat-modal-name">{title}</Dialog.Title>
              <Dialog.Close className="strat-modal-close" aria-label="Close"><CloseIcon /></Dialog.Close>
            </div>
            <div className="strat-modal-body">
              {support && <p style={{ margin: '0 0 4px' }}>{support}</p>}
              <KwTags item={item} />
              {notes.map((note, i) => (
                <div key={i}>
                  <p className="step-modal-note">{note.text}</p>
                  <KwTags item={note} />
                </div>
              ))}
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
