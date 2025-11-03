// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.jsx';
import './index.css';

// Inicializar el modo oscuro una sola vez al cargar la aplicación
// Solo si hay un valor guardado previamente
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('darkMode');
  if (savedTheme === 'true') {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  
      <App />
    
  </React.StrictMode>
);