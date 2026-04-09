import { Chess } from 'chess.js';

import type { Game } from '../types/game';

export function buildPgn(game: Pick<Game, 'name' | 'white' | 'black' | 'date' | 'result' | 'id' | 'moves'>): string {
  const chess = new Chess();
  for (const move of game.moves) {
    chess.move(move);
  }

  chess.header(
    'Event', game.name,
    'White', game.white,
    'Black', game.black,
    'Date', game.date,
    'Result', game.result,
    'GameId', game.id,
  );

  return chess.pgn({ maxWidth: 80 });
}

export function parsePgn(pgn: string): {
  headers: Record<string, string>;
  moves: string[];
} | null {
  try {
    const chess = new Chess();
    chess.loadPgn(pgn);
    const history = chess.history();
    const headers: Record<string, string> = {};
    const h = chess.header();
    for (const key of Object.keys(h)) {
      const val = h[key];
      if (val != null) headers[key] = val;
    }
    return { headers, moves: history };
  } catch {
    return null;
  }
}
