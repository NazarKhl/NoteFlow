import axios from 'axios';
import { getToken } from './auth'; // Importowanie funkcji getToken z auth.ts

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Zamień na URL swojego backendu
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
