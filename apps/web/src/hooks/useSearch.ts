import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api.js";
import type { RecipeSummary } from "@recipe4you/types";

interface SearchResult {
  items: RecipeSummary[];
  total: number;
}

interface SuggestionResult {
  suggestions: string[];
}

export function useSearch(q: string) {
  return useQuery({
    queryKey: ["search", q],
    queryFn: () => api.get<SearchResult>(`/search?q=${encodeURIComponent(q)}`),
    enabled: q.trim().length > 1,
    staleTime: 2 * 60 * 1000,
  });
}

export function useSearchSuggestions(q: string) {
  return useQuery({
    queryKey: ["search-suggestions", q],
    queryFn: () =>
      api.get<SuggestionResult>(
        `/search/suggestions?q=${encodeURIComponent(q)}`,
      ),
    enabled: q.trim().length > 1,
    staleTime: 60 * 1000,
  });
}
