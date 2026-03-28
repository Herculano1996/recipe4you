import type { RecipeSummary } from "@recipe4you/types";

export interface RecipeGridProps {
  recipes: RecipeSummary[];
  loading?: boolean;
  skeletonCount?: number;
  onFavoriteToggle?: (recipeId: string) => void;
  emptyMessage?: string;
}
