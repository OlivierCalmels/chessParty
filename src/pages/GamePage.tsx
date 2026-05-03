import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useCallback, useMemo, useState } from 'react';

import { CapturedPieces } from '../components/game/CapturedPieces';
import { ChessBoard } from '../components/game/ChessBoard';
import { GameControls } from '../components/game/GameControls';
import { GameInfo } from '../components/game/GameInfo';
import { MoveHistoryNav } from '../components/game/MoveHistoryNav';
import { PGNPanel } from '../components/game/PGNPanel';
import { TurnIndicator } from '../components/game/TurnIndicator';
import { Button } from '../components/ui/Button';
import { useGameBoardOrientation } from '../context/GameBoardOrientationContext';
import { useChessGame } from '../hooks/useChessGame';
import { getGame, saveGame } from '../services/storage';
import type { Game, GameClockState } from '../types/game';

function applyElapsed(state: GameClockState, now: number): GameClockState {
  if (!state.running || !state.lastTickAt) return state;
  const elapsed = Math.max(0, now - state.lastTickAt);
  if (elapsed === 0) return state;
  if (state.activeColor === 'w') {
    return {
      ...state,
      whiteRemainingMs: Math.max(0, state.whiteRemainingMs - elapsed),
      lastTickAt: now,
    };
  }
  return {
    ...state,
    blackRemainingMs: Math.max(0, state.blackRemainingMs - elapsed),
    lastTickAt: now,
  };
}

