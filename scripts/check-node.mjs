/**
 * Same minimum as Vite 8: 20.19+, 22.12+, or newer major.
 * Fails fast when an old system Node (e.g. 14) is still on PATH.
 *
 * On macOS, node_modules installed with Rosetta (x64 Node) lacks
 * @rolldown/binding-darwin-arm64 and breaks under native arm64 Node (and the opposite).
 */
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

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

function checkRolldownBinding() {
  if (process.platform !== 'darwin') return;
  if (process.arch !== 'arm64' && process.arch !== 'x64') return;
  const pkg = `@rolldown/binding-darwin-${process.arch}`;
  try {
    require.resolve(`${pkg}/package.json`);
  } catch {
    console.error(
      `[chess-party] Module natif Rolldown absent : ${pkg}\n` +
        `  Souvent : npm install a été fait avec l’autre arch Node (x64 Rosetta vs arm64 natif).\n` +
        `  Corriger :\n` +
        `    rm -rf node_modules && npm install\n` +
        `  puis vérifie : node -p "process.arch" (même arch pour install et pour npm run dev).\n`,
    );
    process.exit(1);
  }
}

checkRolldownBinding();
