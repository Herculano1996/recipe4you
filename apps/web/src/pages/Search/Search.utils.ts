export interface SearchResult {
  total: number;
  items: import("@recipe4you/types").RecipeSummary[];
}

export function buildResultsLabel(count: number, query: string): string {
  if (count === 0) return `No results for "${query}"`;
  const plural = count === 1 ? "" : "s";
  return `${count.toLocaleString()} result${plural} for \u201c${query}\u201d`;
}
