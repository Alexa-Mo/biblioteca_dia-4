// src/features/profile/services/profileService.js
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

api.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const profileService = {
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  }
};