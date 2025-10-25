import React from 'react';

interface GameControlsProps {
  onReset: () => void;
  onUndo: () => void;
  winner: boolean;
  isLegOver: boolean;
  onNextLeg: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ onReset, onUndo, winner, isLegOver, onNextLeg }) => {
  if (isLegOver && !winner) {
    return (
        <div className="flex justify-center items-center space-x-4 p-4">
            <button
                onClick={onNextLeg}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-transform transform hover:scale-105 text-xl"
            >
                Next Leg
            </button>
        </div>
    );
  }
  
  return (
    <div className="flex justify-center items-center space-x-4 p-4">
      <button
        onClick={onReset}
        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md transition-transform transform hover:scale-105"
      >
        {winner ? 'New Match' : 'Reset Match'}
      </button>
      <button
        onClick={onUndo}
        disabled={winner || isLegOver}
        className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg shadow-md transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        Undo
      </button>
    </div>
  );
};

export default GameControls;
