import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type Value = {
  blackAtBottom: boolean;
  setBlackAtBottom: (value: boolean) => void;
};

const GameBoardOrientationContext = createContext<Value | null>(null);

export function GameBoardOrientationProvider({ children }: { children: ReactNode }) {
  const [blackAtBottom, setBlackAtBottom] = useState(false);
  const value = useMemo(
    () => ({ blackAtBottom, setBlackAtBottom }),
    [blackAtBottom],
  );
  return (
    <GameBoardOrientationContext.Provider value={value}>
      {children}
    </GameBoardOrientationContext.Provider>
  );
}

export function useGameBoardOrientation(): Value {
  const ctx = useContext(GameBoardOrientationContext);
  if (!ctx) {
    throw new Error('useGameBoardOrientation must be used within GameBoardOrientationProvider');
  }
  return ctx;
}
