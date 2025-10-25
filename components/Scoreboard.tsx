import React from 'react';
import type { Player, Throw } from '../types';

interface ScoreboardProps {
  players: Player[];
  currentPlayerIndex: number;
  turnThrows: Throw[];
  gameMessage: string;
}

const PlayerCard: React.FC<{ player: Player; isActive: boolean }> = ({ player, isActive }) => (
  <div className={`p-4 rounded-lg transition-all duration-300 h-full flex flex-col justify-between ${isActive ? 'bg-yellow-500 text-gray-900 scale-105 shadow-lg' : 'bg-gray-700'}`}>
    <div>
        <h3 className="text-xl md:text-2xl font-bold tracking-wider truncate">{player.name}</h3>
        <p className="text-5xl md:text-7xl font-mono font-bold my-2">{player.score}</p>
    </div>
    <div className="text-xs md:text-sm font-semibold opacity-80 flex justify-around">
        <span>SETS: <strong>{player.setsWon}</strong></span>
        <span>LEGS: <strong>{player.legsWon}</strong></span>
    </div>
  </div>
);

const Scoreboard: React.FC<ScoreboardProps> = ({ players, currentPlayerIndex, turnThrows, gameMessage }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex flex-row flex-wrap items-stretch justify-center gap-4 text-center">
        {players.map((player, index) => (
            <div key={player.id} className="flex-auto min-w-[160px] max-w-[240px]">
                 <PlayerCard player={player} isActive={currentPlayerIndex === index} />
            </div>
        ))}
      </div>
      <div className="bg-gray-800 p-4 rounded-lg text-center h-24 flex flex-col justify-center items-center">
        {gameMessage ? (
          <p className="text-2xl font-bold text-yellow-400 animate-pulse">{gameMessage}</p>
        ) : (
          <div>
            <p className="text-lg text-gray-400 mb-2">
              <span className="font-bold text-white">{players[currentPlayerIndex]?.name}</span> to throw
            </p>
            <div className="flex justify-center space-x-4">
              {[0, 1, 2].map(i => {
                const aThrow = turnThrows[i];
                const score = aThrow ? aThrow.score * aThrow.multiplier : null;
                return (
                  <div key={i} className="w-16 h-10 bg-gray-700 rounded flex items-center justify-center font-mono text-xl">
                    {score !== null ? score : '-'}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scoreboard;
