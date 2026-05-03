import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Chess } from 'chess.js';

import type { Game, GameResult } from '../types/game';
import { buildPgn } from '../services/pgn';

export type BoardPiece = 'wP' | 'wB' | 'wN' | 'wR' | 'wQ' | 'wK' | 'bP' | 'bB' | 'bN' | 'bR' | 'bQ' | 'bK';

function capturedFromHistory(chess: Chess): { byWhite: BoardPiece[]; byBlack: BoardPiece[] } {
  const byWhite: BoardPiece[] = [];
  const byBlack: BoardPiece[] = [];
  const toPiece = (color: 'w' | 'b', t: string): BoardPiece => {
    const u = (t === 'p' ? 'P' : t.toUpperCase()) as 'P' | 'N' | 'B' | 'R' | 'Q';
    return `${color}${u}` as BoardPiece;
  };
  for (const m of chess.history({ verbose: true })) {
    if (!m.captured) continue;
    const victimColor: 'w' | 'b' = m.color === 'w' ? 'b' : 'w';
    const pc = toPiece(victimColor, m.captured);
    if (m.color === 'w') byWhite.push(pc);
    else byBlack.push(pc);
  }
  return { byWhite, byBlack };
}

function sortCaptured(pieces: BoardPiece[]): BoardPiece[] {
  const order: Record<string, number> = { Q: 0, R: 1, B: 2, N: 3, P: 4 };
  return [...pieces].sort((a, b) => (order[a[1]] ?? 9) - (order[b[1]] ?? 9));
}

function chessAfterPlies(moveSans: string[], ply: number): Chess {
  const c = new Chess();
  const n = Math.min(ply, moveSans.length);
  for (let i = 0; i < n; i++) {
    c.move(moveSans[i]);
  }
  return c;
}

function findKingSquare(chess: Chess, color: 'w' | 'b'): string | undefined {
  const board = chess.board();
  const files = 'abcdefgh';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.type === 'k' && p.color === color) {
        return `${files[c]}${8 - r}`;
      }
    }
  }
  return undefined;
}

type ChessGameState = {
  fen: string;
  moves: string[];
  pgn: string;
  turn: 'w' | 'b';
  isGameOver: boolean;
  result: GameResult;
  canUndoLastMove: boolean;
  canRevertManualResult: boolean;
  gameInfo: Pick<Game, 'id' | 'name' | 'white' | 'black' | 'date'>;
  isCheck: boolean;
  kingInCheckSquare: string | undefined;
  capturedByWhite: BoardPiece[];
  capturedByBlack: BoardPiece[];
  getMoveHints: (square: string | null) => { destinations: string[]; captureSquares: Set<string> };
  attemptMove: (from: string, to: string) => boolean;
  isPawnPromotionTarget: (from: string, to: string) => boolean;
  completePromotion: (from: string, to: string, promotion: 'q' | 'r' | 'n' | 'b') => boolean;
  applyPieceDrop: (from: string, to: string, droppedPieceId: string) => boolean;
  boardFen: string;
  replayPly: number;
  isReplayMode: boolean;
  replayGoFirst: () => void;
  replayGoPrev: () => void;
  replayGoNext: () => void;
  replayGoLast: () => void;
  displayTurn: 'w' | 'b';
  displayIsGameOver: boolean;
};

type ChessGameActions = {
  makeMove: (from: string, to: string, promotion?: string) => boolean;
  undoLastMove: () => void;
  revertManualResult: () => void;
  resign: (color: 'w' | 'b') => void;
  declareDraw: () => void;
};

