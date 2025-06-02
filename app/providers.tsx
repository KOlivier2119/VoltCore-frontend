"use client";

import { ReactNode } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster position="top-right" />
    </AuthProvider>
  );
}
