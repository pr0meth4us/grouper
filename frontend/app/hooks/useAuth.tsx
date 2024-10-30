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
    setLoading(true);
    try {
      const response = await authApi.checkAuth();

      setIsAuthenticated(response.success);

      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to handle login
  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authApi.login(credentials);

      if (response.success) {
        await checkAuth();
        emitAuthStateChange();
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  // Function to handle logout
  const logout = async () => {
    try {
      const response = await authApi.logout();

      if (response.success) {
        setIsAuthenticated(false);
        setUser(null);
        emitAuthStateChange();
        localStorage.removeItem("user");
        sessionStorage.clear();

        window.location.reload();
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  // Function to handle registration
  const register = async (userData: {
    email: any;
    password: any;
    otp: any;
  }) => {
    const { email, password, otp } = userData;

    try {
      const response = await authApi.register(email, password, otp);

      if (response.success) {
        await checkAuth();
        emitAuthStateChange();
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    // Check auth on mount
    checkAuth();

    // Add event listeners for various scenarios
    const handleAuthStateChange = () => checkAuth();
    const handleFocus = () => checkAuth();
    const handleOnline = () => checkAuth();
    const handleStorage = (e: StorageEvent) => {
      // Check if the storage event is related to auth (e.g., token)
      if (e.key && e.key.includes("auth")) {
        checkAuth();
      }
    };

    // Add all event listeners
    window.addEventListener(AUTH_STATE_CHANGED, handleAuthStateChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("online", handleOnline);
    window.addEventListener("storage", handleStorage);

    // Handle page reload
    if (document.readyState === "complete") {
      checkAuth();
    }
    window.addEventListener("load", checkAuth);

    // Clean up event listeners
    return () => {
      window.removeEventListener(AUTH_STATE_CHANGED, handleAuthStateChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("load", checkAuth);
    };
  }, [checkAuth]);

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
