import { useEffect, useState } from "react";

import { authApi } from "../api/auth";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const checkAuth = async () => {
    try {
      const response = await authApi.checkAuth();

      setIsAuthenticated(response.success);
      if (response.success && response.data?.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return { isAuthenticated, loading, user };
}
