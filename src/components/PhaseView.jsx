import { Tabs } from '@base-ui/react/tabs';
import { useGame } from '../context/GameContext.jsx';
import { phases } from '../data/phases.js';
import { keywords, stratagemKeywords, coreAlwaysVisible } from '../data/keywords.js';
import { keywordFactions } from '../data/factions.js';
import { wahapediaPhaseId } from '../hooks/useWahapedia.js';
import StepsTab from './StepsTab.jsx';
import StratagemTab from './StratagemTab.jsx';

export function kwForPlayer(kw, gameConfig, roster) {
  if (coreAlwaysVisible.has(kw)) return true;
  const fl = keywordFactions[kw];
  if (fl && !fl.includes(gameConfig.playerFaction)) return false;
  if (roster.loaded) return roster.activeKeywords.has(kw);
  return true;
}

export function kwForEnemy(kw, gameConfig, enemyRoster) {
  if (coreAlwaysVisible.has(kw)) return true;
  const fl = keywordFactions[kw];
  if (fl && !fl.includes(gameConfig.enemyFaction)) return false;
  if (enemyRoster.loaded) return enemyRoster.activeKeywords.has(kw);
  return true;
}

export function isKeywordVisible(kw, gameConfig, roster, enemyRoster) {
  return kwForPlayer(kw, gameConfig, roster) || kwForEnemy(kw, gameConfig, enemyRoster);
}

export function shouldShowItem(item, gameConfig, roster, enemyRoster, commandPhaseAbilitiesFn) {
  if (item.type === 'command-abilities') return commandPhaseAbilitiesFn().length > 0;
  const kws = item.keywords || [];
  if (!kws.length) return true;
  if (item.playerOnly) return kws.some(kw => kwForPlayer(kw, gameConfig, roster));
  if (item.enemyOnly) return kws.some(kw => kwForEnemy(kw, gameConfig, enemyRoster));
  return true;
}

export default function PhaseView({ wahapediaHook }) {
  const { state, dispatch, getCommandPhaseAbilities } = useGame();
  const { activePhaseIndex, gameConfig, roster, enemyRoster, phaseTab } = state;
  const phase = phases[activePhaseIndex];
  const tab = phaseTab[phase.id] || 'steps';

  const visibleItems = phase.items
    .map((item, j) => ({ item, j }))
    .filter(({ item }) => shouldShowItem(item, gameConfig, roster, enemyRoster, getCommandPhaseAbilities));

  const stepItems = visibleItems.filter(({ item }) => item.type !== 'stratagem');

  let fsCount = 0;
  if (wahapediaHook.wahapedia.loaded) {
    const { factionStrats } = wahapediaHook;
    const filterFn = s => {
      const p = wahapediaPhaseId(s.phase);
      return p === phase.id || (phase.id === 'command' && p === 'any');
    };
    fsCount = [...factionStrats.universal, ...factionStrats.player].filter(filterFn).length;
  }

  function handleTabChange(value) {
    dispatch({ type: 'SET_PHASE_TAB', phaseId: phase.id, tab: value });
  }

  return (
    <div className="phase-view" id={`phase-${phase.id}`}>
      <div className="phase-view-header">
        <div className="phase-header-left">
          <span className="phase-title">{phase.title}</span>
        </div>
      </div>

      <Tabs.Root value={tab} onValueChange={handleTabChange}>
        <Tabs.List className="phase-tabs">
          <Tabs.Tab value="steps" className="phase-tab">
            Steps
          </Tabs.Tab>
          <Tabs.Tab value="stratagems" className="phase-tab">
            Stratagems
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="steps" className="tab-content">
          <StepsTab
            phase={phase}
            visibleItems={stepItems}
            getCommandPhaseAbilities={getCommandPhaseAbilities}
          />
        </Tabs.Panel>
        <Tabs.Panel value="stratagems" className="tab-content">
          <StratagemTab phaseId={phase.id} wahapediaHook={wahapediaHook} />
        </Tabs.Panel>
      </Tabs.Root>

      <div className="phase-nav-row">
        {activePhaseIndex > 0 ? (
          <button
            className="phase-nav-arrow"
            onClick={() => {
              dispatch({ type: 'SET_ACTIVE_PHASE', payload: activePhaseIndex - 1 });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            ← {phases[activePhaseIndex - 1].title}
          </button>
        ) : (
          <button
            className="phase-nav-arrow"
            onClick={() => dispatch({ type: 'CHANGE_FACTIONS' })}
          >
            ← Battle setup
          </button>
        )}

        {activePhaseIndex < phases.length - 1 ? (
          <button
            className="phase-nav-arrow"
            onClick={() => {
              dispatch({ type: 'SET_ACTIVE_PHASE', payload: activePhaseIndex + 1 });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            {phases[activePhaseIndex + 1].title} →
          </button>
        ) : <span />}
      </div>
    </div>
  );
}
