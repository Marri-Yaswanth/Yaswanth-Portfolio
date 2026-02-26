import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { PortfolioProvider } from './context/PortfolioContext';
import { ToastProvider } from './components/Toast';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <PortfolioProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </PortfolioProvider>
    </BrowserRouter>
  </StrictMode>
);
