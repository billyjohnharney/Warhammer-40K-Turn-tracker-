import { useState } from 'react';
import { useGame } from '../context/GameContext.jsx';
import { stratagemKeywords } from '../data/keywords.js';
import { isKeywordVisible, kwForPlayer, kwForEnemy } from './PhaseView.jsx';
import { ChevronDownIcon } from './Icons.jsx';

function fmtAction(text) {
  // text may contain HTML like <b>...</b>, handle separator outside tags
  const plainText = text.replace(/<[^>]+>/g, '');
  const i = plainText.search(/\s*[→—]\s*/);
  if (i === -1) return text;
  // Find separator in original text respecting HTML
  const sep = text.search(/\s*[→—]\s*/);
  const primary = text.slice(0, sep);
  const support = text.slice(sep).replace(/^\s*[→—]\s*/, '');
  return { primary, support };
}

function kwSideClass(kw, gameConfig, roster, enemyRoster, item = null) {
  // Use item-level context first — playerOnly/enemyOnly flags are the authoritative source
  if (item?.playerOnly) return ' keyword-tag--player';
  if (item?.enemyOnly) return ' keyword-tag--enemy';
  // Fall back to roster-based differentiation when both rosters are loaded
  const isPlayer = kwForPlayer(kw, gameConfig, roster);
  const isEnemy = kwForEnemy(kw, gameConfig, enemyRoster);
  if (isPlayer && !isEnemy) return ' keyword-tag--player';
  if (isEnemy && !isPlayer) return ' keyword-tag--enemy';
  return '';
}

function KeywordTags({ item }) {
  const { state, dispatch } = useGame();
  const kws = (item.keywords || []).filter(kw =>
    isKeywordVisible(kw, state.gameConfig, state.roster, state.enemyRoster) &&
    !stratagemKeywords.has(kw)
  );
  if (!kws.length) return null;
  return (
    <div className="keyword-tags">
      {kws.map(kw => (
        <span
          key={kw}
          className={`keyword-tag${kwSideClass(kw, state.gameConfig, state.roster, state.enemyRoster, item)}`}
          onClick={e => {
            e.stopPropagation();
            dispatch({ type: 'OPEN_MODAL', modal: 'keyword', data: kw });
          }}
        >
          {kw}
        </span>
      ))}
    </div>
  );
}

function CommandAbilityNotes({ getCommandPhaseAbilities }) {
  const abilities = getCommandPhaseAbilities();
  return abilities.map(({ side, name, text }, i) => (
    <div key={i} className="note-child cmd-ability-note">
      <div className="cmd-ability-side">{side}</div>
      <div className="cmd-ability-name">{name}</div>
      <div className="cmd-ability-text">{text}</div>
    </div>
  ));
}

