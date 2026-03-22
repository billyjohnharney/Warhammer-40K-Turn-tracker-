import { Dialog } from '@base-ui/react/dialog';
import { CloseIcon } from './Icons.jsx';
import { MISSIONS } from '../data/missions.js';

export default function MissionModal({ missionId, onClose }) {
  const mission = missionId ? MISSIONS.find(m => m.id === missionId) : null;

  return (
    <Dialog.Root
      open={!!mission}
      onOpenChange={open => { if (!open) onClose(); }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="modal-backdrop" />
        <Dialog.Popup className="modal-popup">
          {mission && (
            <div className="strat-modal-card">
              <div className="strat-modal-header">
                <div>
                  <span className="mission-modal-category">{mission.category}</span>
                  <Dialog.Title className="strat-modal-name">{mission.title}</Dialog.Title>
                </div>
                <Dialog.Close className="strat-modal-close" aria-label="Close">
                  <CloseIcon />
                </Dialog.Close>
              </div>
              <div className="strat-modal-body">
                <p className="mission-modal-details">{mission.details}</p>
              </div>
            </div>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
