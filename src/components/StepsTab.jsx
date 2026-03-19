import { useGame } from '../context/GameContext.jsx';
import { stratagemKeywords } from '../data/keywords.js';
import { isKeywordVisible } from './PhaseView.jsx';

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
          className="keyword-tag"
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

function StepItem({ item, j, phase, stepNum }) {
  const { dispatch } = useGame();
  const fmt = fmtAction(item.text);

  return (
    <div
      className="step-item"
      onClick={() => dispatch({ type: 'OPEN_MODAL', modal: 'step', data: { phaseId: phase.id, itemIndex: j } })}
    >
      <div className="item-content">
        <div className="item-text">
          <span className="step-number">{stepNum}.</span>{' '}
          {typeof fmt === 'string' ? (
            <span dangerouslySetInnerHTML={{ __html: fmt }} />
          ) : (
            <>
              <span dangerouslySetInnerHTML={{ __html: fmt.primary }} />
              <span className="step-support">{fmt.support}</span>
            </>
          )}
        </div>
        <KeywordTags item={item} />
      </div>
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

  let actionCount = 0;
  return (
    <>
      {groups.map((group, gi) => {
        const stepNum = group.action ? ++actionCount : null;
        return (
        <div key={gi}>
          {group.action && (
            <StepItem item={group.action.item} j={group.action.j} phase={phase} stepNum={stepNum} />
          )}
          {group.notes.map(({ item, j }) => {
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
