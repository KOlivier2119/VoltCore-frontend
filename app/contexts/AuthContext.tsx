"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserDTO, RegisterRequest } from "@/app/lib/types";
import { authService } from "@/app/lib/services";

interface AuthContextType {
  user: UserDTO | null;
  login: (username: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // No token-based session check for Basic Auth
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await authService.login({ username, password });
      const userData: UserDTO = response.user; // Extract user from AuthResponse
      setUser(userData);
      localStorage.setItem("token", response.token); // Store token in localStorage
      console.log(response.token)
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed";
      throw new Error(message);
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      await authService.register(data);
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed";
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error: any) {
      const message = error.response?.data?.message || "Logout failed";
      console.error(message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}