import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api.js";
import type { Recipe } from "@recipe4you/types";

export function useRecipeDetail(slug: string) {
  return useQuery({
    queryKey: ["recipe", slug],
    queryFn: () => api.get<Recipe>(`/recipes/${slug}`),
    enabled: !!slug,
    staleTime: 15 * 60 * 1000, // 15 min
  });
}
