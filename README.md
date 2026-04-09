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

**Node.js 20.19+ ou 22.12+** (requis par Vite 8).

```bash
npm install
npm run dev
```

Ouvre [http://localhost:5173/](http://localhost:5173/) — en dev, l’app est servie à la racine. Le build de production utilise le préfixe `/chessParty/` pour GitHub Pages ; pour le tester en local : `npm run preview`, puis [http://localhost:4173/chessParty/](http://localhost:4173/chessParty/).

## Build

```bash
npm run build
```

Le dossier `dist/` contient le site statique prêt à déployer.

## Déploiement (GitHub Pages)

À chaque push sur `main`, le workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) build le projet et publie `dist/` via GitHub Actions.

Dans le dépôt : **Settings → Pages → Source : GitHub Actions**.

Site : [https://oliviercalmels.github.io/chessParty/](https://oliviercalmels.github.io/chessParty/)

## Stack technique

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router v7
- chess.js (logique échecs)
- react-chessboard (UI échiquier)
