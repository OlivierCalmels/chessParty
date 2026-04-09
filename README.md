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

Le workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) construit `dist/` et met à jour la branche **`gh-pages`** à chaque push sur `main`.

1. **Settings → Pages → Build and deployment**
2. **Source : Deploy from a branch**
3. **Branch : `gh-pages`** / dossier **`/` (root)** — pas `main` : la racine de `main` contient le template Vite (`/src/main.tsx`), ce qui donne une page blanche si tu la publies telle quelle.
4. Site : [https://oliviercalmels.github.io/chessParty/](https://oliviercalmels.github.io/chessParty/)

## Stack technique

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router v7
- chess.js (logique échecs)
- react-chessboard (UI échiquier)
