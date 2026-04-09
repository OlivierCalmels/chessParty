import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Layout } from './components/layout/Layout';
import { GamePage } from './pages/GamePage';
import { HomePage } from './pages/HomePage';
import { ImportPage } from './pages/ImportPage';
import { NewGamePage } from './pages/NewGamePage';

export default function App() {
  return (
    <BrowserRouter basename="/chessParty">
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="new" element={<NewGamePage />} />
          <Route path="game/:id" element={<GamePage />} />
          <Route path="import" element={<ImportPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
