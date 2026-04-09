import type { GameResult } from '../../types/game';
import { gameStartLabel } from '../../utils/gameStartLabel';

type Props = {
  name: string;
  white: string;
  black: string;
  date: string;
  createdAt?: number;
  turn: 'w' | 'b';
  result: GameResult;
  isGameOver: boolean;
};

function resultLabel(result: GameResult): string {
  switch (result) {
    case '1-0': return 'Blancs gagnent';
    case '0-1': return 'Noirs gagnent';
    case '1/2-1/2': return 'Nulle';
    default: return '';
  }
}

export function GameInfo({ name, white, black, date, createdAt, turn, result, isGameOver }: Props) {
  const startLabel = gameStartLabel(date, createdAt);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-lg font-bold text-(--color-text) truncate">{name}</h1>
        <span className="text-xs text-(--color-text-muted) shrink-0 tabular-nums" title="Date et heure de début">
          {startLabel}
        </span>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full border border-(--color-border) bg-white" />
          <span className={`font-medium ${turn === 'w' && !isGameOver ? 'text-(--color-primary)' : 'text-(--color-text)'}`}>
            {white}
          </span>
        </div>
        <span className="text-(--color-text-muted)">vs</span>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-gray-800 dark:bg-gray-300" />
          <span className={`font-medium ${turn === 'b' && !isGameOver ? 'text-(--color-primary)' : 'text-(--color-text)'}`}>
            {black}
          </span>
        </div>
      </div>
      {isGameOver && result !== '*' && (
        <div className="rounded-lg bg-(--color-primary)/10 px-3 py-2 text-sm font-semibold text-(--color-primary)">
          {result} &mdash; {resultLabel(result)}
        </div>
      )}
    </div>
  );
}
