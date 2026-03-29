import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../lib/api.js";
import type { RecipeSummary, ApiMeta } from "@recipe4you/types";
import { useAuthStore } from "../store/authStore.js";

interface FavoritesPage {
  items: Array<RecipeSummary & { favoritedAt: string }>;
  meta: ApiMeta;
}

export function useFavoritesList() {
  const { isAuthenticated } = useAuthStore();

  return useInfiniteQuery({
    queryKey: ["favorites"],
    queryFn: ({ pageParam }) => {
      const params = new URLSearchParams({ limit: "20" });
      if (pageParam) params.set("cursor", pageParam as string);
      return api.get<FavoritesPage>(`/favorites?${params}`);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasMore
        ? (lastPage.meta.nextCursor ?? undefined)
        : undefined,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}