function formatClock(ms: number): string {
  const safe = Math.max(0, ms);
  const minutes = Math.floor(safe / 60_000);
  const seconds = Math.floor((safe % 60_000) / 1000);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

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
  const clockEnabled = initialGame.clockConfig?.enabled === true;
  const [clockState, setClockState] = useState<GameClockState | undefined>(() => initialGame.clockState);
  const [clockNow, setClockNow] = useState(() => Date.now());

  const prevSaveRef = useRef('');
  const prevMoveCountRef = useRef(moves.length);
  const timeoutAlertShownRef = useRef(false);
  const prevIsGameOverRef = useRef(isGameOver);

  useEffect(() => {
    setBlackAtBottom(false);
  }, [initialGame.id, setBlackAtBottom]);

  useEffect(() => {
    setClockState(initialGame.clockState);
    prevMoveCountRef.current = initialGame.moves.length;
  }, [initialGame.id, initialGame.clockState, initialGame.moves.length]);

  // Aligner le ref seulement au changement de partie (évite d’écraser l’historique fin/reprise)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    prevIsGameOverRef.current = isGameOver;
  }, [initialGame.id]);

  useEffect(() => {
    if (!clockEnabled) return;
    const id = window.setInterval(() => setClockNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [clockEnabled]);

  useEffect(() => {
    if (!clockEnabled || !clockState || !isGameOver || !clockState.running) return;
    setClockState({ ...clockState, running: false, lastTickAt: undefined });
  }, [clockEnabled, clockState, isGameOver]);

  useEffect(() => {
    if (!clockEnabled || !clockState || isGameOver || isReplayMode || !clockState.running) return;
    const next = applyElapsed(clockState, Date.now());
    if (next.activeColor === 'w' && next.whiteRemainingMs === 0) {
      setClockState({ ...next, running: false, lastTickAt: undefined });
      resign('w');
      if (!timeoutAlertShownRef.current) {
        window.alert(`Temps écoulé pour Blanc. ${gameInfo.black} gagne.`);
        timeoutAlertShownRef.current = true;
      }
      return;
    }
    if (next.activeColor === 'b' && next.blackRemainingMs === 0) {
      setClockState({ ...next, running: false, lastTickAt: undefined });
      resign('b');
      if (!timeoutAlertShownRef.current) {
        window.alert(`Temps écoulé pour Noir. ${gameInfo.white} gagne.`);
        timeoutAlertShownRef.current = true;
      }
      return;
    }
    if (next !== clockState) setClockState(next);
  }, [clockEnabled, clockState, isGameOver, isReplayMode, resign]);

  useEffect(() => {
    const wasGameOver = prevIsGameOverRef.current;
    prevIsGameOverRef.current = isGameOver;
    if (clockEnabled && clockState?.started && !isReplayMode && wasGameOver && !isGameOver) {
      timeoutAlertShownRef.current = false;
      setClockState((s) =>
        s
          ? {
              ...s,
              running: true,
              lastTickAt: Date.now(),
              activeColor: displayTurn,
            }
          : s,
      );
    }
  }, [clockEnabled, clockState?.started, displayTurn, isGameOver, isReplayMode]);

  useEffect(() => {
    if (!clockEnabled || !clockState || isGameOver || isReplayMode) return;
    const prev = prevMoveCountRef.current;
    const nextCount = moves.length;
    if (nextCount < prev) {
      prevMoveCountRef.current = nextCount;
      return;
    }
    if (nextCount <= prev) {
      prevMoveCountRef.current = nextCount;
      return;
    }
    const now = Date.now();
    if (!clockState.started) {
      setClockState({
        ...clockState,
        started: true,
        running: true,
        activeColor: displayTurn,
        lastTickAt: now,
      });
      prevMoveCountRef.current = nextCount;
      return;
    }
    let next = applyElapsed(clockState, now);
    const mover = displayTurn === 'w' ? 'b' : 'w';
    const incrementMs = (initialGame.clockConfig?.incrementSeconds ?? 0) * 1000;
    if (mover === 'w') {
      next = {
        ...next,
        whiteRemainingMs: next.whiteRemainingMs + incrementMs,
      };
    } else {
      next = {
        ...next,
        blackRemainingMs: next.blackRemainingMs + incrementMs,
      };
    }
    setClockState({
      ...next,
      running: true,
      activeColor: displayTurn,
      lastTickAt: now,
    });
    timeoutAlertShownRef.current = false;
    prevMoveCountRef.current = nextCount;
  }, [clockEnabled, clockState, displayTurn, initialGame.clockConfig?.incrementSeconds, isGameOver, isReplayMode, moves.length]);

  const displayClock = useMemo(() => {
    if (!clockEnabled || !clockState) return undefined;
    const nowState = applyElapsed(clockState, clockNow);
    return {
      whiteMs: nowState.whiteRemainingMs,
      blackMs: nowState.blackRemainingMs,
      activeColor: nowState.running ? nowState.activeColor : undefined,
      started: nowState.started,
    };
  }, [clockEnabled, clockState, clockNow]);

  const canToggleClock =
    clockEnabled &&
    !!clockState &&
    clockState.started &&
    !isGameOver &&
    !isReplayMode;

  const toggleClockRunning = useCallback(() => {
    if (!clockState || !canToggleClock) return;
    if (clockState.running) {
      const now = Date.now();
      const next = applyElapsed(clockState, now);
      setClockState({
        ...next,
        running: false,
        lastTickAt: undefined,
      });
      return;
    }
    setClockState({
      ...clockState,
      running: true,
      lastTickAt: Date.now(),
    });
  }, [clockState, canToggleClock]);

  const save = useCallback(() => {
    const snapshot = JSON.stringify({ moves, result, clockState });
    if (snapshot === prevSaveRef.current) return;
    prevSaveRef.current = snapshot;
    saveGame({
      ...initialGame,
      moves,
      result,
      pgn,
      clockState,
      updatedAt: Date.now(),
    });
  }, [initialGame, moves, result, pgn, clockState]);

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
            {displayClock && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div
                    className={`rounded-lg border px-3 py-2 text-center ${
                      displayClock.whiteMs === 0
                        ? 'border-red-500 bg-red-500/20 text-red-500'
                        : displayClock.activeColor === 'w'
                        ? 'border-(--color-primary) bg-(--color-primary)/10 text-(--color-primary)'
                        : 'border-(--color-border) bg-(--color-surface-alt)/50 text-(--color-text)'
                    }`}
                  >
                    <div className="text-[11px] uppercase tracking-wide text-(--color-text-muted)">Blanc</div>
                    <div className="text-xl font-semibold tabular-nums">{formatClock(displayClock.whiteMs)}</div>
                  </div>
                  <div
                    className={`rounded-lg border px-3 py-2 text-center ${
                      displayClock.blackMs === 0
                        ? 'border-red-500 bg-red-500/20 text-red-500'
                        : displayClock.activeColor === 'b'
                        ? 'border-(--color-primary) bg-(--color-primary)/10 text-(--color-primary)'
                        : 'border-(--color-border) bg-(--color-surface-alt)/50 text-(--color-text)'
                    }`}
                  >
                    <div className="text-[11px] uppercase tracking-wide text-(--color-text-muted)">Noir</div>
                    <div className="text-xl font-semibold tabular-nums">{formatClock(displayClock.blackMs)}</div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="secondary"
                    className="px-3 py-1.5 text-xs"
                    onClick={toggleClockRunning}
                    disabled={!canToggleClock}
                  >
                    {clockState?.running ? 'Pause horloge' : 'Reprendre horloge'}
                  </Button>
                </div>
              </div>
            )}
            {displayClock && (displayClock.whiteMs === 0 || displayClock.blackMs === 0) && (
              <div className="rounded-lg border border-red-500 bg-red-500/15 px-3 py-2 text-sm font-semibold text-red-500">
                {displayClock.whiteMs === 0
                  ? `Temps écoulé pour Blanc - ${gameInfo.black} gagne.`
                  : `Temps écoulé pour Noir - ${gameInfo.white} gagne.`}
              </div>
            )}
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

          <div className="flex min-w-0 flex-col gap-2">
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
