import { useEffect, useRef } from 'react';

type Props = {
  moves: string[];
};

export function MoveList({ moves }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [moves.length]);

  if (moves.length === 0) {
    return (
      <div className="rounded-lg border border-(--color-border) bg-(--color-surface-alt) p-4 text-center text-sm text-(--color-text-muted)">
        Aucun coup joué
      </div>
    );
  }

  const pairs: { num: number; white: string; black?: string }[] = [];
  for (let i = 0; i < moves.length; i += 2) {
    pairs.push({
      num: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1],
    });
  }

  return (
    <div className="max-h-48 overflow-y-auto rounded-lg border border-(--color-border) bg-(--color-surface-alt) p-3">
      <div className="grid grid-cols-[2.5rem_1fr_1fr] gap-y-0.5 text-sm font-mono">
        {pairs.map((p) => (
          <div key={p.num} className="contents">
            <span className="text-(--color-text-muted)">{p.num}.</span>
            <span className="text-(--color-text) font-medium">{p.white}</span>
            <span className="text-(--color-text)">{p.black ?? ''}</span>
          </div>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
