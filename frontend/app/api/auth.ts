import { ApiResponse, LoginRequest } from "@/app/types/auth";

const API_BASE_URL = "/auth";

export const authApi = {
  sendOtp: async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    return response.text();
  },

  register: async (email: string, password: string, otp: string) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, otp }),
    });

    return (await response.json()) as Promise<ApiResponse>;
  },

  login: async (credentials: LoginRequest) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    return (await response.json()) as Promise<ApiResponse>;
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
    });

    return response.json();
  },

  checkAuth: async () => {
    const response = await fetch("/auth/verify", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Authentication check failed");
    }

    return (await response.json()) as ApiResponse;
  },
};
