import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

export const setAuthHeader = (username: string, password: string) => {
  api.defaults.headers.common['Authorization'] = `Basic ${btoa(`${username}:${password}`)}`;
};

export const clearAuthHeader = () => {
  delete api.defaults.headers.common['Authorization'];
};

export default api;