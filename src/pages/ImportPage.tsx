import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { ImportPGNForm } from '../components/forms/ImportPGNForm';
import { buildPgn, parsePgn } from '../services/pgn';
import { saveGame } from '../services/storage';
import type { Game } from '../types/game';
import type { GameResult } from '../types/game';

function todayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

export function ImportPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>();

  function handleImport(pgnText: string) {
    const parsed = parsePgn(pgnText);
    if (!parsed) {
      setError('PGN invalide. Vérifiez le format et réessayez.');
      return;
    }

    const validResults: GameResult[] = ['*', '1-0', '0-1', '1/2-1/2'];
    const rawResult = parsed.headers['Result'] ?? '*';
    const result: GameResult = validResults.includes(rawResult as GameResult)
      ? (rawResult as GameResult)
      : '*';

    const game: Game = {
      id: parsed.headers['GameId'] ?? uuidv4(),
      name: parsed.headers['Event'] ?? 'Partie importée',
      white: parsed.headers['White'] ?? 'Blancs',
      black: parsed.headers['Black'] ?? 'Noirs',
      date: parsed.headers['Date'] ?? todayString(),
      result,
      moves: parsed.moves,
      pgn: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    game.pgn = buildPgn(game);
    saveGame(game);
    navigate(`/game/${game.id}`);
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold text-(--color-text)">Importer un PGN</h1>
      <ImportPGNForm onSubmit={handleImport} error={error} />
    </div>
  );
}
