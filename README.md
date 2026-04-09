# Chess Party

Enregistreur de parties d'échecs — application web statique (React + TypeScript + Vite).

## Fonctionnalités

- Créer et enregistrer des parties d'échecs interactives
- Drag & drop sur un échiquier avec validation des coups légaux
- Génération automatique de PGN valide
- Import de PGN existant
- Annulation des 2 derniers coups (undo/replace)
- Fin de partie : détection auto (mat, pat) + abandon/nulle manuels
- Stockage local (localStorage)
- Partage : copier, partager (mobile), email
- Mode sombre / clair
- Mobile-first, responsive

## Développement

```bash
npm install
npm run dev
```

Ouvre http://localhost:5173/chessParty/

## Build

```bash
npm run build
```

Le dossier `dist/` contient le site statique prêt à déployer.

## Déploiement GitHub Pages

1. Pusher le code sur GitHub
2. Dans Settings > Pages, choisir "GitHub Actions" comme source
3. Créer `.github/workflows/deploy.yml` :

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

Le site sera disponible sur `https://<username>.github.io/chessParty/`

## Stack technique

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router v7
- chess.js (logique échecs)
- react-chessboard (UI échiquier)
