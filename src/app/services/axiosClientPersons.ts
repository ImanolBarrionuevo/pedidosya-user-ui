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
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config; 
}, 
(error) => { 
return Promise.reject(error); 
} 
); 