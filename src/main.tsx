/// <reference types="vite/client" />
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Using relative path to work with GH Pages subdirectories
    navigator.serviceWorker.register("./service-worker.js");
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
