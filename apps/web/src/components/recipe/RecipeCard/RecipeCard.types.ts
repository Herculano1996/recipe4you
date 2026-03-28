import type { RecipeSummary } from "@recipe4you/types";

export interface RecipeCardProps {
  recipe: RecipeSummary;
  onFavoriteToggle?: (recipeId: string) => void;
  loading?: boolean;
}

export interface RecipeCardSkeletonProps {
  count?: number;
}
