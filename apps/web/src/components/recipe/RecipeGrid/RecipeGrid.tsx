import { RecipeCard, RecipeCardSkeleton } from "../RecipeCard/RecipeCard.js";
import type { RecipeGridProps } from "./RecipeGrid.types.js";
import {
  Grid,
  EmptyState,
  EmptyIcon,
  EmptyMessage,
} from "./RecipeGrid.styled.js";

export function RecipeGrid({
  recipes,
  loading = false,
  skeletonCount = 8,
  onFavoriteToggle,
  emptyMessage = "No recipes found.",
}: RecipeGridProps) {
  if (loading) {
    return (
      <Grid role="status" aria-busy="true" aria-label="Loading recipes">
        <RecipeCardSkeleton count={skeletonCount} />
      </Grid>
    );
  }

  if (recipes.length === 0) {
    return (
      <EmptyState>
        <EmptyIcon role="img" aria-hidden>
          🍽️
        </EmptyIcon>
        <EmptyMessage>{emptyMessage}</EmptyMessage>
      </EmptyState>
    );
  }

  return (
    <Grid
      role="list"
      aria-label={`${recipes.length} recipe${recipes.length === 1 ? "" : "s"}`}
    >
      {recipes.map((recipe) => (
        <div key={recipe.id} role="listitem">
          <RecipeCard recipe={recipe} onFavoriteToggle={onFavoriteToggle} />
        </div>
      ))}
    </Grid>
  );
}
