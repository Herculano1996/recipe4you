import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api.js";
import type { Ingredient } from "@recipe4you/types";

export function useIngredients(q: string) {
  return useQuery({
    queryKey: ["ingredients", q],
    queryFn: () =>
      api.get<Ingredient[]>(`/ingredients?q=${encodeURIComponent(q)}`),
    enabled: q.length > 1,
    staleTime: 60 * 1000,
  });
}
