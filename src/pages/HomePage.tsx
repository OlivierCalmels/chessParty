import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '../components/ui/Button';
import { deleteGame, listGames } from '../services/storage';
import type { GameSummary } from '../types/game';
import { gameStartLabel } from '../utils/gameStartLabel';

function resultBadge(result: string) {
  if (result === '*') return null;
  const colors =
    result === '1/2-1/2'
      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      : 'bg-(--color-primary)/10 text-(--color-primary)';
  return (
    <span className={`rounded px-1.5 py-0.5 text-xs font-semibold ${colors}`}>
      {result}
    </span>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const [games, setGames] = useState<GameSummary[]>(() => listGames());

  function handleDelete(id: string) {
    deleteGame(id);
    setGames(listGames());
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-(--color-text)">Mes parties</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/import')}>
            Importer PGN
          </Button>
          <Button onClick={() => navigate('/new')}>
            Nouvelle partie
          </Button>
        </div>
      </div>

      {games.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-(--color-border) py-16 text-center">
          <p className="text-lg font-medium text-(--color-text)">Aucune partie</p>
          <p className="mt-1 text-sm text-(--color-text-muted)">
            Créez votre première partie ou importez un PGN
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button variant="secondary" onClick={() => navigate('/import')}>
              Importer PGN
            </Button>
            <Button onClick={() => navigate('/new')}>
              Nouvelle partie
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {games.map((g) => (
            <div
              key={g.id}
              className="flex items-center justify-between rounded-lg border border-(--color-border) bg-(--color-surface) px-4 py-3 transition-colors hover:bg-(--color-surface-alt)"
            >
              <Link
                to={`/game/${g.id}`}
                className="flex min-w-0 flex-1 flex-col gap-1 no-underline"
              >
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium text-(--color-text)">{g.name}</span>
                  {resultBadge(g.result)}
                </div>
                <span className="text-xs text-(--color-text-muted)">
                  {g.white} vs {g.black} &middot; {g.moveCount} coups &middot;{' '}
                  {gameStartLabel(g.date, g.createdAt)}
                </span>
              </Link>
              <button
                onClick={() => handleDelete(g.id)}
                className="ml-3 shrink-0 rounded p-1.5 text-(--color-text-muted) transition-colors hover:bg-(--color-danger)/10 hover:text-(--color-danger)"
                aria-label="Supprimer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
