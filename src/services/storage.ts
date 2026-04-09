import type { Game, GameSummary } from '../types/game';

const STORAGE_KEY = 'chess-games';

function readAll(): Game[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Game[]) : [];
  } catch {
    return [];
  }
}

function writeAll(games: Game[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
}

export function listGames(): GameSummary[] {
  return readAll()
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map((g) => ({
      id: g.id,
      name: g.name,
      white: g.white,
      black: g.black,
      date: g.date,
      result: g.result,
      createdAt: g.createdAt,
      updatedAt: g.updatedAt,
      moveCount: g.moves.length,
    }));
}

export function getGame(id: string): Game | undefined {
  return readAll().find((g) => g.id === id);
}

export function saveGame(game: Game): void {
  const games = readAll();
  const idx = games.findIndex((g) => g.id === game.id);
  const updated = { ...game, updatedAt: Date.now() };
  if (idx >= 0) {
    games[idx] = updated;
  } else {
    games.push(updated);
  }
  writeAll(games);
}

export function deleteGame(id: string): void {
  writeAll(readAll().filter((g) => g.id !== id));
}
