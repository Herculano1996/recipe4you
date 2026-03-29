import CircularProgress from "@mui/material/CircularProgress";
import { useParams } from "react-router";
import { useTag } from "../../hooks/useTag.js";
import { useRecipes } from "../../hooks/useRecipes.js";
import { RecipeGrid } from "../../components/recipe/RecipeGrid/RecipeGrid.js";
import {
  PageWrapper,
  TagHeader,
  TagName,
  CategoryBadge,
  LoadMoreWrapper,
  LoadMoreBtn,
} from "./Tag.styled.js";
import type { TagCategory, RecipeSummary } from "@recipe4you/types";

const CATEGORY_LABELS: Record<TagCategory, string> = {
  GENERAL: "General",
  DIETARY: "Dietary",
  CUISINE: "Cuisine",
  MEAL_TYPE: "Meal Type",
  OCCASION: "Occasion",
  COOKING_METHOD: "Cooking Method",
};

export default function TagPage() {
  const { slug } = useParams<{ slug: string }>();
  const tagSlug = slug ?? "";

  const { data: tag, isLoading: tagLoading } = useTag(tagSlug);

  const {
    data,
    isLoading: recipesLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useRecipes({ tag: tagSlug });

  const allRecipes: RecipeSummary[] = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <PageWrapper>
      <TagHeader>
        {tagLoading ? null : (
          <>
            <TagName>{tag?.name ?? tagSlug}</TagName>
            {tag?.category && (
              <CategoryBadge>{CATEGORY_LABELS[tag.category]}</CategoryBadge>
            )}
          </>
        )}
      </TagHeader>

      <RecipeGrid
        recipes={allRecipes}
        loading={recipesLoading}
        skeletonCount={8}
        emptyMessage={`No recipes found for "${tag?.name ?? tagSlug}" yet.`}
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
            {isFetchingNextPage ? "Loading…" : "Load more recipes"}
          </LoadMoreBtn>
        </LoadMoreWrapper>
      )}
    </PageWrapper>
  );
}
