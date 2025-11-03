// src/features/auth/services/authService.js
import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'https://reflexoperu-v3.marketingmedico.vip/backend/public/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false, // Cambiado a false para evitar el error de CORS
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Interceptor para agregar token a cada petición
api.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  // Registrar usuario
  register: async (userData) => {
    const response = await api.post('/register', userData);
    return response.data;
  },

  // Iniciar sesión
  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    if (response.data.token) {
      // Guardar token en cookies (expira en 7 días)
      Cookies.set('auth_token', response.data.token, { 
        expires: 7,
        secure: true,
        sameSite: 'strict'
      });
    }
    return response.data;
  },

  // Cerrar sesión
  logout: async () => {
    try {
      await api.delete('/logout');
    } finally {
      Cookies.remove('auth_token');
    }
  },

  // Verificar si hay token
  isAuthenticated: () => {
    return !!Cookies.get('auth_token');
  }
};