export function useChessGame(initialGame: Game): ChessGameState & ChessGameActions {
  const chessRef = useRef<Chess>(new Chess());
  const [, forceRender] = useState(0);
  const [result, setResult] = useState<GameResult>(initialGame.result);
  const [replayPly, setReplayPly] = useState(() => initialGame.moves.length);
  const prevMoveCountRef = useRef(initialGame.moves.length);
  const gameInfo = useMemo(
    () => ({
      id: initialGame.id,
      name: initialGame.name,
      white: initialGame.white,
      black: initialGame.black,
      date: initialGame.date,
    }),
    [initialGame.id, initialGame.name, initialGame.white, initialGame.black, initialGame.date],
  );

  const initDone = useRef(false);
  const initGameIdRef = useRef(initialGame.id);
  if (!initDone.current || initGameIdRef.current !== initialGame.id) {
    const chess = new Chess();
    for (const move of initialGame.moves) {
      chess.move(move);
    }
    chessRef.current = chess;
    initDone.current = true;
    initGameIdRef.current = initialGame.id;
    setReplayPly(initialGame.moves.length);
    prevMoveCountRef.current = initialGame.moves.length;
  }

  const rerender = useCallback(() => forceRender((n) => n + 1), []);

  const chess = chessRef.current;

  const moveSansKey = chess.history().join('\x1e');
  const moveCount = chess.history().length;

  useEffect(() => {
    const prev = prevMoveCountRef.current;
    const next = moveCount;
    if (next > prev) {
      setReplayPly((p) => (p >= prev ? next : p));
    } else if (next < prev) {
      setReplayPly((p) => Math.min(p, next));
    }
    prevMoveCountRef.current = next;
  }, [moveCount, moveSansKey]);

  const moveSansList = useMemo(() => chess.history(), [chess, moveSansKey]);

  const viewChess = useMemo(
    () => chessAfterPlies(moveSansList, replayPly),
    [moveSansList, replayPly],
  );

  const isReplayMode = replayPly < moveCount;

  const replayGoFirst = useCallback(() => setReplayPly(0), []);
  const replayGoPrev = useCallback(() => setReplayPly((p) => Math.max(0, p - 1)), []);
  const replayGoNext = useCallback(
    () => setReplayPly((p) => Math.min(moveCount, p + 1)),
    [moveCount],
  );
  const replayGoLast = useCallback(() => setReplayPly(moveCount), [moveCount]);

  function computeResult(): GameResult {
    if (!chess.isGameOver()) return result;
    if (chess.isCheckmate()) return chess.turn() === 'w' ? '0-1' : '1-0';
    return '1/2-1/2';
  }

  function currentPgn(): string {
    const r = computeResult();
    return buildPgn({
      ...gameInfo,
      result: r,
      moves: chess.history(),
    });
  }

  const isGameOver = chess.isGameOver() || result !== '*';
  const displayIsGameOver =
    isReplayMode
      ? viewChess.isGameOver()
      : isGameOver;

  const isCheck =
    !displayIsGameOver && viewChess.isCheck();
  const sideToMove = viewChess.turn();
  const kingInCheckSquare =
    isCheck ? findKingSquare(viewChess, sideToMove) : undefined;

  const { byWhite, byBlack } = useMemo(
    () => capturedFromHistory(viewChess),
    [viewChess, moveSansKey, replayPly],
  );

  const getMoveHints = useCallback(
    (square: string | null): { destinations: string[]; captureSquares: Set<string> } => {
      if (!square || isGameOver || isReplayMode) return { destinations: [], captureSquares: new Set() };
      try {
        const sq = square as Parameters<Chess['get']>[0];
        const piece = chess.get(sq);
        if (!piece || piece.color !== chess.turn()) {
          return { destinations: [], captureSquares: new Set() };
        }
        const verbose = chess.moves({ square: sq, verbose: true });
        const captureSquares = new Set<string>();
        for (const m of verbose) {
          if (m.isCapture()) captureSquares.add(m.to);
        }
        return {
          destinations: verbose.map((m) => m.to),
          captureSquares,
        };
      } catch {
        return { destinations: [], captureSquares: new Set() };
      }
    },
    [chess, isGameOver, isReplayMode, moveCount],
  );

  const makeMoveInternal = useCallback(
    (from: string, to: string, promotion?: string): boolean => {
      if (isGameOver || isReplayMode) return false;
      try {
        const moveArg =
          promotion !== undefined
            ? ({ from, to, promotion } as const)
            : ({ from, to } as const);
        const move = chess.move(moveArg);
        if (!move) return false;
        if (chess.isGameOver()) {
          const newResult = chess.isCheckmate()
            ? chess.turn() === 'w' ? '0-1' : '1-0'
            : '1/2-1/2';
          setResult(newResult);
        }
        rerender();
        return true;
      } catch {
        return false;
      }
    },
    [chess, isGameOver, isReplayMode, rerender],
  );

  const isPawnPromotionTarget = useCallback(
    (from: string, to: string): boolean => {
      if (isGameOver || isReplayMode) return false;
      const sqFrom = from as Parameters<Chess['get']>[0];
      const piece = chess.get(sqFrom);
      if (!piece || piece.type !== 'p' || piece.color !== chess.turn()) return false;
      const verbose = chess.moves({ square: sqFrom, verbose: true });
      return verbose.some((m) => m.to === to && m.promotion != null);
    },
    [chess, isGameOver, isReplayMode, moveCount],
  );

  const attemptMove = useCallback(
    (from: string, to: string): boolean => {
      const sqFrom = from as Parameters<Chess['get']>[0];
      const piece = chess.get(sqFrom);
      if (!piece) return false;
      const lastRank = piece.color === 'w' ? '8' : '1';
      if (piece.type === 'p' && to[1] === lastRank) return false;
      return makeMoveInternal(from, to, undefined);
    },
    [chess, makeMoveInternal],
  );

  const completePromotion = useCallback(
    (from: string, to: string, promotion: 'q' | 'r' | 'n' | 'b'): boolean =>
      makeMoveInternal(from, to, promotion),
    [makeMoveInternal],
  );

  const applyPieceDrop = useCallback(
    (from: string, to: string, droppedPieceId: string): boolean => {
      const sqFrom = from as Parameters<Chess['get']>[0];
      const moving = chess.get(sqFrom);
      if (!moving) return false;
      const lastRank = moving.color === 'w' ? '8' : '1';
      if (moving.type === 'p' && to[1] === lastRank) {
        const letter = droppedPieceId[1];
        const map: Record<string, 'q' | 'r' | 'n' | 'b'> = {
          Q: 'q',
          R: 'r',
          N: 'n',
          B: 'b',
        };
        const p = map[letter];
        if (p) return makeMoveInternal(from, to, p);
        return false;
      }
      return makeMoveInternal(from, to, undefined);
    },
    [chess, makeMoveInternal],
  );

  const makeMove = useCallback(
    (from: string, to: string, promotion?: string): boolean =>
      makeMoveInternal(from, to, promotion),
    [makeMoveInternal],
  );

  const undoLastMove = useCallback(() => {
    if (isReplayMode) return;
    const c = chessRef.current;
    if (c.history().length === 0) return;
    c.undo();
    if (!c.isGameOver()) {
      setResult('*');
    } else if (c.isCheckmate()) {
      setResult(c.turn() === 'w' ? '0-1' : '1-0');
    } else {
      setResult('1/2-1/2');
    }
    rerender();
  }, [isReplayMode, rerender]);

  const revertManualResult = useCallback(() => {
    if (isReplayMode) return;
    const c = chessRef.current;
    if (c.isGameOver()) return;
    setResult('*');
    rerender();
  }, [isReplayMode, rerender]);

  const resign = useCallback(
    (color: 'w' | 'b') => {
      if (isGameOver) return;
      setResult(color === 'w' ? '0-1' : '1-0');
      rerender();
    },
    [isGameOver, rerender],
  );

  const declareDraw = useCallback(() => {
    if (isGameOver) return;
    setResult('1/2-1/2');
    rerender();
  }, [isGameOver, rerender]);

  const displayTurn = viewChess.turn() as 'w' | 'b';
  const boardFen = viewChess.fen();

  return {
    fen: boardFen,
    boardFen,
    moves: chess.history(),
    pgn: currentPgn(),
    turn: chess.turn() as 'w' | 'b',
    displayTurn,
    isGameOver,
    displayIsGameOver,
    result: computeResult(),
    canUndoLastMove: !isReplayMode && chess.history().length > 0,
    canRevertManualResult: !isReplayMode && result !== '*' && !chess.isGameOver(),
    gameInfo,
    isCheck,
    kingInCheckSquare,
    capturedByWhite: sortCaptured(byWhite),
    capturedByBlack: sortCaptured(byBlack),
    getMoveHints,
    attemptMove,
    isPawnPromotionTarget,
    completePromotion,
    applyPieceDrop,
    makeMove,
    undoLastMove,
    revertManualResult,
    resign,
    declareDraw,
    replayPly,
    isReplayMode,
    replayGoFirst,
    replayGoPrev,
    replayGoNext,
    replayGoLast,
  };
}
