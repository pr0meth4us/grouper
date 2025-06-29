export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface LoginFormData {
  email: string;
  password: string;
}
