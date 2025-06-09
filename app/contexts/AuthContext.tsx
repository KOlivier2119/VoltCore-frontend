"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserDTO, RegisterRequest } from "@/app/lib/types";
import { authService } from "@/app/lib/services";
import api from "@/app/lib/api";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

interface AuthContextType {
  user: UserDTO | null;
  login: (username: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Always read the token from localStorage on mount and on every route change
  useEffect(() => {
    const restoreUser = async () => {
      setIsLoading(true); // Start loading
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
          // Temporarily comment out profile fetch while backend is being fixed
          // const userData = await authService.getProfile();
          // setUser(userData);
        } catch (error) {
          setUser(null);
          // Optionally show a toast, but do not remove the token automatically
          // toast.error("Failed to restore user session. Please log in again.");
        }
      } else {
        setUser(null);
        delete api.defaults.headers.common["Authorization"];
      }
      setIsLoading(false); // Done loading
    };
    restoreUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Listen for force-logout flag and handle client-side redirect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleStorage = () => {
        if (localStorage.getItem('force-logout') === '1') {
          localStorage.removeItem('force-logout');
          setUser(null);
          localStorage.removeItem('token');
          delete api.defaults.headers.common["Authorization"];
          router.push('/login');
        }
      };
      window.addEventListener('storage', handleStorage);
      // Also check immediately in case the flag was set in this tab
      handleStorage();
      return () => window.removeEventListener('storage', handleStorage);
    }
  }, [router]);

  const login = async (username: string, password: string) => {
    try {
      const response = await authService.login({ username, password });
      const userData: UserDTO = response.user;
      setUser(userData);
      localStorage.setItem("token", response.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${response.token}`;
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
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
    } catch (error: any) {
      const message = error.response?.data?.message || "Logout failed";
      console.error(message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, isAdmin: () => !!user && user.role === 'ADMIN' }}>
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