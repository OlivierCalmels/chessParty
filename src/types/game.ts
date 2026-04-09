export type GameResult = '*' | '1-0' | '0-1' | '1/2-1/2';

export type Game = {
  id: string;
  name: string;
  white: string;
  black: string;
  date: string;
  result: GameResult;
  moves: string[];
  pgn: string;
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
