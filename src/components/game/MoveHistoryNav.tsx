import { useEffect, useRef, useState } from 'react';

import { Button } from '../ui/Button';

type Props = {
  replayPly: number;
  totalPlies: number;
  onFirst: () => void;
  onPrev: () => void;
  onNext: () => void;
  onLast: () => void;
  className?: string;
};

function PlayIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

export function MoveHistoryNav({
  replayPly,
  totalPlies,
  onFirst,
  onPrev,
  onNext,
  onLast,
  className,
}: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const onNextRef = useRef(onNext);
  onNextRef.current = onNext;

  const atStart = replayPly <= 0;
  const atEnd = totalPlies === 0 || replayPly >= totalPlies;

  useEffect(() => {
    if (atEnd) setIsPlaying(false);
  }, [atEnd]);

  useEffect(() => {
    if (!isPlaying || atEnd) return;
    const id = window.setInterval(() => {
      onNextRef.current();
    }, 1000);
    return () => window.clearInterval(id);
  }, [isPlaying, atEnd]);

  function togglePlay() {
    if (atEnd) return;
    setIsPlaying((p) => !p);
  }

  const navBtn =
    'min-w-[2.25rem] px-2 py-1.5 text-sm font-semibold tabular-nums';

  return (
    <div className={`flex flex-col items-end gap-1 ${className ?? ''}`}>
      <span className="sr-only">
        Relecture : {totalPlies === 0 ? 'aucun demi-coup' : `${replayPly} sur ${totalPlies} demi-coups`}
      </span>
      <div className="flex flex-wrap items-center justify-end gap-1">
        <Button
          type="button"
          variant="secondary"
          className={navBtn}
          aria-label="Début de la partie"
          title="Début (<<)"
          onClick={() => {
            setIsPlaying(false);
            onFirst();
          }}
          disabled={atStart}
        >
          {'<<'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className={navBtn}
          aria-label="Demi-coup précédent"
          title="Précédent (<)"
          onClick={() => {
            setIsPlaying(false);
            onPrev();
          }}
          disabled={atStart}
        >
          {'<'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className={`${navBtn} min-w-11`}
          aria-label={isPlaying ? 'Pause' : 'Lecture — un demi-coup par seconde'}
          title={isPlaying ? 'Pause' : 'Lecture (1 demi-coup / s)'}
          onClick={togglePlay}
          disabled={atEnd}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className={navBtn}
          aria-label="Demi-coup suivant"
          title="Suivant (>)"
          onClick={() => {
            setIsPlaying(false);
            onNext();
          }}
          disabled={atEnd}
        >
          {'>'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className={navBtn}
          aria-label="Fin de la partie enregistrée"
          title="Fin (>>)"
          onClick={() => {
            setIsPlaying(false);
            onLast();
          }}
          disabled={atEnd}
        >
          {'>>'}
        </Button>
      </div>
    </div>
  );
}
