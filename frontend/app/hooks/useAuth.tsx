import { useEffect, useState, useCallback } from "react";

import { LoginRequest, authApi } from "../api/auth";

const AUTH_STATE_CHANGED = "authStateChanged";

// Define an interface for the User object
interface User {
  id: string;
  email: string;
}

const emitAuthStateChange = () => {
  window.dispatchEvent(new Event(AUTH_STATE_CHANGED));
};

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  // Apply the User interface to the state
  const [user, setUser] = useState<User | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      const response = await authApi.checkAuth();

      setIsAuthenticated(response.success);

      if (response.success && response.data) {
        setUser(response.data as User); // It's good practice to cast the response data
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log(error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      if (mounted) {
        await checkAuth();
      }
    };

    initAuth();

    const handleAuthStateChange = () => {
      if (mounted) {
        checkAuth();
      }
    };

    window.addEventListener(AUTH_STATE_CHANGED, handleAuthStateChange);

    return () => {
      mounted = false;
      window.removeEventListener(AUTH_STATE_CHANGED, handleAuthStateChange);
    };
  }, [checkAuth]);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authApi.login(credentials);

      if (response.success && response.data) {
        setIsAuthenticated(true);

        setUser((response.data as any).user);

        emitAuthStateChange();
      }

      return response;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authApi.logout();
      setIsAuthenticated(false);
      setUser(null);
      emitAuthStateChange();
    } catch (error) {
      console.error("Logout failed:", error);
      setIsAuthenticated(false);
      setUser(null);
      emitAuthStateChange();
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    otp: string;
  }) => {
    try {
      const response = await authApi.register(
        userData.email,
        userData.password,
        userData.otp,
      );

      if (response.success) {
        await checkAuth();
        emitAuthStateChange();
      }

      return response;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  return {
    isAuthenticated,
    loading,
    user,
    login,
    logout,
    register,
    checkAuth,
  };
}
