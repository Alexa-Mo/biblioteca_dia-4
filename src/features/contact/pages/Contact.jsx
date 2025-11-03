// src/features/contact/pages/Contact.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { useContactForm } from '../hooks/useContactForm';
import { contactApi, syncOfflineQueue, getOfflineQueue } from '../api/contactApi';
import TextField from '../components/TextField';
import { TextArea } from '../components/TextArea';
import { StatsPanel } from '../components/StatsPanel';
import '../styles/contact.css';

export const Contact = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [offlineQueue, setOfflineQueue] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useContactForm();

  // Monitorear cola offline
  useEffect(() => {
    const updateQueue = () => {
      setOfflineQueue(getOfflineQueue().length);
    };

    updateQueue();
    const interval = setInterval(updateQueue, 3000);

    return () => clearInterval(interval);
  }, []);

  const onSubmit = async (data) => {
    setSubmitStatus(null);
    const idempotencyKey = crypto.randomUUID();

    // Validación manual con resumen de campos faltantes
    const fieldLabels = {
      name: 'Nombre Completo',
      email: 'Correo Electrónico',
      bookTitle: 'Título del Libro',
      requestType: 'Tipo de Solicitud',
      message: 'Descripción (mínimo 10 caracteres)',
      consent: 'Aceptar términos y condiciones'
    };

    const missing = [];
    if (!data.name) missing.push(fieldLabels.name);
    if (!data.email) missing.push(fieldLabels.email);
    if (!data.bookTitle) missing.push(fieldLabels.bookTitle);
    if (!data.requestType) missing.push(fieldLabels.requestType);
    if (!data.message || data.message.length < 10) missing.push(fieldLabels.message);
    if (!data.consent) missing.push(fieldLabels.consent);

    if (missing.length > 0) {
      setSubmitStatus({
        type: 'error',
        message: `Faltan campos obligatorios: ${missing.join(', ')}`
      });
      return;
    }

    try {
      await contactApi.sendContact(data, idempotencyKey);
      setSubmitStatus({ type: 'success', message: 'Solicitud enviada correctamente' });
      reset();
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: error.message || 'Error al enviar la solicitud' 
      });
    }
  };

  const handleSyncQueue = async () => {
    const syncedCount = await syncOfflineQueue();
    if (syncedCount > 0) {
      setSubmitStatus({ 
        type: 'success', 
        message: `${syncedCount} solicitud(es) sincronizada(s)` 
      });
    }
  };

  // Para evitar el warning del ref, extraemos las props de register manualmente
  const nameField = register('name', { required: true });
  const emailField = register('email', { required: true });
  const bookTitleField = register('bookTitle', { required: true });
  const authorField = register('author');
  const requestTypeField = register('requestType', { required: true });
  const messageField = register('message', { required: true, minLength: 10 });
  const urgencyField = register('urgency');
  const consentField = register('consent', { required: true });

  // La validez se muestra con errores por campo y un resumen; no bloqueamos el envío

  return (
    <div className="contact-container">
      {/* Header */}
      <header className="contact-header">
        <div className="contact-header-content">
          <div className="contact-title-section">
            <Link to="/blog" className="back-link">
              <svg className="back-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver a la Biblioteca
            </Link>
            <div className="title-content">
              <h1>Servicio de Biblioteca</h1>
              <p>Solicita libros, haz recomendaciones o reporta problemas</p>
            </div>
          </div>

          {/* Menú de usuario (mismo que en Blog) */}
          <div className="user-menu-wrapper">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="user-menu-button"
            >
              <div className="user-avatar-small">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span>{user?.name || 'Usuario'}</span>
            </button>

            {isMenuOpen && (
              <div className="user-dropdown-menu">
                <Link to="/profile" className="dropdown-item">
                  <svg className="dropdown-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Mi Perfil
                </Link>
                <Link to="/blog" className="dropdown-item">
                  <svg className="dropdown-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Biblioteca
                </Link>
                <div className="dropdown-divider"></div>
                <button onClick={logout} className="dropdown-item logout-item">
                  <svg className="dropdown-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="contact-content">
        {/* Panel de estadísticas */}
        <div className="stats-section">
          <StatsPanel />
          
          {offlineQueue > 0 && (
            <div className="offline-notice">
              <div className="offline-alert">
                <svg className="offline-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="offline-content">
                  <strong>{offlineQueue} solicitud(es) en cola offline</strong>
                  <p>Se enviarán automáticamente cuando se recupere la conexión</p>
                </div>
                <button onClick={handleSyncQueue} className="sync-button">
                  Sincronizar Ahora
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Formulario de contacto */}
        <div className="form-section">
          <div className="form-card">
            <div className="form-header">
              <h2>Solicitud de Servicio de Biblioteca</h2>
              <p>¿Necesitas un libro específico? ¿Tienes una sugerencia? ¡Estamos aquí para ayudarte!</p>
            </div>

            {submitStatus && (
              <div className={`submit-status ${submitStatus.type}`}>
                {submitStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
              <div className="section-header">
                <h3 className="section-title">Información Personal</h3>
                <p className="section-desc">Cuéntanos quién eres para poder contactar contigo.</p>
              </div>

              <div className="form-grid">
                <TextField
                  label="Nombre Completo"
                  id="name"
                  type="text"
                  placeholder="Ingresa tu nombre completo"
                  error={errors.name && 'El nombre es obligatorio'}
                  required
                  name={nameField.name}
                  ref={nameField.ref}
                  onChange={nameField.onChange}
                  onBlur={nameField.onBlur}
                />

                <TextField
                  label="Correo Electrónico"
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  error={errors.email && 'El email es obligatorio'}
                  required
                  name={emailField.name}
                  ref={emailField.ref}
                  onChange={emailField.onChange}
                  onBlur={emailField.onBlur}
                />
              </div>

              <div className="section-header">
                <h3 className="section-title">Detalles del Libro</h3>
                <p className="section-desc">Ayúdanos a identificar el libro que necesitas.</p>
              </div>

              <div className="form-grid">
                <TextField
                  label="Título del Libro"
                  id="bookTitle"
                  type="text"
                  placeholder="Ej: Cien años de soledad"
                  error={errors.bookTitle && 'El título del libro es obligatorio'}
                  required
                  name={bookTitleField.name}
                  ref={bookTitleField.ref}
                  onChange={bookTitleField.onChange}
                  onBlur={bookTitleField.onBlur}
                />

                <TextField
                  label="Autor"
                  id="author"
                  type="text"
                  placeholder="Ej: Gabriel García Márquez"
                  error={errors.author?.message}
                  name={authorField.name}
                  ref={authorField.ref}
                  onChange={authorField.onChange}
                  onBlur={authorField.onBlur}
                />
              </div>

              <div className="section-header">
                <h3 className="section-title">Tipo de Solicitud</h3>
                <p className="section-desc">Selecciona el motivo de tu solicitud.</p>
              </div>

              <div className="form-field">
                <label className="form-label">Tipo de Solicitud <span className="required-asterisk">*</span></label>
                <select 
                  className={`form-select ${errors.requestType ? 'error' : ''}`}
                  name={requestTypeField.name}
                  ref={requestTypeField.ref}
                  onChange={requestTypeField.onChange}
                  onBlur={requestTypeField.onBlur}
                  defaultValue=""
                >
                  <option value="">Selecciona el tipo de solicitud</option>
                  <option value="book-request">Solicitud de libro nuevo</option>
                  <option value="book-recommendation">Recomendación de libro</option>
                  <option value="book-report">Reportar problema con libro</option>
                  <option value="general-query">Consulta general</option>
                  <option value="technical-support">Soporte técnico</option>
                </select>
                {errors.requestType && (
                  <div className="form-error">Selecciona el tipo de solicitud</div>
                )}
              </div>

              <div className="section-header">
                <h3 className="section-title">Descripción</h3>
                <p className="section-desc">Describe con el mayor detalle posible para una mejor atención.</p>
              </div>

              <TextArea
                label="Descripción Detallada"
                id="message"
                placeholder="Describe tu solicitud en detalle. Incluye información como: género literario, año de publicación, ISBN (si lo conoces), o cualquier detalle que nos ayude a localizar el libro..."
                error={errors.message && 'La descripción es obligatoria (mínimo 10 caracteres)'}
                required
                maxLength={2000}
                rows={6}
                name={messageField.name}
                ref={messageField.ref}
                onChange={(e) => {
                  const customEvent = {
                    ...e,
                    target: {
                      ...e.target,
                      name: 'message',
                      value: e.target.value
                    }
                  };
                  messageField.onChange(customEvent);
                }}
                onBlur={messageField.onBlur}
                value={watch('message') || ''}
              />

              <div className="section-header">
                <h3 className="section-title">Preferencias</h3>
                <p className="section-desc">Indica la urgencia con la que necesitas respuesta.</p>
              </div>

              <div className="form-field">
                <label className="form-label">Urgencia de la Solicitud</label>
                <div className="urgency-options">
                  <label className="urgency-option">
                    <input 
                      type="radio" 
                      name={urgencyField.name}
                      ref={urgencyField.ref}
                      onChange={urgencyField.onChange}
                      onBlur={urgencyField.onBlur}
                      value="low"
                    />
                    <span className="radio-custom"></span>
                    <div className="urgency-info">
                      <strong>Baja</strong>
                      <span>Cuando tengas tiempo</span>
                    </div>
                  </label>
                  
                  <label className="urgency-option">
                    <input 
                      type="radio" 
                      name={urgencyField.name}
                      ref={urgencyField.ref}
                      onChange={urgencyField.onChange}
                      onBlur={urgencyField.onBlur}
                      value="normal"
                      defaultChecked
                    />
                    <span className="radio-custom"></span>
                    <div className="urgency-info">
                      <strong>Normal</strong>
                      <span>En los próximos días</span>
                    </div>
                  </label>
                  
                  <label className="urgency-option">
                    <input 
                      type="radio" 
                      name={urgencyField.name}
                      ref={urgencyField.ref}
                      onChange={urgencyField.onChange}
                      onBlur={urgencyField.onBlur}
                      value="high"
                    />
                    <span className="radio-custom"></span>
                    <div className="urgency-info">
                      <strong>Alta</strong>
                      <span>Lo necesito pronto</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="section-header">
                <h3 className="section-title">Consentimiento</h3>
                <p className="section-desc">Necesitamos tu autorización para enviarte actualizaciones.</p>
              </div>

              <div className="checkbox-field">
                <label className="checkbox-label">
                  <input 
                    type="checkbox"
                    name={consentField.name}
                    ref={consentField.ref}
                    onChange={consentField.onChange}
                    onBlur={consentField.onBlur}
                    className="checkbox-input"
                  />
                  <span className="checkbox-custom"></span>
                  Acepto recibir notificaciones sobre el estado de mi solicitud y la política de privacidad
                </label>
                {errors.consent && (
                  <div className="form-error" role="alert">
                    Debes aceptar los términos y condiciones
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="submit-button"
              >
                {isSubmitting ? (
                  <>
                    <div className="button-spinner"></div>
                    Enviando Solicitud...
                  </>
                ) : (
                  <>
                    <svg className="submit-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Enviar Solicitud
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};