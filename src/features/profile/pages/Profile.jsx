// src/features/profile/pages/Profile.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import '../styles/profile.css';

export const Profile = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Cargando perfil...</div>
        </div>
      </div>
    );
  }

  // Obtener iniciales para el avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        {/* Header del perfil */}
        <div className="profile-header">
          <div className="header-content">
            <div className="header-title">
              <h1>Mi Perfil</h1>
              <p className="header-subtitle">Información personal y configuración de cuenta</p>
            </div>
            <div className="header-actions">
              <Link to="/blog" className="back-button">
                <svg className="back-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver al Blog
              </Link>
              <button onClick={handleLogout} className="logout-button">
                <svg className="logout-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        {/* Tarjeta principal de usuario */}
        <div className="user-profile-card">
          <div className="profile-avatar-section">
            <div className="avatar-container">
              <div className="user-avatar">
                {getInitials(user.name)}
              </div>
              <div className="avatar-status"></div>
            </div>
            <div className="user-info">
              <h2 className="user-name">{user.name}</h2>
              <p className="user-username">@{user.user_name}</p>
              <p className="user-email">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Grid de información */}
        <div className="profile-grid">
          {/* Información Personal */}
          <div className="info-card">
            <div className="card-header">
              <svg className="card-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 className="card-title">Información Personal</h3>
            </div>
            <div className="card-content">
              <div className="info-row">
                <div className="info-label">Nombre Completo</div>
                <div className="info-value">{user.name}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Nombre de Usuario</div>
                <div className="info-value">@{user.user_name}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Correo Electrónico</div>
                <div className="info-value">{user.email}</div>
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="info-card">
            <div className="card-header">
              <svg className="card-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <h3 className="card-title">Información de Contacto</h3>
            </div>
            <div className="card-content">
              <div className="info-row">
                <div className="info-label">Teléfono</div>
                <div className="info-value">{user.phone || 'No especificado'}</div>
              </div>
              <div className="info-row">
                <div className="info-label">País</div>
                <div className="info-value">{user.country?.name || 'No especificado'}</div>
              </div>
            </div>
          </div>

          {/* Información del Sistema */}
          <div className="info-card">
            <div className="card-header">
              <svg className="card-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="card-title">Información del Sistema</h3>
            </div>
            <div className="card-content">
              <div className="info-row">
                <div className="info-label">Rol en el Sistema</div>
                <div className="info-value role-badge">{user.role?.name || 'Usuario'}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Estado de la Cuenta</div>
                <div className="info-value status-active">
                  <span className="status-dot"></span>
                  Activa
                </div>
              </div>
              <div className="info-row">
                <div className="info-label">Último Acceso</div>
                <div className="info-value">{new Date().toLocaleDateString('es-ES')}</div>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};