import { useEffect, useMemo, useState } from 'react';
import { Chessboard } from 'react-chessboard';

import { cburnettCustomPieces } from './cburnettPieces';
import { PromotionQuickPick } from './PromotionQuickPick';

type BoardSquare = string;
type BoardPiece = string;
type SquareStyles = Record<string, Record<string, string | number>>;

type Props = {
  fen: string;
  onPieceDrop: (sourceSquare: string, targetSquare: string, piece: string) => boolean;
  disabled?: boolean;
  turn: 'w' | 'b';
  boardOrientation?: 'white' | 'black';
  getMoveHints: (square: string | null) => { destinations: string[]; captureSquares: Set<string> };
  attemptMove: (from: string, to: string) => boolean;
  isPawnPromotionTarget: (from: string, to: string) => boolean;
  completePromotion: (from: string, to: string, promotion: 'q' | 'r' | 'n' | 'b') => boolean;
  kingInCheckSquare?: string;
  isCheck: boolean;
};

export function ChessBoard({
  fen,
  onPieceDrop,
  disabled,
  turn,
  boardOrientation = 'white',
  getMoveHints,
  attemptMove,
  isPawnPromotionTarget,
  completePromotion,
  kingInCheckSquare,
  isCheck,
}: Props) {
  const [selectedSquare, setSelectedSquare] = useState<BoardSquare | null>(null);
  const [promotionClick, setPromotionClick] = useState<{ from: string; to: string } | null>(null);

  useEffect(() => {
    setSelectedSquare(null);
    setPromotionClick(null);
  }, [fen]);

  const turnChar: 'w' | 'b' = turn;

  const customSquareStyles = useMemo((): SquareStyles => {
    const styles: SquareStyles = {};

    if (kingInCheckSquare && isCheck) {
      styles[kingInCheckSquare] = {
        boxShadow: 'inset 0 0 0 3px #ef4444',
        borderRadius: '2px',
      };
    }

    if (!selectedSquare || disabled) return styles;

    const { destinations, captureSquares } = getMoveHints(selectedSquare);

    styles[selectedSquare] = {
      ...styles[selectedSquare],
      backgroundColor: 'rgba(250, 204, 21, 0.35)',
    };

    for (const d of destinations) {
      if (d === selectedSquare) continue;
      const sq = d;
      const isCapture = captureSquares.has(d);
      styles[sq] = {
        ...styles[sq],
        ...(isCapture
          ? {
              boxShadow: 'inset 0 0 0 3px rgba(220, 38, 38, 0.9)',
              borderRadius: '2px',
            }
          : {
              background:
                'radial-gradient(circle, rgba(0, 0, 0, 0.28) 22%, transparent 23%)',
            }),
      };
    }

    return styles;
  }, [selectedSquare, fen, disabled, getMoveHints, kingInCheckSquare, isCheck]);

  function handleSquareClick(square: BoardSquare, piece: BoardPiece | undefined) {
    if (disabled) return;

    if (promotionClick) return;

    if (selectedSquare) {
      if (square === selectedSquare) {
        setSelectedSquare(null);
        return;
      }
      if (piece && piece[0] === turnChar) {
        setSelectedSquare(square);
        return;
      }
      if (isPawnPromotionTarget(selectedSquare, square)) {
        setPromotionClick({ from: selectedSquare, to: square });
        setSelectedSquare(null);
        return;
      }
      if (attemptMove(selectedSquare, square)) {
        setSelectedSquare(null);
      }
      return;
    }

    if (piece && piece[0] === turnChar) {
      setSelectedSquare(square);
    }
  }

  function handlePieceDragBegin(_piece: BoardPiece, sourceSquare: BoardSquare) {
    if (disabled) return;
    setSelectedSquare(sourceSquare);
  }

  function handlePieceDragEnd() {
    setSelectedSquare(null);
  }

  function promotionCheck(_sourceSquare: string, targetSquare: string, piece: string): boolean {
    if (piece !== 'wP' && piece !== 'bP') return false;
    if (piece === 'wP') return targetSquare[1] === '8';
    return targetSquare[1] === '1';
  }

  return (
    <div className="relative w-full max-w-full">
      {promotionClick && !disabled && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-1001 flex justify-center pb-2">
          <div className="pointer-events-auto">
            <PromotionQuickPick
              color={turnChar}
              onSelect={(p) => {
                completePromotion(promotionClick.from, promotionClick.to, p);
                setPromotionClick(null);
              }}
              onCancel={() => setPromotionClick(null)}
            />
          </div>
        </div>
      )}
      <div className="aspect-square w-full">
        <Chessboard
          boardOrientation={boardOrientation}
          position={fen}
          customPieces={cburnettCustomPieces}
          onPieceDrop={onPieceDrop}
          onSquareClick={handleSquareClick}
          onPieceDragBegin={handlePieceDragBegin}
          onPieceDragEnd={handlePieceDragEnd}
          isDraggablePiece={({ piece }: { piece: BoardPiece }) =>
            !disabled && piece[0] === turnChar
          }
          arePiecesDraggable={!disabled}
          showPromotionDialog
          autoPromoteToQueen={false}
          onPromotionCheck={promotionCheck}
          promotionDialogVariant="default"
          animationDuration={200}
          customBoardStyle={{
            borderRadius: 0,
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          }}
          customDarkSquareStyle={{ backgroundColor: '#779952' }}
          customLightSquareStyle={{ backgroundColor: '#edeed1' }}
          customSquareStyles={customSquareStyles}
        />
      </div>
    </div>
  );
}
