// src/features/auth/pages/Login.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/Login.css';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Efecto para las partículas del fondo con nuevas animaciones
  useEffect(() => {
    const createParticles = () => {
      const particlesContainer = document.querySelector('.login-particles');
      if (!particlesContainer) return;

      // Limpiar partículas existentes
      particlesContainer.innerHTML = '';

      const particleCount = 12;
      const shapes = ['circle', 'square', 'triangle'];
      
      // Crear nuevas partículas con animaciones mejoradas
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'login-particle spiral-float';
        
        const size = Math.random() * 8 + 3;
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 10 + 8;
        const animationDelay = Math.random() * 5;
        const opacity = Math.random() * 0.5 + 0.3;
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.animationDuration = `${animationDuration}s`;
        particle.style.animationDelay = `${animationDelay}s`;
        particle.style.opacity = opacity;
        
        // Colores aleatorios dentro de la paleta azul-verde
        const hue = Math.random() * 60 + 190; // Entre 190-250 (azules)
        const saturation = Math.random() * 30 + 70; // 70-100%
        const lightness = Math.random() * 20 + 60; // 60-80%
        particle.style.background = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        
        // Diferentes formas
        if (shape === 'square') {
          particle.style.borderRadius = '4px';
        } else if (shape === 'triangle') {
          particle.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
          particle.style.background = 'transparent';
          particle.style.borderBottom = `${size}px solid hsl(${hue}, ${saturation}%, ${lightness}%)`;
          particle.style.borderLeft = `${size/2}px solid transparent`;
          particle.style.borderRight = `${size/2}px solid transparent`;
          particle.style.width = '0';
          particle.style.height = '0';
        }
        
        particlesContainer.appendChild(particle);
      }
    };

    createParticles();
    const interval = setInterval(createParticles, 15000);

    return () => clearInterval(interval);
  }, []);

  // Efecto para animación de entrada escalonada
  useEffect(() => {
    const elements = document.querySelectorAll('.animate-on-load');
    elements.forEach((element, index) => {
      element.style.animationDelay = `${index * 0.1}s`;
    });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Agregar efecto de ripple al botón
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple-effect');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);

    const result = await login(formData);
    
    if (result.success) {
      // Animación de salida antes de navegar
      const loginCard = document.querySelector('.login-card');
      if (loginCard) {
        loginCard.style.animation = 'scaleIn 0.5s ease-in-out reverse forwards';
        setTimeout(() => navigate('/blog'), 300);
      } else {
        navigate('/blog');
      }
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="login-container">
      {/* Partículas de fondo con nuevas animaciones */}
      <div className="login-particles"></div>
      
      <div className="login-card scale-in">
        <div className="login-header">
          <div className="login-icon animate-on-load">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="login-title animate-on-load">Bienvenido de nuevo</h2>
          <p className="login-subtitle animate-on-load">Inicia sesión para continuar</p>
        </div>

        {error && (
          <div className="error-message slide-in-left">
            <svg className="error-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group animate-on-load">
            <label htmlFor="email" className="form-label">
              Correo Electrónico
            </label>
            <div className="form-input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="tu@email.com"
              />
              <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
          </div>

          <div className="form-group animate-on-load">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <div className="form-input-wrapper">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="••••••••"
              />
              <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-submit-button animate-on-load"
          >
            {loading && <span className="loading-spinner"></span>}
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="login-footer animate-on-load">
          <p className="login-footer-text">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="login-footer-link">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};