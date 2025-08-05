/**
 * Cliente Axios configurado para las peticiones de autenticación.
 * Define la URL base y los headers para el servicio de auth.
 */

import axios from 'axios';

export const axiosServiceAuth = axios.create({
  baseURL: 'http://localhost:3001/auth',
  headers: {
    'Content-Type': 'application/json',
  },
});  