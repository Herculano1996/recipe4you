import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@recipe4you/types";

const REFRESH_TOKEN_KEY = "refresh_token";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        localStorage.setItem("auth_token", token);
        set({ user, token, isAuthenticated: true });
      },
      setUser: (user) => set({ user }),
      clearAuth: () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "recipe4you-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
