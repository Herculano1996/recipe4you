import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api.js";
import type {
  Recipe,
  CreateRecipeInput,
  UpdateRecipeInput,
} from "@recipe4you/types";

export function useCreateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRecipeInput) =>
      api.post<Recipe>("/recipes", input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["recipes"] });
      void queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
  });
}

export function useUpdateRecipe(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateRecipeInput) =>
      api.patch<Recipe>(`/recipes/${id}`, input),
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({ queryKey: ["recipes"] });
      void queryClient.invalidateQueries({
        queryKey: ["recipe", updated.slug],
      });
    },
  });
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/recipes/${id}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["recipes"] });
      void queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
  });
}

export function usePublishRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.post<Recipe>(`/recipes/${id}/publish`, {}),
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({ queryKey: ["recipes"] });
      void queryClient.invalidateQueries({
        queryKey: ["recipe", updated.slug],
      });
    },
  });
}
