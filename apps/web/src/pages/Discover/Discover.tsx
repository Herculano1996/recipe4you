import { useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import { RecipeGrid } from "../../components/recipe/RecipeGrid/RecipeGrid.js";
import { useRecipes } from "../../hooks/useRecipes.js";
import {
  PageWrapper,
  PageHeader,
  PageTitle,
  PageSubtitle,
  FiltersRow,
  DietaryStrip,
  LoadMoreWrapper,
  LoadMoreButton,
  ClearFiltersButton,
} from "./Discover.styled.js";
import type {
  RecipeFilters,
  SortOption,
  DifficultyOption,
} from "./Discover.types.js";
import type { RecipeSummary, Difficulty } from "@recipe4you/types";

const SORT_OPTIONS: SortOption[] = [
  { value: "newest", label: "Newest first" },
  { value: "popular", label: "Most popular" },
  { value: "quick", label: "Quickest first" },
  { value: "rating", label: "Highest rated" },
];

const DIFFICULTY_OPTIONS: DifficultyOption[] = [
  { value: "", label: "Any difficulty" },
  { value: "EASY", label: "Easy" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HARD", label: "Hard" },
  { value: "EXPERT", label: "Expert" },
];

const DIETARY_TAGS = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Keto",
  "Low-Carb",
];

export default function DiscoverPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [filters, setFilters] = useState<RecipeFilters>({
    sort: (searchParams.get("sort") || "newest") as RecipeFilters["sort"],
    difficulty: (searchParams.get("difficulty") || undefined) as
      | Difficulty
      | undefined,
    dietary: searchParams.get("dietary") || undefined,
  });

  const updateFilter = useCallback(
    (key: keyof RecipeFilters, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value || undefined }));
      setSearchParams(
        (prev) => {
          if (value) prev.set(key, value);
          else prev.delete(key);
          return prev;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useRecipes(filters);

  const allRecipes: RecipeSummary[] = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>Discover Recipes</PageTitle>
        <PageSubtitle>
          Explore our full collection — filter, sort, and find your next
          favourite.
        </PageSubtitle>

        <FiltersRow>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              label="Sort by"
              value={filters.sort ?? "newest"}
              onChange={(e) => updateFilter("sort", e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Difficulty</InputLabel>
            <Select
              label="Difficulty"
              value={filters.difficulty ?? ""}
              onChange={(e) => updateFilter("difficulty", e.target.value)}
            >
              {DIFFICULTY_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {(filters.sort || filters.difficulty || filters.dietary) && (
            <ClearFiltersButton
              size="small"
              onClick={() => {
                setFilters({ sort: "newest" });
                navigate("/discover");
              }}
            >
              Clear filters
            </ClearFiltersButton>
          )}
        </FiltersRow>

        <DietaryStrip aria-label="Filter by dietary preference">
          {DIETARY_TAGS.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              clickable
              onClick={() =>
                updateFilter("dietary", filters.dietary === tag ? "" : tag)
              }
              sx={{
                fontWeight: filters.dietary === tag ? 700 : 500,
                background:
                  filters.dietary === tag ? "#e85d26" : "rgba(0,0,0,0.06)",
                color: filters.dietary === tag ? "#fff" : "#555",
                "&:hover": {
                  background:
                    filters.dietary === tag ? "#d14e1e" : "rgba(0,0,0,0.1)",
                },
              }}
              aria-pressed={filters.dietary === tag}
            />
          ))}
        </DietaryStrip>
      </PageHeader>

      <RecipeGrid
        recipes={allRecipes}
        loading={isLoading}
        skeletonCount={12}
        emptyMessage="No recipes found. Try adjusting your filters."
      />

      {hasNextPage && (
        <LoadMoreWrapper>
          <LoadMoreButton
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
          </LoadMoreButton>
        </LoadMoreWrapper>
      )}
    </PageWrapper>
  );
}
