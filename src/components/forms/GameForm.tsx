import { type FormEvent, useState } from 'react';

import type { GameClockConfig } from '../../types/game';
import { Button } from '../ui/Button';

type Props = {
  onSubmit: (data: {
    name: string;
    white: string;
    black: string;
    clockConfig: GameClockConfig;
  }) => void;
};

export function GameForm({ onSubmit }: Props) {
  const [name, setName] = useState('');
  const [white, setWhite] = useState('');
  const [black, setBlack] = useState('');
  const [clockEnabled, setClockEnabled] = useState(false);
  const [baseMinutes, setBaseMinutes] = useState<GameClockConfig['baseMinutes']>(5);
  const [incrementSeconds, setIncrementSeconds] = useState<GameClockConfig['incrementSeconds']>(0);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!white.trim() || !black.trim()) return;
    onSubmit({
      name: name.trim(),
      white: white.trim(),
      black: black.trim(),
      clockConfig: {
        enabled: clockEnabled,
        baseMinutes,
        incrementSeconds,
      },
    });
  }

  const inputClass =
    'w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm text-(--color-text) placeholder:text-(--color-text-muted) focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary)';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3 rounded-lg border border-(--color-border) bg-(--color-surface-alt)/50 p-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-(--color-text)">
          <input
            type="checkbox"
            checked={clockEnabled}
            onChange={(e) => setClockEnabled(e.target.checked)}
            className="h-4 w-4 rounded border-(--color-border) text-(--color-primary) focus:ring-(--color-primary)"
          />
          Mode horloge
        </label>
        {clockEnabled && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="clock-base" className="mb-1 block text-xs font-medium text-(--color-text-muted)">
                Temps initial
              </label>
              <select
                id="clock-base"
                value={baseMinutes}
                onChange={(e) => setBaseMinutes(Number(e.target.value) as GameClockConfig['baseMinutes'])}
                className={inputClass}
              >
                <option value={3}>3 min</option>
                <option value={5}>5 min</option>
                <option value={10}>10 min</option>
              </select>
            </div>
            <div>
              <label htmlFor="clock-inc" className="mb-1 block text-xs font-medium text-(--color-text-muted)">
                Incrément
              </label>
              <select
                id="clock-inc"
                value={incrementSeconds}
                onChange={(e) =>
                  setIncrementSeconds(Number(e.target.value) as GameClockConfig['incrementSeconds'])
                }
                className={inputClass}
              >
                <option value={0}>0 sec</option>
                <option value={2}>2 sec</option>
                <option value={5}>5 sec</option>
                <option value={10}>10 sec</option>
              </select>
            </div>
          </div>
        )}
      </div>
      <div>
        <label htmlFor="white-player" className="mb-1 block text-sm font-medium text-(--color-text)">
          Joueur Blancs
        </label>
        <input
          id="white-player"
          type="text"
          value={white}
          onChange={(e) => setWhite(e.target.value)}
          placeholder="Nom du joueur"
          className={inputClass}
          required
        />
      </div>
      <div>
        <label htmlFor="black-player" className="mb-1 block text-sm font-medium text-(--color-text)">
          Joueur Noirs
        </label>
        <input
          id="black-player"
          type="text"
          value={black}
          onChange={(e) => setBlack(e.target.value)}
          placeholder="Nom du joueur"
          className={inputClass}
          required
        />
      </div>
      <div>
        <label htmlFor="game-name" className="mb-1 block text-sm font-medium text-(--color-text)">
          Nom de la partie (optionnel)
        </label>
        <input
          id="game-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Si vide: YYYY.MM.DD_HH:mm:ss-Blanc-Noir"
          className={inputClass}
          autoComplete="off"
        />
      </div>
      <Button type="submit" className="w-full">
        Commencer la partie
      </Button>
    </form>
  );
}
