import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Layout } from './components/layout/Layout';
import { GamePage } from './pages/GamePage';
import { HomePage } from './pages/HomePage';
import { ImportPage } from './pages/ImportPage';
import { NewGamePage } from './pages/NewGamePage';

function routerBasename(): string | undefined {
  const base = import.meta.env.BASE_URL
  const trimmed = base.endsWith('/') ? base.slice(0, -1) : base
  return trimmed === '' ? undefined : trimmed
}

export default function App() {
  return (
    <BrowserRouter basename={routerBasename()}>
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
