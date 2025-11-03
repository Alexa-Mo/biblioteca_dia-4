// src/features/blog/api/blogApi.js
import axios from "axios";

// API de Google Books
export const api = axios.create({
  baseURL: "https://www.googleapis.com/books/v1",
});

// Simular errores aleatorios para testing
const simulateRandomError = () => {
  if (Math.random() < 0.1) { // 10% de probabilidad de error
    throw new Error("Falla simulada del servicio");
  }
};

export const blogApi = {
  // Obtener libros (posts) - usando la API de Google Books
  getPosts: async (query = "javascript") => {
    simulateRandomError();
    const response = await api.get(`/volumes?q=${query}&maxResults=20`);
    return response.data.items || [];
  },

  // Obtener libro por ID
  getPostById: async (id) => {
    simulateRandomError();
    const response = await api.get(`/volumes/${id}`);
    return response.data;
  },

  // Buscar libros por término
  searchPosts: async (searchTerm, page = 1) => {
    simulateRandomError();
    const startIndex = (page - 1) * 10;
    const response = await api.get(`/volumes?q=${searchTerm}&startIndex=${startIndex}&maxResults=10`);
    return response.data;
  },

  // Obtener libros por categoría
  getPostsByCategory: async (category) => {
    simulateRandomError();
    const response = await api.get(`/volumes?q=subject:${category}&maxResults=20`);
    return response.data.items || [];
  }
};