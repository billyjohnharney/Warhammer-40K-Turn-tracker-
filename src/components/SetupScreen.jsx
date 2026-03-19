import { useRef } from 'react';
import { Select } from '@base-ui/react/select';
import { Field } from '@base-ui/react/field';
import { useGame } from '../context/GameContext.jsx';
import { factions } from '../data/factions.js';
import { parseRosXml, parseTextRoster, looksLikeWarhammer } from '../hooks/useRoster.js';
import { ChevronDownIcon, CheckIcon, CloseIcon } from './Icons.jsx';

function FactionSelect({ id, label, value, onChange, placeholder }) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Label className="field-label">{label}</Select.Label>
      <Select.Trigger className="select-trigger" id={id}>
        <Select.Value placeholder={placeholder} />
        <Select.Icon className="select-icon"><ChevronDownIcon /></Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner className="select-positioner" sideOffset={4}>
          <Select.Popup className="select-popup">
            {factions.map(f => (
              <Select.Item key={f} value={f} className="select-item">
                <Select.ItemIndicator className="select-item-indicator"><CheckIcon /></Select.ItemIndicator>
                <Select.ItemText>{f}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}

function DetachmentSelect({ id, label, value, onChange, detachments, loading }) {
  if (detachments.length === 0 && !loading) return null;
  return (
    <Select.Root value={value} onValueChange={onChange} disabled={loading}>
      <Select.Label className="field-label">{label}</Select.Label>
      <Select.Trigger className="select-trigger" id={id}>
        <Select.Value placeholder={loading ? 'Loading…' : '— Choose detachment —'} />
        <Select.Icon className="select-icon"><ChevronDownIcon /></Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner className="select-positioner" sideOffset={4}>
          <Select.Popup className="select-popup">
            {detachments.map(d => (
              <Select.Item key={d} value={d} className="select-item">
                <Select.ItemIndicator className="select-item-indicator"><CheckIcon /></Select.ItemIndicator>
                <Select.ItemText>{d}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}

function SideComponent({ side, wahapediaHook }) {
  const { state, dispatch } = useGame();
  const isPlayer = side === 'player';
  const rsData = state.rsState[side];
  const faction = isPlayer ? state.gameConfig.playerFaction : state.gameConfig.enemyFaction;
  const selectedDet = isPlayer ? state.gameConfig.playerDetachment : state.gameConfig.enemyDetachment;
  const fileRef = useRef(null);

  const detachments = wahapediaHook.getAvailableDetachments(faction);
  const detLoading = faction && wahapediaHook.wahapedia.loading;

  function applyAutoDetect(parsed) {
    if (!parsed) return;
    const updates = {};
    if (parsed.faction) {
      updates[isPlayer ? 'playerFaction' : 'enemyFaction'] = parsed.faction;
    }
    if (parsed.detachment) {
      updates[isPlayer ? 'playerDetachment' : 'enemyDetachment'] = parsed.detachment;
    }
    if (Object.keys(updates).length) {
      dispatch({ type: 'SET_GAME_CONFIG', payload: updates });
    }
    if (parsed.faction) {
      wahapediaHook.prefetch({ ...state.gameConfig, ...updates });
    }
  }

  async function handleFile(file) {
    if (!file) return;
    dispatch({ type: 'SET_RS_STATE', side, data: { error: '' } });
    try {
      const ext = file.name.split('.').pop().toLowerCase();
      let parsed;
      if (ext === 'ros') {
        parsed = parseRosXml(await file.text());
      } else if (ext === 'rosz') {
        const JSZip = (await import('jszip')).default;
        const zip = await JSZip.loadAsync(await file.arrayBuffer());
        const rosFile = Object.values(zip.files).find(f => f.name.endsWith('.ros'));
        if (!rosFile) throw new Error('No .ros file found inside the .rosz archive.');
        parsed = parseRosXml(await rosFile.async('text'));
      } else {
        throw new Error('Upload a .ros or .rosz file exported from Battlescribe or New Recruit.');
      }
      dispatch({ type: 'SET_RS_STATE', side, data: { parsed, error: '' } });
      applyAutoDetect(parsed);
    } catch (e) {
      dispatch({ type: 'SET_RS_STATE', side, data: { parsed: null, error: e.message || 'Failed to read file.' } });
    }
  }

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) {
        dispatch({ type: 'SET_RS_STATE', side, data: { error: 'Clipboard is empty — copy your army list first.' } });
        return;
      }
      if (!looksLikeWarhammer(text)) {
        dispatch({ type: 'SET_RS_STATE', side, data: { error: 'Mutiny! No army here.' } });
        return;
      }
      const parsed = parseTextRoster(text);
      dispatch({ type: 'SET_RS_STATE', side, data: { parsed, error: '' } });
      applyAutoDetect(parsed);
    } catch (_) {
      dispatch({ type: 'SET_RS_STATE', side, data: { error: 'Clipboard access denied — check browser permissions.' } });
    }
  }

  function handleFactionChange(val) {
    const key = isPlayer ? 'playerFaction' : 'enemyFaction';
    const detKey = isPlayer ? 'playerDetachment' : 'enemyDetachment';
    dispatch({ type: 'SET_GAME_CONFIG', payload: { [key]: val, [detKey]: '' } });
    if (val) wahapediaHook.prefetch({ ...state.gameConfig, [key]: val, [detKey]: '' });
  }

  function handleDetachmentChange(val) {
    const key = isPlayer ? 'playerDetachment' : 'enemyDetachment';
    dispatch({ type: 'SET_GAME_CONFIG', payload: { [key]: val } });
    if (wahapediaHook.wahapedia.loaded) {
      wahapediaHook.buildFactionStrats(wahapediaHook.wahapedia, { ...state.gameConfig, [key]: val });
    }
  }

  const parsed = rsData.parsed;
  const kws = parsed ? [...parsed.activeKeywords].sort() : [];

  return (
    <div className={`side-component ${isPlayer ? 'player-side' : 'enemy-side'}`}>
      <div className="side-component-header">
        <span className="side-label">{isPlayer ? 'Your Army' : 'Enemy Army'}</span>
        {parsed && (
          <span className="side-loaded">
            ✓ {parsed.units.length} units · {parsed.activeKeywords.size} keywords
            &nbsp;
            <button className="side-clear" onClick={() => dispatch({ type: 'CLEAR_RS_STATE', side })} aria-label="Clear"><CloseIcon /></button>
          </span>
        )}
      </div>

      {!parsed && (
        <div className="roster-btn-row">
          <button className="roster-action-btn" onClick={handlePaste}>Paste List</button>
          <button className="roster-action-btn" onClick={() => fileRef.current?.click()}>Upload List</button>
          <input
            ref={fileRef}
            type="file"
            accept=".ros,.rosz"
            style={{ display: 'none' }}
            onChange={e => handleFile(e.target.files[0])}
          />
        </div>
      )}

      {rsData.error && <div className="roster-error">{rsData.error}</div>}

      <Field.Root className="field-root">
        <FactionSelect
          id={`sel-${side}`}
          label="Faction"
          value={faction}
          onChange={handleFactionChange}
          placeholder="— Choose faction —"
        />
      </Field.Root>

      {faction && (
        <Field.Root className="field-root">
          <DetachmentSelect
            id={`sel-det-${side}`}
            label="Detachment"
            value={selectedDet}
            onChange={handleDetachmentChange}
            detachments={detachments}
            loading={detLoading}
          />
        </Field.Root>
      )}

      {parsed && (
        <div className="roster-preview">
          <div className="roster-stats">
            <div className="roster-stat"><strong>{parsed.units.length}</strong>Units</div>
            <div className="roster-stat"><strong>{kws.length}</strong>Keywords</div>
          </div>
          <div className="roster-units-scroll">
            {parsed.units.map((u, i) => (
              <div key={i} className="roster-unit-item">· {u}</div>
            ))}
          </div>
          {kws.length > 0 && (
            <div className="roster-kw-list">
              {kws.map(k => <span key={k} className="roster-kw-chip">{k}</span>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SetupScreen({ wahapediaHook, onLaunch }) {
  const { state } = useGame();
  const { playerFaction, playerDetachment, enemyFaction, enemyDetachment } = state.gameConfig;
  const canStart = !!(playerFaction && playerDetachment && enemyFaction && enemyDetachment);

  return (
    <main>
      <div className="faction-screen">
        <img src={`${import.meta.env.BASE_URL}IMG_8702.png`} alt="" className="setup-logo" />
        <div className="faction-screen-intro">
          Streamline your battles with all rules, abilities and strategies for your army in one place
        </div>
        <SideComponent side="player" wahapediaHook={wahapediaHook} />
        <div className="setup-vs-sep">VS</div>
        <SideComponent side="enemy" wahapediaHook={wahapediaHook} />
        <button
          className="faction-start-btn"
          onClick={onLaunch}
          disabled={!canStart}
        >
          Start Game
        </button>
      </div>
    </main>
  );
}
