// app/providers.tsx
"use client";
import type { ThemeProviderProps } from "next-themes/dist/types";
import type { User } from "@/app/types/auth";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { getToken } from "./api/auth";
import { loginUser, logoutUser, sendOTP, registerUser } from "./api/auth";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  sendOTP: (email: string) => Promise<boolean>;
  register: (email: string, otp: string, password: string) => Promise<boolean>;
}

const AuthContext = React.createContext<AuthContextProps | undefined>(
  undefined,
);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = React.useState<User | null>(null);
  const router = useRouter();

  // Check for existing token on mount
  React.useEffect(() => {
    const token = getToken();

    // If no token, user is not logged in
    if (!token && window.location.pathname !== "/login") {
      router.push("/login");
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await loginUser(email, password);

    if (response.success && response.data?.user) {
      setUser(response.data.user);
      router.push("/dashboard"); // Redirect to dashboard after successful login

      return true;
    }

    return false;
  };

  const handleLogout = async () => {
    const success = await logoutUser();

    if (success) {
      setUser(null);
      router.push("/login");
    }
  };

  const sendOTPHandler = async (email: string) => {
    return await sendOTP(email);
  };

  const registerHandler = async (
    email: string,
    otp: string,
    password: string,
  ) => {
    const response = await registerUser(email, otp, password);

    if (response.success && response.data?.user) {
      setUser(response.data.user);
      router.push("/dashboard"); // Redirect to dashboard after successful registration

      return true;
    }

    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout: handleLogout,
        sendOTP: sendOTPHandler,
        register: registerHandler,
      }}
    >
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
