````txt
You are a senior frontend engineer with strong product sense.

Build a production-quality chess game recorder web app that runs entirely as a static site (GitHub Pages compatible).

---

## 🧱 Tech Stack

- React + TypeScript
- Vite
- No backend (100% frontend)
- Libraries:
  - chess.js (game logic, legal moves, PGN generation)
  - react-chessboard (or equivalent) for UI

---

## 🎯 Product Goal

Users can:
- Create a chess game
- Play or reproduce moves on an interactive board
- Automatically generate a valid PGN
- Store games locally (localStorage)
- Share/export PGN easily (mobile-friendly)

---

## 🧩 Core Features

### 1. Game Creation

Provide a clean UI (modal or page) with:
- Game name (Event)
- White player name
- Black player name

On submit:
- Create a new game
- Generate:
  - unique ID (UUID)
  - current date (YYYY.MM.DD)

---

### 2. Game Data Model

Use BOTH a structured object and PGN.

#### Internal model:
```ts
type Game = {
  id: string;
  name: string;
  white: string;
  black: string;
  date: string;
  moves: string[];
  pgn: string;
};
````

#### PGN requirements:

Generate valid PGN with headers:

- Event
- White
- Black
- Date
- Result (default "\*")
- Custom field:

  - GameId (UUID)

Example:

```
[Event "My Game"]
[White "Alice"]
[Black "Bob"]
[Date "2026.04.09"]
[Result "*"]
[GameId "uuid-123"]

1. e4 e5 2. Nf3 *
```

---

### 3. Chessboard

- Interactive board (drag & drop)
- Only allow legal moves (via chess.js)
- Track move history
- Display move list
- Allow undo last move

---

### 4. PGN Panel

- Live-updating PGN
- Display in read-only textarea

Buttons:

- Copy to clipboard
- Share (navigator.share API for mobile)
- Send via email (mailto with encoded PGN)

---

### 5. Local Storage

- Store games in localStorage under key: "chess-games"

Each stored game includes:

- id
- name
- players
- date
- pgn

Features:

- List all saved games
- Load a game
- Delete a game

(MVP: no edit required)

---

### 6. UI / UX

- Mobile-first design

- Clean modern UI

- Responsive layout (mobile + desktop)

- Suggested layout:

  - Top: game info (players, date)
  - Middle: chessboard
  - Bottom: moves + PGN + actions

- Keep UI minimal but polished

---

### 7. Architecture

Use clean component structure:

- App
- GameForm
- ChessBoard
- MoveList
- PGNPanel
- GameList

Separate logic:

- PGN utility generator
- localStorage service

---

### 8. Sharing Features

Implement all:

1. Copy PGN (clipboard API)
2. Native share (navigator.share)
3. Email:

   - mailto link
   - subject = game name
   - body = PGN

---

### 9. Deployment (IMPORTANT)

Ensure compatibility with GitHub Pages:

- Configure Vite base path if needed
- Provide clear steps:

  - npm install
  - npm run dev
  - npm run build
  - deploy to GitHub Pages

---

### 10. Bonus (if easy)

- Auto-save current game to localStorage
- Resume last game
- Smooth UI interactions

---

## ✅ Output Requirements

- Clean, well-structured code
- Fully working app (no pseudo-code)
- Clear folder structure
- Ready to run locally
- Ready to deploy on GitHub Pages

Focus on:

- Simplicity
- Maintainability
- Good UX (especially mobile)

Do not over-engineer, but keep code professional and scalable.

```