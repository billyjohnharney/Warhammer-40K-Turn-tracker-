import { Dialog } from '@base-ui/react/dialog';
import { CloseIcon } from './Icons.jsx';
import { MISSIONS } from '../data/missions.js';

// ─── Parser ───────────────────────────────────────────────────────────────────
// Converts the plain-text `details` string into typed blocks for structured
// rendering. Handles: setup text, action blocks, and scoring sections.

const SECTION_RE = /^(SECOND BATTLE ROUND ONWARDS|ANY BATTLE ROUND|END OF THE BATTLE|ANY TIME)(\s+\(([A-Z/]+)\))?$/i;
const ACTION_RE  = /^([A-Z][A-Z\s]+)\(ACTION\)$/;
const VP_ROW_RE  = /^•\s*(.+?)\s*→\s*(\d+\s*VP(?:\s+\([^)]*\))?)/;

function parseMissionDetails(details) {
  const lines = details.split('\n');
  const blocks = [];
  let current = null;

  function flush() {
    if (current) { blocks.push(current); current = null; }
  }

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();

    if (!line) continue;

    // ── Action block header ──────────────────────────────────────────────────
    const actionMatch = line.match(ACTION_RE);
    if (actionMatch) {
      flush();
      current = { type: 'action', name: actionMatch[1].trim(), fields: [] };
      continue;
    }

    // ── Scoring section header ───────────────────────────────────────────────
    const sectionMatch = line.match(SECTION_RE);
    if (sectionMatch) {
      flush();
      current = {
        type: 'section',
        round: sectionMatch[1].trim().toUpperCase(),
        side: sectionMatch[3] ? sectionMatch[3].toUpperCase() : null,
        when: null,
        preamble: [],
        rows: [],
      };
      continue;
    }

    // ── Inside an action block ───────────────────────────────────────────────
    if (current?.type === 'action') {
      const colon = line.indexOf(':');
      if (colon > 0) {
        current.fields.push({ key: line.slice(0, colon).trim(), value: line.slice(colon + 1).trim() });
      }
      continue;
    }

    // ── Inside a scoring section ─────────────────────────────────────────────
    if (current?.type === 'section') {
      if (line.startsWith('WHEN:')) {
        current.when = line.slice(5).trim();
      } else if (line.startsWith('•')) {
        const m = line.match(VP_ROW_RE);
        current.rows.push(m
          ? { text: m[1].trim(), vp: m[2].trim() }
          : { text: line.slice(1).trim(), vp: null });
      } else if (line !== 'AND' && line !== 'OR') {
        current.preamble.push(line);
      }
      continue;
    }

    // ── Setup / intro text ───────────────────────────────────────────────────
    if (!current || current.type !== 'setup') {
      flush();
      current = { type: 'setup', lines: [] };
    }
    current.lines.push(line);
  }

  flush();
  return blocks;
}

// ─── Block renderers ──────────────────────────────────────────────────────────

function SetupBlock({ block }) {
  return (
    <p className="mission-block-setup">{block.lines.join(' ')}</p>
  );
}

function ActionBlock({ block }) {
  return (
    <div className="mission-block-action">
      <div className="mission-block-header">
        <span>{block.name}</span>
        <span className="mission-block-badge">ACTION</span>
      </div>
      {block.fields.map((f, i) => (
        <div key={i} className="mission-action-field">
          <span className="mission-action-key">{f.key}</span>
          <span className="mission-action-value">{f.value}</span>
        </div>
      ))}
    </div>
  );
}

function SectionBlock({ block }) {
  return (
    <div className="mission-block-section">
      <div className="mission-block-header">
        <span>{block.round}</span>
        {block.side && <span className="mission-block-badge">{block.side}</span>}
      </div>
      {block.when && (
        <div className="mission-section-when">
          <span className="mission-section-when-label">WHEN</span>
          <span>{block.when}</span>
        </div>
      )}
      {block.preamble.length > 0 && (
        <p className="mission-section-preamble">{block.preamble.join(' ')}</p>
      )}
      {block.rows.length > 0 && (
        <div className="mission-scoring-rows">
          {block.rows.map((row, i) => (
            <div key={i} className="mission-scoring-row">
              <span className="mission-scoring-condition">{row.text}</span>
              {row.vp && <span className="mission-scoring-vp">{row.vp}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function MissionModal({ missionId, onClose }) {
  const mission = missionId ? MISSIONS.find(m => m.id === missionId) : null;
  const blocks = mission ? parseMissionDetails(mission.details) : [];

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
              <div className="strat-modal-body mission-blocks">
                {blocks.map((block, i) => {
                  if (block.type === 'setup')   return <SetupBlock   key={i} block={block} />;
                  if (block.type === 'action')  return <ActionBlock  key={i} block={block} />;
                  if (block.type === 'section') return <SectionBlock key={i} block={block} />;
                  return null;
                })}
              </div>
            </div>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
