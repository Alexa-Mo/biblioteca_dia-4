// src/components/BackendFallback.jsx
import { useAuth } from '../features/auth/hooks/useAuth';

export const BackendFallback = ({ children }) => {
  const { user } = useAuth();

  // Si no hay datos reales del usuario pero estamos autenticados, mostrar advertencia
  if (user && (!user.id || user.name === 'Usuario')) {
    return (
      <div className="backend-fallback">
        <div className="fallback-warning">
          <div className="warning-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="warning-content">
            <h3>Modo de demostración</h3>
            <p>El servidor de autenticación no está disponible. Estás usando datos de demostración.</p>
          </div>
        </div>
        {children}
      </div>
    );
  }

  return children;
};