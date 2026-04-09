import { Link } from 'react-router-dom';

import { HeaderOptionsMenu } from './HeaderOptionsMenu';

type Props = {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
};

export function Header({ theme, onToggleTheme }: Props) {
  return (
    <header className="border-b border-(--color-border) bg-(--color-surface)">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="text-lg font-bold tracking-tight text-(--color-text) no-underline">
          ChessParty
        </Link>
        <HeaderOptionsMenu theme={theme} onToggleTheme={onToggleTheme} />
      </div>
    </header>
  );
}
