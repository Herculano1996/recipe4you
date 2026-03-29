import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api.js";
import type { Tag } from "@recipe4you/types";

export function useTag(slug: string) {
  return useQuery({
    queryKey: ["tag", slug],
    queryFn: () => api.get<Tag>(`/tags/${slug}`),
    enabled: Boolean(slug),
    staleTime: 10 * 60 * 1000,
  });
}
