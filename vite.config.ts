import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** Racine locale en dev ; sous-chemin du dépôt sur GitHub Pages. */
const pagesBase = '/chessParty/'

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  base: command === 'serve' ? '/' : pagesBase,
}))
