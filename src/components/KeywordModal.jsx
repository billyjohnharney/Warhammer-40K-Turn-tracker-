import { Dialog } from '@base-ui/react/dialog';
import { useGame } from '../context/GameContext.jsx';
import { keywords } from '../data/keywords.js';

export default function KeywordModal() {
  const { state, dispatch } = useGame();
  const kw = state.modals.keyword;
  const rules = kw ? keywords[kw] : null;

  return (
    <Dialog.Root open={!!kw} onOpenChange={open => { if (!open) dispatch({ type: 'CLOSE_MODAL', modal: 'keyword' }); }}>
      <Dialog.Portal>
        <Dialog.Backdrop className="modal-backdrop" />
        <Dialog.Popup className="modal-popup">
          <div className="strat-modal-card">
            <div className="strat-modal-header">
              <Dialog.Title className="strat-modal-name">{kw}</Dialog.Title>
              <Dialog.Close className="strat-modal-close">✕</Dialog.Close>
            </div>
            <div className="strat-modal-body">
              {rules?.map((r, i) => (
                <div key={i} className="rule-line">{r}</div>
              ))}
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
