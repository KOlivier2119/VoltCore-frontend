'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { UserDTO } from '../lib/types';
import api, { setAuthHeader, clearAuthHeader } from '../lib/api';

interface AuthContextType {
  user: UserDTO | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserDTO | null>(null);

  const login = async (username: string, password: string) => {
    try {
      setAuthHeader(username, password);
      const response = await api.post<UserDTO>('/users/login', { username, password });
      setUser(response.data);
    } catch (error) {
      clearAuthHeader();
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    clearAuthHeader();
  };

  const isAdmin = () => user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
