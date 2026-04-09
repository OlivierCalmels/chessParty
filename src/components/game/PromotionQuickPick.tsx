import { useEffect, useRef } from 'react';

import type { BoardPiece } from '../../hooks/useChessGame';
import { CburnettPieceIcon } from './cburnettPieces';

type Promotion = 'q' | 'n';

type Props = {
  color: 'w' | 'b';
  onSelect: (piece: Promotion) => void;
  onCancel: () => void;
};

const PIECES: Record<'w' | 'b', Record<Promotion, BoardPiece>> = {
  w: { q: 'wQ', n: 'wN' },
  b: { q: 'bQ', n: 'bN' },
};

const BTN =
  'flex min-h-[3.25rem] min-w-[3.25rem] items-center justify-center rounded-xl border border-(--color-border) bg-(--color-surface-alt) p-2 shadow-sm transition hover:bg-(--color-border) active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary)';

export function PromotionQuickPick({ color, onSelect, onCancel }: Props) {
  const queenRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    queenRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  const iconSize = 44;

  return (
    <div
      role="dialog"
      aria-label="Promotion — choisir dame ou cavalier"
      className="flex flex-col items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-surface) px-3 py-2 shadow-lg"
    >
      <div className="flex gap-2">
        <button
          ref={queenRef}
          type="button"
          className={BTN}
          aria-label="Promouvoir en dame"
          title="Dame"
          onClick={() => onSelect('q')}
        >
          <CburnettPieceIcon piece={PIECES[color].q} size={iconSize} />
        </button>
        <button
          type="button"
          className={BTN}
          aria-label="Promouvoir en cavalier"
          title="Cavalier"
          onClick={() => onSelect('n')}
        >
          <CburnettPieceIcon piece={PIECES[color].n} size={iconSize} />
        </button>
      </div>
      <button
        type="button"
        onClick={onCancel}
        className="text-xs text-(--color-text-muted) underline hover:text-(--color-text)"
      >
        Annuler
      </button>
    </div>
  );
}
