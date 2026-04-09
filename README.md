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

Le workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) construit `dist/` et publie sur Pages à chaque push sur `main`.

1. **Settings → Pages → Build and deployment**
2. **Source : GitHub Actions** (pas « Deploy from a branch »). Si la racine du dépôt est publiée, le `index.html` Vite pointe vers `/src/main.tsx` : la page reste blanche en production.
3. Après le premier déploiement réussi, le site est sur [https://oliviercalmels.github.io/chessParty/](https://oliviercalmels.github.io/chessParty/)

## Stack technique

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router v7
- chess.js (logique échecs)
- react-chessboard (UI échiquier)
