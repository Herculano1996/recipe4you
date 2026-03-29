import { useEffect } from "react";
import { api } from "../lib/api.js";
import { useAuthStore } from "../store/authStore.js";
import type { User } from "@recipe4you/types";

/**
 * Runs once on app boot to silently verify the stored token by calling
 * GET /users/me and refreshing user data in the store.
 *
 * If the token is expired, api.ts transparently attempts a refresh.
 * If refresh also fails, api.ts dispatches "auth:logout" which RootLayout
 * picks up to clear auth state and redirect to login.
 */
export function useSessionInit() {
  const { isAuthenticated, setUser } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) return;
    api
      .get<User>("/users/me")
      .then((user) => setUser(user))
      .catch(() => {
        // api.ts handles retry + fires "auth:logout" on total failure
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally run only on mount
}
