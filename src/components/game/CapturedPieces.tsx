import { CburnettPieceIcon } from './cburnettPieces';
import type { BoardPiece } from '../../hooks/useChessGame';

type Props = {
  pieces: BoardPiece[];
  /** Barre horizontale pleine largeur (au-dessus / en dessous de l'échiquier). */
  variant?: 'bar' | 'side';
  align?: 'start' | 'end';
};

const BAR_PX = 36;
const SIDE_PX = 28;

export function CapturedPieces({ pieces, variant = 'side', align = 'start' }: Props) {
  const isBar = variant === 'bar';
  const px = isBar ? BAR_PX : SIDE_PX;

  if (pieces.length === 0) {
    return (
      <div
        className={
          isBar
            ? 'flex min-h-[2rem] w-full items-center justify-center py-1'
            : `flex min-h-[2.5rem] items-center ${align === 'end' ? 'justify-end' : 'justify-start'}`
        }
        aria-hidden
      />
    );
  }

  if (isBar) {
    return (
      <div className="flex w-full flex-wrap items-center justify-center gap-1 py-1">
        {pieces.map((p, i) => (
          <span key={`${p}-${i}`} className="inline-flex shrink-0" title={p}>
            <CburnettPieceIcon piece={p} size={px} />
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-[2.5rem] flex-wrap items-center gap-0.5 ${align === 'end' ? 'justify-end' : 'justify-start'}`}
    >
      {pieces.map((p, i) => (
        <span key={`${p}-${i}`} className="inline-flex shrink-0" title={p}>
          <CburnettPieceIcon piece={p} size={px} />
        </span>
      ))}
    </div>
  );
}
