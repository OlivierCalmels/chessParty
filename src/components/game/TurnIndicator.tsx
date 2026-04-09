type Props = {
  turn: 'w' | 'b';
  isGameOver: boolean;
};

export function TurnIndicator({ turn, isGameOver }: Props) {
  if (isGameOver) {
    return (
      <div className="rounded-lg border border-(--color-border) bg-(--color-surface-alt) px-3 py-2 text-center text-sm font-medium text-(--color-text-muted)">
        Partie terminée
      </div>
    );
  }

  const isWhite = turn === 'w';

  return (
    <div
      className={`flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-colors ${
        isWhite
          ? 'border-gray-300 bg-white text-gray-900 dark:border-gray-500 dark:bg-gray-100 dark:text-gray-900'
          : 'border-gray-700 bg-gray-800 text-white dark:border-gray-600 dark:bg-gray-900'
      }`}
    >
      <span
        className={`h-2.5 w-2.5 shrink-0 rounded-full ${isWhite ? 'bg-gray-800' : 'bg-white ring-1 ring-white/30'}`}
        aria-hidden
      />
      <span>{isWhite ? 'Trait aux Blancs' : 'Trait aux Noirs'}</span>
    </div>
  );
}
