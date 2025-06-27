import apiClient from "./axiosConfig"; // Import the configured instance
import { ApiResponse, LoginRequest } from "@/app/types/auth";

const API_BASE_URL = "/auth";

export const authApi = {
  sendOtp: async (email: string) => {
    // Now using apiClient
    const response = await apiClient.post(`${API_BASE_URL}/send-otp`, { email });
    return response.data;
  },

  register: async (email: string, password: string, otp: string) => {
    // Now using apiClient
    const response = await apiClient.post<ApiResponse>(
        `${API_BASE_URL}/register`,
        { email, password, otp },
    );
    return response.data;
  },

  login: async (credentials: LoginRequest) => {
    // Now using apiClient
    const response = await apiClient.post<ApiResponse>(
        `${API_BASE_URL}/login`,
        credentials,
    );
    return response.data;
  },

  logout: async () => {
    // Now using apiClient
    const response = await apiClient.post(`${API_BASE_URL}/logout`);
    return response.data;
  },

  checkAuth: async () => {
    // Now using apiClient, credentials are sent by default
    const response = await apiClient.get<ApiResponse>("/auth/verify");
    return response.data;
  },
};

export type { LoginRequest };
