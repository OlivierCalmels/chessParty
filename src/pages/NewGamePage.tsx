import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { GameForm } from '../components/forms/GameForm';
import { buildPgn } from '../services/pgn';
import { saveGame } from '../services/storage';
import type { Game, GameClockConfig } from '../types/game';

function todayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

function autoGameName(createdAt: number, white: string, black: string): string {
  const d = new Date(createdAt);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  const whiteToken = white.trim().replace(/\s+/g, '-');
  const blackToken = black.trim().replace(/\s+/g, '-');
  return `${y}.${m}.${day}_${hh}:${mm}:${ss}-${whiteToken}-${blackToken}`;
}

export function NewGamePage() {
  const navigate = useNavigate();

  function handleCreate(data: {
    name: string;
    white: string;
    black: string;
    clockConfig: GameClockConfig;
  }) {
    const createdAt = Date.now();
    const resolvedName = data.name.trim() || autoGameName(createdAt, data.white, data.black);
    const baseMs = data.clockConfig.baseMinutes * 60_000;
    const game: Game = {
      id: uuidv4(),
      name: resolvedName,
      white: data.white,
      black: data.black,
      date: todayString(),
      result: '*',
      moves: [],
      pgn: '',
      clockConfig: data.clockConfig,
      clockState: data.clockConfig.enabled
        ? {
            started: false,
            running: false,
            activeColor: 'w',
            whiteRemainingMs: baseMs,
            blackRemainingMs: baseMs,
          }
        : undefined,
      createdAt,
      updatedAt: Date.now(),
    };
    game.pgn = buildPgn(game);
    saveGame(game);
    navigate(`/game/${game.id}`);
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-bold text-(--color-text)">Nouvelle partie</h1>
      <GameForm onSubmit={handleCreate} />
    </div>
  );
}
