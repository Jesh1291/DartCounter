export interface Player {
  id: number;
  name: string;
  score: number;
  legsWon: number;
  setsWon: number;
}

export interface Throw {
  score: number;
  multiplier: number;
}

export interface HitSegment extends Throw {
  segment: number;
}

export interface GameConfig {
  playerNames: string[];
  legsToWinSet: number;
  setsToWinMatch: number;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  turnThrows: Throw[];
  matchWinner: Player | null;
  gameMessage: string;
  hitAnimation: HitSegment | null;
  history: Throw[];
  config: GameConfig | null;
  isLegOver: boolean;
  legStartingPlayerIndex: number;
  isGameStarted: boolean;
}
