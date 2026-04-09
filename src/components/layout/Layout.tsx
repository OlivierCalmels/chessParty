import { Outlet } from 'react-router-dom';

import { GameBoardOrientationProvider } from '../../context/GameBoardOrientationContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { useTheme } from '../../hooks/useTheme';
import { Header } from './Header';

export function Layout() {
  const { theme, toggleTheme } = useTheme();

  return (
    <ThemeProvider value={theme}>
      <GameBoardOrientationProvider>
        <div className="flex min-h-dvh flex-col">
          <Header theme={theme} onToggleTheme={toggleTheme} />
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
            <Outlet />
          </main>
        </div>
      </GameBoardOrientationProvider>
    </ThemeProvider>
  );
}
