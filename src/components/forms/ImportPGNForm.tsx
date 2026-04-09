import { type FormEvent, useState } from 'react';

import { Button } from '../ui/Button';

type Props = {
  onSubmit: (pgn: string) => void;
  error?: string;
};

export function ImportPGNForm({ onSubmit, error }: Props) {
  const [pgn, setPgn] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!pgn.trim()) return;
    onSubmit(pgn.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="pgn-input" className="mb-1 block text-sm font-medium text-(--color-text)">
          Collez votre PGN
        </label>
        <textarea
          id="pgn-input"
          value={pgn}
          onChange={(e) => setPgn(e.target.value)}
          rows={12}
          placeholder={'[Event "My Game"]\n[White "Alice"]\n[Black "Bob"]\n\n1. e4 e5 2. Nf3 *'}
          className="w-full resize-y rounded-lg border border-(--color-border) bg-(--color-surface) p-3 font-mono text-sm text-(--color-text) placeholder:text-(--color-text-muted) focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary)"
        />
      </div>
      {error && (
        <p className="rounded-lg bg-(--color-danger)/10 px-3 py-2 text-sm text-(--color-danger)">
          {error}
        </p>
      )}
      <Button type="submit" className="w-full">
        Importer
      </Button>
    </form>
  );
}
