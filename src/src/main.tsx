import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner@2.0.3';
import App from '../App';
import '../styles/globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster position="top-right" richColors />
  </StrictMode>
);