function StepItem({ item, notes, phase, stepNum, getCommandPhaseAbilities }) {
  const [expanded, setExpanded] = useState(false);
  const { state, dispatch } = useGame();
  const fmt = fmtAction(item.text);
  const title = typeof fmt === 'string' ? fmt : fmt.primary;
  const support = typeof fmt === 'string' ? null : fmt.support;

  const hasNotes = notes.length > 0;

  // Collect keywords from all notes for collapsed summary, excluding any already shown on the action.
  // Track unique (keyword, side) pairs so a keyword appearing in both a playerOnly and enemyOnly note
  // is shown twice — once green, once red — rather than collapsed to neutral.
  const actionKws = new Set(item.keywords || []);
  const allNoteKeywords = !expanded && hasNotes
    ? (() => {
        const seen = new Set(); // dedupe by `${kw}::${side}`
        const result = [];
        notes.forEach(({ item: n }) => {
          const side = n.playerOnly ? 'player' : n.enemyOnly ? 'enemy' : null;
          (n.keywords || [])
            .filter(kw =>
              !actionKws.has(kw) &&
              isKeywordVisible(kw, state.gameConfig, state.roster, state.enemyRoster) &&
              !stratagemKeywords.has(kw)
            )
            .forEach(kw => {
              const key = `${kw}::${side}`;
              if (!seen.has(key)) {
                seen.add(key);
                result.push({ kw, side });
              }
            });
        });
        return result;
      })()
    : [];

  return (
    <div className={`step-item${expanded ? ' step-item--expanded' : ''}`}>
      <div className="step-item-header" onClick={() => hasNotes && setExpanded(e => !e)}
        style={hasNotes ? undefined : { cursor: 'default' }}>
        <div className="step-item-header-row">
          <div className="item-text">
            <span className="step-number">{stepNum}.</span>{' '}
            <span dangerouslySetInnerHTML={{ __html: title }} />
          </div>
          {hasNotes && (
            <span className={`step-chevron${expanded ? ' step-chevron--open' : ''}`}>
              <ChevronDownIcon />
            </span>
          )}
        </div>
        {support && <span className="step-support">{support}</span>}
        <KeywordTags item={item} />
        {allNoteKeywords.length > 0 && (
          <div className="step-keywords-inline">
            {allNoteKeywords.map(({ kw, side }) => {
              const cls = side === 'player' ? ' keyword-tag--player'
                : side === 'enemy' ? ' keyword-tag--enemy'
                : kwSideClass(kw, state.gameConfig, state.roster, state.enemyRoster);
              return (
                <span key={`${kw}::${side}`} className={`keyword-tag${cls}`} onClick={e => {
                  e.stopPropagation();
                  dispatch({ type: 'OPEN_MODAL', modal: 'keyword', data: kw });
                }}>{kw}</span>
              );
            })}
          </div>
        )}
      </div>
      {expanded && notes.length > 0 && (
        <div className="step-item-body">
          {notes.map(({ item: noteItem, j }) => {
            if (noteItem.type === 'command-abilities') {
              return <CommandAbilityNotes key={j} getCommandPhaseAbilities={getCommandPhaseAbilities} />;
            }
            return (
              <div key={j} className="note-child">
                <div className="item-content">
                  <div className="note-text">{noteItem.text}</div>
                  <KeywordTags item={noteItem} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function deduplicateNotes(notes) {
  const seen = new Map(); // text → index in result
  const result = [];
  for (const entry of notes) {
    const { item } = entry;
    if (item.type !== 'note' || !item.text) { result.push(entry); continue; }
    const existing = seen.get(item.text);
    if (existing == null) {
      // Clone item so we can mutate keywords without affecting source data
      result.push({ ...entry, item: { ...item, keywords: item.keywords ? [...item.keywords] : [] } });
      seen.set(item.text, result.length - 1);
    } else {
      // Merge any new keywords from the duplicate into the retained note
      const retained = result[existing];
      const retainedKws = retained.item.keywords || [];
      for (const kw of (item.keywords || [])) {
        if (!retainedKws.includes(kw)) retainedKws.push(kw);
      }
    }
  }
  return result;
}

export default function StepsTab({ phase, visibleItems, getCommandPhaseAbilities }) {
  // Group: action → following notes
  const groups = [];
  let currentGroup = null;

  for (const { item, j } of visibleItems) {
    if (item.type === 'action') {
      currentGroup = { action: { item, j }, notes: [] };
      groups.push(currentGroup);
    } else {
      if (!currentGroup) { currentGroup = { action: null, notes: [] }; groups.push(currentGroup); }
      currentGroup.notes.push({ item, j });
    }
  }

  for (const group of groups) {
    group.notes = deduplicateNotes(group.notes);
  }

  let actionCount = 0;
  return (
    <>
      {groups.map((group, gi) => {
        const stepNum = group.action ? ++actionCount : null;
        return (
          <div key={gi}>
            {group.action && (
              <StepItem
                item={group.action.item}
                j={group.action.j}
                notes={group.notes}
                phase={phase}
                stepNum={stepNum}
                getCommandPhaseAbilities={getCommandPhaseAbilities}
              />
            )}
            {!group.action && group.notes.map(({ item, j }) => {
              if (item.type === 'command-abilities') {
                return <CommandAbilityNotes key={j} getCommandPhaseAbilities={getCommandPhaseAbilities} />;
              }
              return (
                <div key={j} className="note-child">
                  <div className="item-content">
                    <div className="note-text">{item.text}</div>
                    <KeywordTags item={item} />
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
}
