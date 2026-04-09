import { useMemo, useState } from "react";

import {
  buildPgnEmailSubject,
  copyToClipboard,
  DEFAULT_PGN_EMAIL_TO,
  mailtoLink,
  nativeShare,
} from "../../services/share";
import { Button } from "../ui/Button";

type Props = {
  pgn: string;
  gameName: string;
  date: string;
  white: string;
  black: string;
  /** Mise en page resserrée sous le plateau (enregistrement). */
  nearBoard?: boolean;
};

export function PGNPanel({
  pgn,
  gameName,
  date,
  white,
  black,
  nearBoard,
}: Props) {
  const [copied, setCopied] = useState(false);

  const emailHref = useMemo(() => {
    const subject = buildPgnEmailSubject({ date, gameName, white, black });
    return mailtoLink(DEFAULT_PGN_EMAIL_TO, subject, pgn);
  }, [date, gameName, white, black, pgn]);

  async function handleCopy() {
    const ok = await copyToClipboard(pgn);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleShare() {
    await nativeShare(gameName, pgn);
  }

  const canShare = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <div className={nearBoard ? "space-y-1.5" : "space-y-2"}>
      <h3
        className={`font-semibold text-(--color-text) ${
          nearBoard
            ? "text-xs uppercase tracking-wide text-(--color-text-muted)"
            : "text-sm"
        }`}
      >
        PGN
      </h3>
      <textarea
        readOnly
        value={pgn}
        rows={nearBoard ? 4 : 5}
        className={`w-full resize-y rounded-lg border border-(--color-border) bg-(--color-surface-alt) font-mono text-(--color-text) focus:outline-none ${
          nearBoard
            ? "min-h-18 p-2 text-[11px] leading-snug"
            : "p-3 text-xs"
        }`}
      />
      <div className={`flex flex-wrap ${nearBoard ? "gap-1.5" : "gap-2"}`}>
        <Button
          variant="secondary"
          className={nearBoard ? "px-3 py-1.5 text-xs" : ""}
          onClick={handleCopy}
        >
          {copied ? "Copié !" : "Copier"}
        </Button>
        {canShare && (
          <Button
            variant="secondary"
            className={nearBoard ? "px-3 py-1.5 text-xs" : ""}
            onClick={handleShare}
          >
            Partager
          </Button>
        )}
        <a
          href={emailHref}
          className={`inline-flex items-center justify-center gap-2 rounded-lg bg-(--color-surface-alt) font-medium text-(--color-text) transition-colors hover:bg-(--color-border) no-underline ${
            nearBoard ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
          }`}
        >
          Email
        </a>
      </div>
    </div>
  );
}
