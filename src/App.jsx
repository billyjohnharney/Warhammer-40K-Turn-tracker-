import { useState, useCallback } from 'react';
import { GameProvider, useGame } from './context/GameContext.jsx';
import { useWahapedia } from './hooks/useWahapedia.js';
import SplashScreen from './components/SplashScreen.jsx';
import SetupScreen from './components/SetupScreen.jsx';
import PreGameScreen from './components/PreGameScreen.jsx';
import GameScreen from './components/GameScreen.jsx';

function AppInner() {
  const { state, dispatch } = useGame();
  const wahapediaHook = useWahapedia(state.gameConfig);

  const handleDismissSplash = useCallback(() => {
    dispatch({ type: 'SET_APP_STEP', payload: 'setup' });
  }, [dispatch]);

  const handleLaunchGame = useCallback(() => {
    const playerParsed = state.rsState.player.parsed;
    const enemyParsed = state.rsState.enemy.parsed;
    dispatch({ type: 'LAUNCH_GAME', playerParsed, enemyParsed });
    wahapediaHook.load(state.gameConfig);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dispatch, state.rsState, state.gameConfig, wahapediaHook]);

  const handleBeginBattle = useCallback(() => {
    dispatch({ type: 'BEGIN_BATTLE' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dispatch]);

  const handleChangeFactions = useCallback(() => {
    dispatch({ type: 'CHANGE_FACTIONS' });
  }, [dispatch]);

  if (state.appStep === 'splash') {
    return <SplashScreen onDismiss={handleDismissSplash} />;
  }

  if (state.appStep === 'setup') {
    return (
      <SetupScreen
        wahapediaHook={wahapediaHook}
        onLaunch={handleLaunchGame}
      />
    );
  }

  if (state.appStep === 'pregame') {
    return (
      <PreGameScreen
        onBeginBattle={handleBeginBattle}
        onChangeFactions={handleChangeFactions}
      />
    );
  }

  return (
    <GameScreen
      wahapediaHook={wahapediaHook}
      onChangeFactions={handleChangeFactions}
    />
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppInner />
    </GameProvider>
  );
}
