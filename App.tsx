import React from 'react';
import Dartboard from './components/Dartboard';
import Scoreboard from './components/Scoreboard';
import GameControls from './components/GameControls';
import GameSetup from './components/GameSetup';
import { useGameState } from './hooks/useGameState';

const App: React.FC = () => {
  const {
    players,
    currentPlayerIndex,
    turnThrows,
    matchWinner,
    gameMessage,
    hitAnimation,
    isLegOver,
    isGameStarted,
    handleThrow,
    resetGame,
    undoThrow,
    startGame,
    startNextLeg,
  } = useGameState();

  if (!isGameStarted) {
    return <GameSetup onStartGame={startGame} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center font-sans p-2">
      <header className="text-center my-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-yellow-400">Darts Live Ticker</h1>
        <p className="text-gray-400">501 - Double Out</p>
      </header>
      
      <main className="w-full flex flex-col lg:flex-row items-center justify-center gap-4">
        <div className="w-full lg:w-1/2 flex-shrink-0">
          <Dartboard onThrow={handleThrow} hitAnimation={hitAnimation} />
        </div>
        <div className="w-full lg:w-1/2 flex flex-col items-center">
            <Scoreboard 
                players={players} 
                currentPlayerIndex={currentPlayerIndex}
                turnThrows={turnThrows}
                gameMessage={gameMessage}
            />
            <GameControls 
              onReset={resetGame} 
              onUndo={undoThrow} 
              winner={!!matchWinner}
              isLegOver={isLegOver}
              onNextLeg={startNextLeg}
            />
        </div>
      </main>
      
      <footer className="text-center text-gray-500 py-4 mt-auto">
        <p>Click on the board to score. Finish on a double to win!</p>
      </footer>
    </div>
  );
};

export default App;
