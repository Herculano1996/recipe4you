import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api.js";
import type { Tag } from "@recipe4you/types";

export function useTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: () => api.get<Tag[]>("/tags"),
    staleTime: 15 * 60 * 1000,
  });
}
