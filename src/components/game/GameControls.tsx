import { useNavigate } from 'react-router-dom';

import { Button } from '../ui/Button';

type Props = {
  canUndoLastMove: boolean;
  canRevertManualResult: boolean;
  isGameOver: boolean;
  onUndoLastMove: () => void;
  onRevertManualResult: () => void;
  onResign: (color: 'w' | 'b') => void;
  onDraw: () => void;
  /** Barre compacte sous l’échiquier (enregistrement de partie). */
  nearBoard?: boolean;
};

export function GameControls({
  canUndoLastMove,
  canRevertManualResult,
  isGameOver,
  onUndoLastMove,
  onRevertManualResult,
  onResign,
  onDraw,
  nearBoard,
}: Props) {
  const navigate = useNavigate();

  const rowClass = nearBoard
    ? 'flex flex-wrap gap-1.5'
    : 'flex flex-wrap gap-2';

  const btnClass = nearBoard ? 'px-3 py-1.5 text-xs' : '';

  return (
    <div className={`flex flex-col ${nearBoard ? 'gap-2' : 'gap-3'}`}>
      {nearBoard && (
        <span className="text-[11px] font-semibold uppercase tracking-wide text-(--color-text-muted)">
          Actions
        </span>
      )}
      <div className={rowClass}>
        <Button
          variant="secondary"
          className={btnClass}
          onClick={onUndoLastMove}
          disabled={!canUndoLastMove}
        >
          Annuler dernier coup
        </Button>
        <Button
          variant="secondary"
          className={btnClass}
          onClick={onRevertManualResult}
          disabled={!canRevertManualResult}
        >
          Annuler abandon / nulle
        </Button>
        {!isGameOver && (
          <>
            <Button variant="danger" className={btnClass} onClick={() => onResign('w')}>
              Abandon blanc
            </Button>
            <Button variant="danger" className={btnClass} onClick={() => onResign('b')}>
              Abandon noir
            </Button>
            <Button variant="ghost" className={btnClass} onClick={onDraw}>
              Nulle
            </Button>
          </>
        )}
      </div>
      {isGameOver && (
        <div className="flex flex-wrap gap-2 border-t border-(--color-border) pt-3">
          <Button onClick={() => navigate('/new')}>
            Nouvelle partie
          </Button>
          <Button variant="secondary" onClick={() => navigate('/')}>
            Mes parties
          </Button>
        </div>
      )}
    </div>
  );
}
