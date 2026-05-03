export type GameResult = '*' | '1-0' | '0-1' | '1/2-1/2';

export type GameClockConfig = {
  enabled: boolean;
  baseMinutes: 3 | 5 | 10;
  incrementSeconds: 0 | 2 | 5 | 10;
};

export type GameClockState = {
  started: boolean;
  running: boolean;
  activeColor: 'w' | 'b';
  whiteRemainingMs: number;
  blackRemainingMs: number;
  lastTickAt?: number;
};

export type Game = {
  id: string;
  name: string;
  white: string;
  black: string;
  date: string;
  result: GameResult;
  moves: string[];
  pgn: string;
  clockConfig?: GameClockConfig;
  clockState?: GameClockState;
  /** Horodatage de création (pour afficher l'heure de début). */
  createdAt?: number;
  updatedAt: number;
};

export type GameSummary = Pick<
  Game,
  'id' | 'name' | 'white' | 'black' | 'date' | 'result' | 'updatedAt' | 'createdAt'
> & {
  moveCount: number;
};
