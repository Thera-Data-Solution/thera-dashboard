import { authApi } from ".";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
}

export interface User {
  id: string;
  fullName: string;
  avatar: string;
  email?: string;
  role?: "ADMIN" | "USER" | "SU";
}

export const registerApi = async (
  payload: RegisterPayload
): Promise<AuthResponse> => {
  const response = await authApi.post<AuthResponse>(
    "/auth/admin/register",
    payload
  );
  return response.data;
};

export const loginApi = async (
  payload: LoginPayload
): Promise<AuthResponse> => {
  console.log(payload);
  const response = await authApi.post<AuthResponse>(
    "/auth/admin/login",
    payload
  );
  return response.data;
};

export const fetchMeApi = async (token: string): Promise<User> => {
  if (!token) {
    throw new Error("Token tidak tersedia.");
  }

  const response = await authApi.get<User>("/auth/admin/me", {
    headers: {
      token,
    },
  });

  return response.data;
};
