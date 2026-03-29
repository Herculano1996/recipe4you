import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router";
import { useFavoritesList } from "../../hooks/useFavoritesList.js";
import { RecipeGrid } from "../../components/recipe/RecipeGrid/RecipeGrid.js";
import { AppButton } from "../../components/ui/index.js";
import {
  PageWrapper,
  PageHeader,
  PageTitle,
  PageSubtitle,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyText,
  LoadMoreWrapper,
  LoadMoreBtn,
} from "./Favorites.styled.js";
import type { RecipeSummary } from "@recipe4you/types";

export default function FavoritesPage() {
  const navigate = useNavigate();

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useFavoritesList();

  const allRecipes: RecipeSummary[] = data?.pages.flatMap((p) => p.items) ?? [];

  const isEmpty = !isLoading && allRecipes.length === 0;

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>My Favorites</PageTitle>
        <PageSubtitle>
          All the recipes you have saved in one place.
        </PageSubtitle>
      </PageHeader>

      {isEmpty ? (
        <EmptyState>
          <EmptyIcon aria-hidden="true">&#9825;</EmptyIcon>
          <EmptyTitle>No favorites yet</EmptyTitle>
          <EmptyText>
            Start exploring recipes and save the ones you love.
          </EmptyText>
          <AppButton appVariant="primary" onClick={() => navigate("/discover")}>
            Explore Recipes
          </AppButton>
        </EmptyState>
      ) : (
        <>
          <RecipeGrid
            recipes={allRecipes}
            loading={isLoading}
            skeletonCount={8}
          />

          {hasNextPage && (
            <LoadMoreWrapper>
              <LoadMoreBtn
                variant="outlined"
                onClick={() => {
                  fetchNextPage().catch(() => null);
                }}
                disabled={isFetchingNextPage}
                startIcon={
                  isFetchingNextPage ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : null
                }
              >
                {isFetchingNextPage ? "Loading…" : "Load more"}
              </LoadMoreBtn>
            </LoadMoreWrapper>
          )}
        </>
      )}
    </PageWrapper>
  );
}
