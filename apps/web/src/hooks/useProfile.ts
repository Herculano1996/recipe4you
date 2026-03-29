import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api.js";
import type { UserProfile, UpdateProfileInput } from "@recipe4you/types";
import { useAuthStore } from "../store/authStore.js";

export function useOwnProfile() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["profile", "me"],
    queryFn: () => api.get<UserProfile>("/users/me"),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePublicProfile(username: string) {
  return useQuery({
    queryKey: ["profile", username],
    queryFn: () => api.get<UserProfile>(`/users/${username}`),
    enabled: Boolean(username),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { user, token, setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) =>
      api.patch<UserProfile>("/users/me", input),
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
      // Keep auth store in sync if user object is stored there
      if (user && token) {
        setAuth({ ...user, ...updated }, token);
      }
    },
  });
}
