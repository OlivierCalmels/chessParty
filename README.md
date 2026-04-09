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

Il faut **Node 20.19+ ou 22.12+** (Vite 8). Vérifie avec `node -v`. Si `npm run dev` plante avec `Unexpected token '??='`, c’est presque toujours un **Node trop ancien** encore prioritaire dans le PATH (hors nvm).

Avec **nvm** : `nvm install` (lit [`.nvmrc`](.nvmrc)), puis `nvm use`, puis :

```bash
npm install
npm run dev
```

Les lignes `npm WARN optional SKIPPING OPTIONAL DEPENDENCY` pour d’autres OS/arch sont **normales** : npm n’installe que le binding natif qui correspond à ta machine.

En local, ouvre **http://localhost:5173/** (le build de prod utilise le préfixe `/chessParty/` pour GitHub Pages ; pour tester ce build : `npm run preview`, puis **http://localhost:4173/chessParty/**).

## Build

```bash
npm run build
```

Le dossier `dist/` contient le site statique prêt à déployer.

## Déploiement GitHub Pages

Le workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) exécute `npm run build`, puis publie le dossier **`dist/`** via l’artefact officiel Pages (`upload-pages-artifact` + `deploy-pages`).

1. **Settings → Pages → Build and deployment → Source : GitHub Actions** (comme sur ta capture).
2. Avec cette source, **seul** ce workflow alimente le site. Ne pas publier la racine de **`main`** (le `index.html` Vite pointe vers `/src/main.tsx` → page blanche).
3. Après un push sur `main`, vérifie l’onglet **Actions** : le workflow **Deploy to GitHub Pages** doit être vert. Tu peux aussi le relancer à la main (**Run workflow**).
4. Site : [https://oliviercalmels.github.io/chessParty/](https://oliviercalmels.github.io/chessParty/)

## Stack technique

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router v7
- chess.js (logique échecs)
- react-chessboard (UI échiquier)
