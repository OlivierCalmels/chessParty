const STORAGE_KEY = 'chess-party-player-names';

/** Noms proposés par défaut (ordre affiché). */
export const DEFAULT_PLAYER_NAMES = ['Olivier', 'Loïc', 'Adrian', 'Johann', 'Hedy'] as const;

const defaultNameSet = new Set<string>([...DEFAULT_PLAYER_NAMES]);

function readCustom(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((x): x is string => typeof x === 'string')
      .map((x) => x.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function writeCustom(names: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(names));
}

/** Liste pour `<datalist>` : défauts d’abord, puis noms personnalisés (sans doublons). */
export function getPlayerNameOptions(): string[] {
  const custom = readCustom();
  const out: string[] = [...DEFAULT_PLAYER_NAMES];
  const seen = new Set<string>([...DEFAULT_PLAYER_NAMES]);
  for (const n of custom) {
    if (!seen.has(n)) {
      seen.add(n);
      out.push(n);
    }
  }
  return out;
}

/** Enregistre un nom saisi (hors liste par défaut) pour les prochaines parties. */
export function rememberPlayerName(name: string): void {
  const t = name.trim();
  if (!t) return;
  if (defaultNameSet.has(t)) return;

  const custom = readCustom();
  const without = custom.filter((x) => x !== t);
  const next = [t, ...without].slice(0, 40);
  writeCustom(next);
}
