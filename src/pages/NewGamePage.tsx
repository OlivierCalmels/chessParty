import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { GameForm } from '../components/forms/GameForm';
import { buildPgn } from '../services/pgn';
import { saveGame } from '../services/storage';
import type { Game } from '../types/game';

function todayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

export function NewGamePage() {
  const navigate = useNavigate();

  function handleCreate(data: { name: string; white: string; black: string }) {
    const game: Game = {
      id: uuidv4(),
      name: data.name,
      white: data.white,
      black: data.black,
      date: todayString(),
      result: '*',
      moves: [],
      pgn: '',
      createdAt: Date.now(),
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
