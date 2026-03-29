import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { api } from "../lib/api.js";
import { useAuthStore } from "../store/authStore.js";
import type { User } from "@recipe4you/types";

const REFRESH_TOKEN_KEY = "refresh_token";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  username: string;
  displayName?: string;
}

interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export function useLogin() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginPayload) =>
      api.post<AuthResponse, LoginPayload>("/auth/login", data),
    onSuccess: ({ user, token, refreshToken }) => {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      setAuth(user, token);
      navigate("/");
    },
  });
}

export function useRegister() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterPayload) =>
      api.post<AuthResponse, RegisterPayload>("/auth/register", data),
    onSuccess: ({ user, token, refreshToken }) => {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      setAuth(user, token);
      navigate("/");
    },
  });
}

export function useLogout() {
  const { clearAuth } = useAuthStore();
  const navigate = useNavigate();

  return async () => {
    try {
      await api.post("/auth/logout", {});
    } catch {
      // Ignore errors — clear locally regardless
    } finally {
      clearAuth();
      navigate("/");
    }
  };
}
