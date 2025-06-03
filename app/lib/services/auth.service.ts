import api from '../api';
import { AuthResponse, LoginRequest, RegisterRequest, UserDTO } from '../types';

class AuthService {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  }

  async register(data: RegisterRequest): Promise<void> {
    await api.post('/auth/register', data);
  }

  async getProfile(): Promise<UserDTO> {
    const response = await api.get<UserDTO>('/auth/profile');
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    const response = await api.post<{ token: string }>('/auth/refresh-token', { refreshToken });
    return response.data;
  }

  async logout(): Promise<void> {
    //await api.post('/auth/logout');
    localStorage.removeItem("token");
  }
}

export const authService = new AuthService(); 