import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useGameBoardOrientation } from '../../context/GameBoardOrientationContext';

type Props = {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
};

function GearIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden>
      <path
        fillRule="evenodd"
        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function HeaderOptionsMenu({ theme, onToggleTheme }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const isGamePage = /^\/game\/.+/.test(pathname);

  const { blackAtBottom, setBlackAtBottom } = useGameBoardOrientation();

  useEffect(() => {
    if (!open) return;
    function onDocMouseDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocMouseDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="rounded-lg p-2 text-(--color-text) transition-colors hover:bg-(--color-surface-alt)"
        aria-label="Options"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <GearIcon />
      </button>
      {open && (
        <div
          className="absolute right-0 z-50 mt-1 w-[min(100vw-2rem,16rem)] rounded-xl border border-(--color-border) bg-(--color-surface) py-2 shadow-lg"
          role="menu"
        >
          {isGamePage && (
            <>
              <label
                className="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-(--color-text) hover:bg-(--color-surface-alt)"
                role="menuitemcheckbox"
                aria-checked={blackAtBottom}
              >
                <input
                  type="checkbox"
                  className="size-4 shrink-0 rounded border-(--color-border) accent-(--color-primary)"
                  checked={blackAtBottom}
                  onChange={(e) => setBlackAtBottom(e.target.checked)}
                />
                Tourner l&apos;échiquier
              </label>
              <div className="my-1 border-t border-(--color-border)" role="separator" />
            </>
          )}
          <div
            className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm text-(--color-text)"
            role="menuitem"
          >
            <span id="opt-theme-label">Mode sombre</span>
            <button
              type="button"
              role="switch"
              aria-labelledby="opt-theme-label"
              aria-checked={theme === 'dark'}
              onClick={onToggleTheme}
              className={`relative inline-flex h-7 w-12 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary) ${
                theme === 'dark' ? 'bg-(--color-primary)' : 'bg-(--color-border)'
              }`}
            >
              <span
                className={`pointer-events-none absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow transition-transform ${
                  theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
