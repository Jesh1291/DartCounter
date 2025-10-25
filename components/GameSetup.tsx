import React, { useState } from 'react';
import type { GameConfig } from '../types';

interface GameSetupProps {
    onStartGame: (config: GameConfig) => void;
}

const GameSetup: React.FC<GameSetupProps> = ({ onStartGame }) => {
  const [numPlayers, setNumPlayers] = useState(2);
  const [playerNames, setPlayerNames] = useState<string[]>(['', '', '', '']);
  const [legsToWinSet, setLegsToWinSet] = useState(3);
  const [setsToWinMatch, setSetsToWinMatch] = useState(2);

  const handlePlayerNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    onStartGame({
      playerNames: playerNames.slice(0, numPlayers),
      legsToWinSet,
      setsToWinMatch
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center font-sans p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-2xl p-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-yellow-400 text-center mb-6">Game Setup</h1>
        
        <form onSubmit={handleStart} className="space-y-6">
          {/* Number of Players */}
          <div>
            <label htmlFor="numPlayers" className="block text-lg font-medium text-gray-300">Number of Players</label>
            <select
              id="numPlayers"
              value={numPlayers}
              onChange={(e) => setNumPlayers(parseInt(e.target.value))}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-lg"
            >
              <option value={2}>2 Players</option>
              <option value={3}>3 Players</option>
              <option value={4}>4 Players</option>
            </select>
          </div>

          {/* Player Names */}
          <div>
            <label className="block text-lg font-medium text-gray-300">Player Names</label>
            <div className="mt-2 space-y-2">
              {Array.from({ length: numPlayers }).map((_, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={`Player ${i + 1} Name`}
                  value={playerNames[i]}
                  onChange={(e) => handlePlayerNameChange(i, e.target.value)}
                  className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-lg"
                />
              ))}
            </div>
          </div>
          
          {/* Game Format */}
          <div className="flex gap-4">
             <div className="flex-1">
              <label htmlFor="sets" className="block text-lg font-medium text-gray-300">Sets to Win</label>
              <select
                id="sets"
                value={setsToWinMatch}
                onChange={(e) => setSetsToWinMatch(parseInt(e.target.value))}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-lg"
              >
                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>Best of {n*2-1}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="legs" className="block text-lg font-medium text-gray-300">Legs per Set</label>
              <select
                id="legs"
                value={legsToWinSet}
                onChange={(e) => setLegsToWinSet(parseInt(e.target.value))}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-lg"
              >
                 {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>Best of {n*2-1}</option>)}
              </select>
            </div>
          </div>

          {/* Start Button */}
          <button
            type="submit"
            className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md transition-transform transform hover:scale-105 text-xl"
          >
            Start Game
          </button>
        </form>
      </div>
    </div>
  );
};

export default GameSetup;
