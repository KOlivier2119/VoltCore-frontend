import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/api', // Fixed /api/api to /api
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Support CORS with Basic Auth
});

// Set Basic Auth header
export function setAuthHeader(username: string, password: string) {
  api.defaults.headers.common['Authorization'] = `Basic ${btoa(`${username}:${password}`)}`;
}

// Clear Basic Auth header
export function clearAuthHeader() {
  delete api.defaults.headers.common['Authorization'];
}

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      clearAuthHeader();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;