import axios from 'axios'; 
 
export const axiosServiceAuth = axios.create({ 
  baseURL: 'http://localhost:3001/auth',
  headers: { 
    'Content-Type': 'application/json', 
  }, 
});  