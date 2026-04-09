/** Affiche la date PGN (YYYY.MM.DD) et l'heure locale de création de la partie. */
export function gameStartLabel(date: string, createdAt?: number): string {
  if (createdAt == null || !Number.isFinite(createdAt)) return date;
  const time = new Date(createdAt).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${date} · ${time}`;
}
