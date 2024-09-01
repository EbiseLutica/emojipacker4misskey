import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

let el = document.getElementById('root');

if (!el) {
  el = document.createElement('div');
  el.id = 'root';
  document.body.appendChild(el);
}

createRoot(el).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
