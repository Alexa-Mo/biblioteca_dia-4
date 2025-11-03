// src/features/auth/pages/Register.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/Register.css';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    document_number: '',
    name: '',
    paternal_lastname: '',
    maternal_lastname: '',
    email: '',
    phone: '',
    user_name: '',
    password: '',
    last_session: new Date().toISOString().split('T')[0],
    account_statement: true,
    document_type_id: 1,
    country_id: 179
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(formData);
    
    if (result.success) {
      alert('Registro exitoso. Por favor inicia sesión.');
      navigate('/login');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1 className="register-title">Crear Cuenta</h1>
          <p className="register-subtitle">Únete a nuestra comunidad</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                Número de Documento
              </label>
              <input
                type="text"
                name="document_number"
                value={formData.document_number}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Número de documento"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Nombre
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Tu nombre"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Apellido Paterno
              </label>
              <input
                type="text"
                name="paternal_lastname"
                value={formData.paternal_lastname}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Apellido paterno"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Apellido Materno
              </label>
              <input
                type="text"
                name="maternal_lastname"
                value={formData.maternal_lastname}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Apellido materno"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="ejemplo@correo.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Teléfono
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Número de teléfono"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Nombre de Usuario
              </label>
              <input
                type="text"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Nombre de usuario"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className="form-input"
                placeholder="Mínimo 8 caracteres"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="register-button"
          >
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="register-footer">
          <p>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="login-link">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};