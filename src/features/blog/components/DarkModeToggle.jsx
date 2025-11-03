// src/features/blog/components/DarkModeToggle.jsx
import { useState, useEffect } from 'react';

// Función para obtener el estado actual del modo oscuro (solo lectura)
const getCurrentDarkMode = () => {
  if (typeof document !== 'undefined') {
    // Primero verificar si el body ya tiene la clase 'dark'
    if (document.body.classList.contains('dark')) {
      return true;
    }
    // Si no, verificar localStorage
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      return savedTheme === 'true';
    }
  }
  return false;
};

// Función para actualizar la clase 'dark' en el body
const updateBodyClass = (dark) => {
  if (typeof document !== 'undefined') {
    if (dark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }
};

export const DarkModeToggle = ({ onToggle }) => {
  // Inicializar el estado leyendo SOLO el estado actual del body (sin modificar nada)
  const [isDark, setIsDark] = useState(() => {
    // Solo leer el estado actual del body, NO aplicar ningún cambio
    if (typeof document !== 'undefined') {
      return document.body.classList.contains('dark');
    }
    return false;
  });

  // Este useEffect solo escucha cambios en localStorage de otras pestañas
  // NO modifica el estado al montar el componente
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'darkMode') {
        const newValue = e.newValue === 'true';
        setIsDark(newValue);
        updateBodyClass(newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Función para alternar el modo oscuro
  const toggleDarkMode = () => {
    const newDarkState = !isDark;
    setIsDark(newDarkState);
    updateBodyClass(newDarkState);
    
    // Guardar preferencia en localStorage
    localStorage.setItem('darkMode', newDarkState.toString());
    
    // Llamar al callback si existe
    if (onToggle) {
      onToggle(newDarkState);
    }
  };

  return (
    <button 
      onClick={toggleDarkMode}
      className="dropdown-item dark-mode-toggle"
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
    >
      <svg 
        className="dropdown-icon" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        {isDark ? (
          // Icono de sol (modo claro)
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
          />
        ) : (
          // Icono de luna (modo oscuro)
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
          />
        )}
      </svg>
      <span>{isDark ? 'Modo Claro' : 'Modo Oscuro'}</span>
    </button>
  );
};

