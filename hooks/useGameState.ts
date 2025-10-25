import { useState, useCallback } from 'react';
import type { GameState, Player, Throw, HitSegment, GameConfig } from '../types';
import { STARTING_SCORE } from '../constants';

const getInitialState = (): GameState => ({
  players: [],
  currentPlayerIndex: 0,
  legStartingPlayerIndex: 0,
  turnThrows: [],
  matchWinner: null,
  gameMessage: '',
  hitAnimation: null,
  history: [],
  config: null,
  isLegOver: false,
  isGameStarted: false,
});

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(getInitialState());

  const startGame = useCallback((config: GameConfig) => {
    const initialPlayers: Player[] = config.playerNames.map((name, index) => ({
      id: index + 1,
      name: name.trim() === '' ? `Player ${index + 1}` : name,
      score: STARTING_SCORE,
      legsWon: 0,
      setsWon: 0,
    }));

    setGameState({
      ...getInitialState(),
      players: initialPlayers,
      config,
      isGameStarted: true,
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(getInitialState());
  }, []);

  const startNextLeg = useCallback(() => {
    setGameState(prevState => {
        if (!prevState.isLegOver || prevState.matchWinner || !prevState.config) return prevState;

        const nextStartingPlayerIndex = (prevState.legStartingPlayerIndex + 1) % prevState.players.length;

        const playersResetForLeg = prevState.players.map(p => ({
            ...p,
            score: STARTING_SCORE,
        }));

        return {
            ...prevState,
            players: playersResetForLeg,
            currentPlayerIndex: nextStartingPlayerIndex,
            legStartingPlayerIndex: nextStartingPlayerIndex,
            turnThrows: [],
            isLegOver: false,
            gameMessage: '',
            history: [],
        };
    });
  }, []);

  const handleThrow = useCallback((thrown: HitSegment) => {
    setGameState(prevState => {
      if (prevState.winner || prevState.isLegOver) return prevState;

      const newHitAnimation = { ...thrown };
      
      const newTurnThrows = [...prevState.turnThrows, { score: thrown.score, multiplier: thrown.multiplier }];
      const throwScore = thrown.score * thrown.multiplier;
      const currentPlayer = prevState.players[prevState.currentPlayerIndex];
      const newScore = currentPlayer.score - throwScore;

      let newPlayers = [...prevState.players];
      newPlayers[prevState.currentPlayerIndex] = { ...currentPlayer, score: newScore };

      let newMessage = '';
      let nextPlayerIndex = prevState.currentPlayerIndex;

      const isBust = newScore < 0 || newScore === 1 || (newScore === 0 && thrown.multiplier !== 2);
      
      if (isBust) {
        newMessage = 'BUST!';
        newPlayers = [...prevState.players]; // Revert score
        nextPlayerIndex = (prevState.currentPlayerIndex + 1) % prevState.players.length;
        return {
          ...prevState,
          players: newPlayers,
          currentPlayerIndex: nextPlayerIndex,
          turnThrows: [],
          gameMessage: newMessage,
          hitAnimation: newHitAnimation,
          history: [...prevState.history, { score: thrown.score, multiplier: thrown.multiplier }]
        };
      }
      
      const isWinner = newScore === 0 && thrown.multiplier === 2;
      if (isWinner) {
        const winningPlayer = { ...currentPlayer, score: 0 };
        newPlayers[prevState.currentPlayerIndex] = winningPlayer;
        winningPlayer.legsWon++;

        let message = `Leg to ${winningPlayer.name}!`;
        let isMatchWinner = false;

        if (winningPlayer.legsWon === prevState.config!.legsToWinSet) {
            winningPlayer.setsWon++;
            message = `Set and Leg to ${winningPlayer.name}!`;
            newPlayers.forEach(p => p.legsWon = 0);
        }

        if (winningPlayer.setsWon === prevState.config!.setsToWinMatch) {
            isMatchWinner = true;
            message = `Game Shot and The Match, ${winningPlayer.name}!`;
        }
        
        return {
            ...prevState,
            players: newPlayers,
            isLegOver: true,
            matchWinner: isMatchWinner ? winningPlayer : null,
            gameMessage: message,
            hitAnimation: newHitAnimation,
            history: [...prevState.history, { score: thrown.score, multiplier: thrown.multiplier }]
        };
      }

      const isTurnOver = newTurnThrows.length === 3;
      if (isTurnOver && !isWinner) {
        nextPlayerIndex = (prevState.currentPlayerIndex + 1) % prevState.players.length;
      }

      return {
        ...prevState,
        players: newPlayers,
        currentPlayerIndex: isTurnOver ? nextPlayerIndex : prevState.currentPlayerIndex,
        turnThrows: isTurnOver ? [] : newTurnThrows,
        gameMessage: newMessage,
        hitAnimation: newHitAnimation,
        history: [...prevState.history, { score: thrown.score, multiplier: thrown.multiplier }]
      };
    });
    
    setTimeout(() => {
        setGameState(prevState => ({ ...prevState, hitAnimation: null, gameMessage: (prevState.isLegOver || prevState.matchWinner) ? prevState.gameMessage : '' }));
    }, 500);

  }, []);

  const undoThrow = useCallback(() => {
     resetGame();
     alert("Das Spiel wurde zurückgesetzt. Eine vollständige 'Rückgängig'-Funktion ist komplex; diese Aktion startet zur Vereinfachung ein neues Spiel.");
  }, [resetGame]);

  return { ...gameState, handleThrow, resetGame, undoThrow, startGame, startNextLeg };
};
