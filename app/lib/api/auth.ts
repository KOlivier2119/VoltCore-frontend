import api from '../api';
import { AuthResponse, LoginRequest, RegisterRequest, UserDTO } from '../types';

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<void> => {
    await api.post('/auth/register', data);
  },

  getProfile: async (): Promise<UserDTO> => {
    const response = await api.get<UserDTO>('/auth/profile');
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
    const response = await api.post<{ token: string }>('/auth/refresh-token', { refreshToken });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  }
}; 