import { useEffect, useState, useCallback } from "react";

import { LoginRequest, authApi } from "../api/auth";

const AUTH_STATE_CHANGED = "authStateChanged";

const emitAuthStateChange = () => {
  window.dispatchEvent(new Event(AUTH_STATE_CHANGED));
};

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const checkAuth = useCallback(async () => {
    try {
      const response = await authApi.checkAuth();

      setIsAuthenticated(response.success);

      if (response.success && response.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
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

      if (response.success) {
        await checkAuth();
        emitAuthStateChange();
      }

      return response;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setLoading(true); // Set loading state before logout
      const response = await authApi.logout();

      if (response.success) {
        // Immediately update local state
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("user");
        sessionStorage.clear();

        // Emit auth state change after state updates
        emitAuthStateChange();
      }

      return response;
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    } finally {
      setLoading(false); // Ensure loading is set to false regardless of outcome
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
