import { Dialog } from '@base-ui/react/dialog';
import { useGame } from '../context/GameContext.jsx';

export default function StratagemModal({ wahapediaHook }) {
  const { state, dispatch } = useGame();
  const stratId = state.modals.stratagem;
  const s = stratId
    ? wahapediaHook.wahapedia.stratagemRows.find(x => x.id === stratId)
    : null;

  return (
    <Dialog.Root
      open={!!stratId}
      onOpenChange={open => { if (!open) dispatch({ type: 'CLOSE_MODAL', modal: 'stratagem' }); }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="modal-backdrop" />
        <Dialog.Popup className="modal-popup">
          <div className="strat-modal-card">
            <div className="strat-modal-header">
              <div>
                <Dialog.Title className="strat-modal-name">{s?.name || ''}</Dialog.Title>
                {s?.cp_cost && <div className="strat-modal-cp">{s.cp_cost} CP</div>}
              </div>
              <Dialog.Close className="strat-modal-close">✕</Dialog.Close>
            </div>
            <div
              className="strat-modal-body"
              dangerouslySetInnerHTML={{ __html: s?.description || s?.legend || '' }}
            />
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
