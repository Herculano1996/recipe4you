import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api.js";
import { useAuthStore } from "../store/authStore.js";

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  return useMutation({
    mutationFn: async ({
      recipeId,
      isFavorited,
    }: {
      recipeId: string;
      isFavorited: boolean;
    }) => {
      if (!isAuthenticated)
        throw new Error("Must be logged in to favorite recipes");
      if (isFavorited) {
        return api.delete(`/favorites/${recipeId}`);
      }
      return api.post(`/favorites/${recipeId}`, {});
    },
    onSuccess: () => {
      // Invalidate favorites list and any recipe queries that include isFavorited
      void queryClient.invalidateQueries({ queryKey: ["favorites"] });
      void queryClient.invalidateQueries({ queryKey: ["recipe"] });
    },
  });
}
