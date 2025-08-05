/**
 * Cliente Axios configurado para las peticiones relacionadas con "Persons".
 * Define la URL base y los headers.
 * Incluye un interceptor para agregar el token de autenticación a cada request.
 */

import axios from 'axios';

export const axiosServicePersons = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a cada request 
axiosServicePersons.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Agrega el token al header si existe
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Manejo de errores en la request
  }
); 