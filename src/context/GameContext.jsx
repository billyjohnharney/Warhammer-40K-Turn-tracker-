import { createContext, useContext, useReducer, useCallback } from 'react';
import { phases } from '../data/phases.js';
import { commandPhaseAbilities } from '../data/commandPhaseAbilities.js';
import { smSuccessors } from '../data/factions.js';

const initialState = {
  appStep: 'splash',
  gameConfig: { playerFaction: '', enemyFaction: '', playerDetachment: '', enemyDetachment: '', battleSize: '', mission: '' },
  activePhaseIndex: 0,
  phaseTab: {},
  roster: { loaded: false, units: [], activeKeywords: new Set() },
  enemyRoster: { loaded: false, units: [], activeKeywords: new Set() },
  rsState: {
    player: { parsed: null, error: '' },
    enemy: { parsed: null, error: '' },
  },
  modals: { step: null, stratagem: null, keyword: null },
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_APP_STEP':
      return { ...state, appStep: action.payload };

    case 'SET_GAME_CONFIG':
      return { ...state, gameConfig: { ...state.gameConfig, ...action.payload } };

    case 'SET_ACTIVE_PHASE':
      return { ...state, activePhaseIndex: action.payload };

    case 'SET_PHASE_TAB':
      return { ...state, phaseTab: { ...state.phaseTab, [action.phaseId]: action.tab } };

    case 'SET_RS_STATE': {
      const { side, data } = action;
      return { ...state, rsState: { ...state.rsState, [side]: { ...state.rsState[side], ...data } } };
    }

    case 'CLEAR_RS_STATE': {
      const { side } = action;
      return { ...state, rsState: { ...state.rsState, [side]: { parsed: null, error: '' } } };
    }

    case 'BEGIN_BATTLE':
      return { ...state, appStep: 'game' };

    case 'LAUNCH_GAME': {
      const { playerParsed, enemyParsed } = action;
      return {
        ...state,
        appStep: 'pregame',
        activePhaseIndex: 0,
        phaseTab: {},
        roster: playerParsed
          ? { loaded: true, units: playerParsed.units, activeKeywords: playerParsed.activeKeywords }
          : { loaded: false, units: [], activeKeywords: new Set() },
        enemyRoster: enemyParsed
          ? { loaded: true, units: enemyParsed.units, activeKeywords: enemyParsed.activeKeywords }
          : { loaded: false, units: [], activeKeywords: new Set() },
      };
    }

    case 'CHANGE_FACTIONS':
      return {
        ...state,
        appStep: 'setup',
        roster: { loaded: false, units: [], activeKeywords: new Set() },
        enemyRoster: { loaded: false, units: [], activeKeywords: new Set() },
        rsState: {
          player: { parsed: null, error: '' },
          enemy: { parsed: null, error: '' },
        },
        gameConfig: { ...state.gameConfig, playerDetachment: '', enemyDetachment: '' },
      };

    case 'OPEN_MODAL':
      return { ...state, modals: { ...state.modals, [action.modal]: action.data } };

    case 'CLOSE_MODAL':
      return { ...state, modals: { ...state.modals, [action.modal]: null } };

    default:
      return state;
  }
}

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getCommandPhaseAbilities = useCallback(() => {
    const { playerFaction, enemyFaction, playerDetachment, enemyDetachment } = state.gameConfig;
    const results = [];
    for (const [side, faction, det] of [
      ['Your army', playerFaction, playerDetachment],
    ]) {
      if (!faction) continue;
      const factionData = commandPhaseAbilities[faction];
      const parentData = smSuccessors.has(faction) ? commandPhaseAbilities['Space Marines'] : null;
      if (!factionData && !parentData) continue;

      const ownDetAbilities = factionData && det && factionData[det] ? factionData[det] : null;
      const parentDetAbilities = parentData && det && parentData[det] ? parentData[det] : null;
      const fallbackAbilities = factionData
        ? Object.entries(factionData).filter(([k]) => k !== '*').flatMap(([, v]) => v)
        : [];

      const abilities = [
        ...((factionData && factionData['*']) || []),
        ...(ownDetAbilities || parentDetAbilities || fallbackAbilities),
      ];
      for (const ab of abilities) results.push({ side, ...ab });
    }
    return results;
  }, [state.gameConfig]);

  return (
    <GameContext.Provider value={{ state, dispatch, getCommandPhaseAbilities }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
