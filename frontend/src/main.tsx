// =============================================================
// main.tsx
// Ponto de partida do app: pega a <div id="root"> do index.html
// e desenha o componente <App /> dentro dela.
// =============================================================

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
