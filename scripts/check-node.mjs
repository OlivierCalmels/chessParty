/**
 * Same minimum as Vite 8: 20.19+, 22.12+, or newer major.
 * Fails fast when an old system Node (e.g. 14) is still on PATH.
 */
const [major, minor] = process.version
  .slice(1)
  .split('.')
  .map((s) => parseInt(s, 10));

const ok =
  (major === 20 && minor >= 19) ||
  (major === 22 && minor >= 12) ||
  major > 22;

if (!ok) {
  console.error(
    `[chess-party] Node ${process.version} is not supported. Vite 8 needs Node 20.19+, 22.12+, or newer.\n` +
      `\n  Use Node from this repo:  nvm install && nvm use  (see .nvmrc)\n` +
      `  Check:  node -v\n`,
  );
  process.exit(1);
}
