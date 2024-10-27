// app/api/auth.ts

import { AuthResponse } from "@/app/types/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

const TOKEN_KEY = "auth_token";

const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const getAuthHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const sendOTP = async (email: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    return response.ok;
  } catch (error) {
    return false;
  }
};

export const registerUser = async (
  email: string,
  otp: string,
  password: string,
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, password }),
    });
    const data = await response.json();

    if (data.success && data.data?.token) {
      setToken(data.data.token);
    }

    return data;
  } catch (error) {
    return { success: false };
  }
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    const data = await response.json();

    if (data.success && data.data?.token) {
      setToken(data.data.token);
    }

    return data;
  } catch (error) {
    return { success: false };
  }
};

export const logoutUser = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    if (response.ok) {
      removeToken();
    }

    return response.ok;
  } catch (error) {
    removeToken();

    return false;
  }
};
