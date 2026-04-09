import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useCallback } from 'react';

import { CapturedPieces } from '../components/game/CapturedPieces';
import { ChessBoard } from '../components/game/ChessBoard';
import { GameControls } from '../components/game/GameControls';
import { GameInfo } from '../components/game/GameInfo';
import { MoveHistoryNav } from '../components/game/MoveHistoryNav';
import { PGNPanel } from '../components/game/PGNPanel';
import { TurnIndicator } from '../components/game/TurnIndicator';
import { useGameBoardOrientation } from '../context/GameBoardOrientationContext';
import { useChessGame } from '../hooks/useChessGame';
import { getGame, saveGame } from '../services/storage';
import type { Game } from '../types/game';

export function GamePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const game = id ? getGame(id) : undefined;

  if (!game) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-(--color-text-muted)">Partie introuvable</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-sm text-(--color-primary) underline"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return <GamePageInner game={game} />;
}

function GamePageInner({ game: initialGame }: { game: Game }) {
  const {
    fen,
    moves,
    pgn,
    displayTurn,
    isGameOver,
    displayIsGameOver,
    result,
    canUndo,
    gameInfo,
    isCheck,
    kingInCheckSquare,
    capturedByWhite,
    capturedByBlack,
    getMoveHints,
    attemptMove,
    isPawnPromotionTarget,
    completePromotion,
    applyPieceDrop,
    undo,
    resign,
    declareDraw,
    replayPly,
    isReplayMode,
    replayGoFirst,
    replayGoPrev,
    replayGoNext,
    replayGoLast,
  } = useChessGame(initialGame);

  const { blackAtBottom, setBlackAtBottom } = useGameBoardOrientation();

  const prevSaveRef = useRef('');

  useEffect(() => {
    setBlackAtBottom(false);
  }, [initialGame.id, setBlackAtBottom]);

  const save = useCallback(() => {
    const snapshot = JSON.stringify({ moves, result });
    if (snapshot === prevSaveRef.current) return;
    prevSaveRef.current = snapshot;
    saveGame({
      ...initialGame,
      moves,
      result,
      pgn,
      updatedAt: Date.now(),
    });
  }, [initialGame, moves, result, pgn]);

  useEffect(() => {
    save();
  }, [save]);

  function handlePieceDrop(from: string, to: string, piece: string): boolean {
    return applyPieceDrop(from, to, piece);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        {/* Enregistrement : tout aligné sur la largeur du plateau */}
        <div className="mx-auto flex w-full min-w-0 max-w-[560px] flex-col gap-3 lg:mx-0 lg:flex-1">
          <div className="space-y-2">
            <GameInfo
              name={gameInfo.name}
              white={gameInfo.white}
              black={gameInfo.black}
              date={gameInfo.date}
              createdAt={initialGame.createdAt}
              turn={displayTurn}
              result={result}
              isGameOver={isGameOver}
            />
            <TurnIndicator turn={displayTurn} isGameOver={displayIsGameOver} />
          </div>

          <div className="flex flex-col gap-2">
            <ChessBoard
              fen={fen}
              onPieceDrop={handlePieceDrop}
              disabled={isGameOver || isReplayMode}
              turn={displayTurn}
              boardOrientation={blackAtBottom ? 'black' : 'white'}
              getMoveHints={getMoveHints}
              attemptMove={attemptMove}
              isPawnPromotionTarget={isPawnPromotionTarget}
              completePromotion={completePromotion}
              kingInCheckSquare={kingInCheckSquare}
              isCheck={isCheck}
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 flex-col items-start gap-2">
                <div className="flex flex-col items-start gap-0.5">
                  <CapturedPieces variant="side" pieces={capturedByBlack} />
                </div>
                <div className="flex flex-col items-start gap-0.5">
                  <CapturedPieces variant="side" pieces={capturedByWhite} />
                </div>
              </div>
              <MoveHistoryNav
                className="self-end sm:shrink-0"
                replayPly={replayPly}
                totalPlies={moves.length}
                onFirst={replayGoFirst}
                onPrev={replayGoPrev}
                onNext={replayGoNext}
                onLast={replayGoLast}
              />
            </div>
          </div>

          <div className="rounded-lg border border-(--color-border) bg-(--color-surface-alt)/50 p-3">
            <GameControls
              nearBoard
              canUndo={canUndo}
              isGameOver={isGameOver}
              onUndo={undo}
              onResign={resign}
              onDraw={declareDraw}
            />
          </div>
        </div>
      </div>

      <footer className="flex w-full min-w-0 flex-col gap-3 border-t border-(--color-border) pt-6">
        <div className="rounded-lg border border-(--color-border) bg-(--color-surface-alt)/50 p-3">
          <PGNPanel
            pgn={pgn}
            gameName={gameInfo.name}
            date={gameInfo.date}
            white={gameInfo.white}
            black={gameInfo.black}
          />
        </div>
      </footer>
    </div>
  );
}
