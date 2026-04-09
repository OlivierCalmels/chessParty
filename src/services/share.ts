/** Destinataire par défaut pour l’envoi du PGN par email (mailto). */
export const DEFAULT_PGN_EMAIL_TO = 'calmelo@hotmail.fr';

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export async function nativeShare(title: string, text: string): Promise<boolean> {
  if (!navigator.share) return false;
  try {
    await navigator.share({ title, text });
    return true;
  } catch {
    return false;
  }
}

export function buildPgnEmailSubject(params: {
  date: string;
  gameName: string;
  white: string;
  black: string;
}): string {
  const { date, gameName, white, black } = params;
  return `chessParty - ${date} - ${gameName} - ${white} vs ${black}`;
}

/**
 * Lien mailto avec destinataire, objet et corps préremplis.
 * Le navigateur ouvre le client mail de l’utilisateur : un clic « Envoyer » reste nécessaire (pas d’envoi direct sans serveur).
 */
export function mailtoLink(to: string, subject: string, body: string): string {
  const q = new URLSearchParams({ subject, body });
  return `mailto:${to}?${q.toString()}`;
}
