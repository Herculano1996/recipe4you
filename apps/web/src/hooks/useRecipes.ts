import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../lib/api.js";
import type { RecipeSummary, RecipeFilters, ApiMeta } from "@recipe4you/types";

interface RecipesPage {
  items: RecipeSummary[];
  meta: ApiMeta;
}

function buildQuery(filters: RecipeFilters): string {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.tag) params.set("tag", String(filters.tag));
  if (filters.ingredient) params.set("ingredient", filters.ingredient);
  if (filters.difficulty) params.set("difficulty", filters.difficulty);
  if (filters.maxTime) params.set("maxTime", String(filters.maxTime));
  if (filters.dietary) params.set("dietary", filters.dietary);
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.limit) params.set("limit", String(filters.limit));
  return params.toString();
}

export function useRecipes(filters: RecipeFilters = {}) {
  return useInfiniteQuery({
    queryKey: ["recipes", filters],
    queryFn: ({ pageParam }) => {
      const qs = buildQuery({
        ...filters,
        cursor: pageParam as string | undefined,
      });
      return api.get<RecipesPage>(`/recipes?${qs}`);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasMore
        ? (lastPage.meta.nextCursor ?? undefined)
        : undefined,
    staleTime: 5 * 60 * 1000,
  });
}
