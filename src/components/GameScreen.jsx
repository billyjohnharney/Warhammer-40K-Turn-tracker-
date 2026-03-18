import { useEffect } from 'react';
import { useGame } from '../context/GameContext.jsx';
import { coreAlwaysVisible } from '../data/keywords.js';
import Header from './Header.jsx';
import TurnBar from './TurnBar.jsx';
import PhaseView from './PhaseView.jsx';
import StepModal from './StepModal.jsx';
import StratagemModal from './StratagemModal.jsx';
import KeywordModal from './KeywordModal.jsx';

export default function GameScreen({ wahapediaHook, onChangeFactions }) {
  const { state } = useGame();

  useEffect(() => {
    wahapediaHook.load(state.gameConfig);
  }, []);

  return (
    <>
      <Header onChangeFactions={onChangeFactions} />
      <TurnBar />
      <main>
        <PhaseView wahapediaHook={wahapediaHook} />
      </main>
      <StepModal coreAlwaysVisible={coreAlwaysVisible} />
      <StratagemModal wahapediaHook={wahapediaHook} />
      <KeywordModal />
    </>
  );
}
