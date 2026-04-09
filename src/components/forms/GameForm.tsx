import { type FormEvent, useState } from 'react';

import { Button } from '../ui/Button';

type Props = {
  onSubmit: (data: { name: string; white: string; black: string }) => void;
};

export function GameForm({ onSubmit }: Props) {
  const [name, setName] = useState('');
  const [white, setWhite] = useState('');
  const [black, setBlack] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !white.trim() || !black.trim()) return;
    onSubmit({ name: name.trim(), white: white.trim(), black: black.trim() });
  }

  const inputClass =
    'w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm text-(--color-text) placeholder:text-(--color-text-muted) focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary)';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="game-name" className="mb-1 block text-sm font-medium text-(--color-text)">
          Nom de la partie
        </label>
        <input
          id="game-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Partie amicale"
          className={inputClass}
          required
        />
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
      <Button type="submit" className="w-full">
        Commencer la partie
      </Button>
    </form>
  );
}
