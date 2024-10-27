"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { loginUser, logoutUser, sendOTP, registerUser } from "./api/auth";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

interface AuthContextProps {
  user: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  sendOTP: (email: string) => Promise<void>;
  register: (email: string, otp: string, password: string) => Promise<void>;
}

const AuthContext = React.createContext<AuthContextProps | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<string | null>(null);

  const login = async (email: string, password: string) => {
    const response = await loginUser(email, password);
    if (response.success) setUser(response.user.email);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const sendOTPHandler = async (email: string) => {
    await sendOTP(email);
  };

  const registerHandler = async (email: string, otp: string, password: string) => {
    const response = await registerUser(email, otp, password);
    if (response.success) setUser(response.user.email);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, sendOTP: sendOTPHandler, register: registerHandler }}>
      {children}
    </AuthContext.Provider>
  );
};

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <AuthProvider>{children}</AuthProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
