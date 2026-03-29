import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api.js";
import type {
  Collection,
  CollectionWithRecipes,
  CreateCollectionInput,
  UpdateCollectionInput,
} from "@recipe4you/types";
import { useAuthStore } from "../store/authStore.js";

export function useCollections() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["collections"],
    queryFn: () => api.get<Collection[]>("/collections"),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCollectionDetail(id: string) {
  return useQuery({
    queryKey: ["collection", id],
    queryFn: () => api.get<CollectionWithRecipes>(`/collections/${id}`),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCollectionInput) =>
      api.post<Collection>("/collections", input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });
}

export function useUpdateCollection(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateCollectionInput) =>
      api.patch<Collection>(`/collections/${id}`, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
      void queryClient.invalidateQueries({ queryKey: ["collection", id] });
    },
  });
}

export function useDeleteCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/collections/${id}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });
}

export function useAddRecipeToCollection(collectionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recipeId,
      sortOrder,
    }: {
      recipeId: string;
      sortOrder?: number;
    }) =>
      api.post(`/collections/${collectionId}/recipes`, { recipeId, sortOrder }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["collection", collectionId],
      });
    },
  });
}

export function useRemoveRecipeFromCollection(collectionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recipeId: string) =>
      api.delete(`/collections/${collectionId}/recipes/${recipeId}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["collection", collectionId],
      });
    },
  });
}
