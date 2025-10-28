import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Seed development data (only in DEV mode)
if (import.meta.env.DEV) {
  import('./utils/devData').then(({ seedStores }) => {
    seedStores();
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
