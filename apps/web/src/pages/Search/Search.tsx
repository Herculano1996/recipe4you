import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { SearchBar } from "../../components/search/SearchBar/SearchBar.js";
import { RecipeGrid } from "../../components/recipe/RecipeGrid/RecipeGrid.js";
import { useSearch } from "../../hooks/useSearch.js";
import {
  PageWrapper,
  SearchHeader,
  SearchBarWrapper,
  ResultsLabel,
  ResultsError,
  ResultsHeading,
} from "./Search.styled.js";
import { buildResultsLabel } from "./Search.utils.js";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQ = searchParams.get("q") ?? "";
  const [inputValue, setInputValue] = useState(initialQ);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInputValue(searchParams.get("q") ?? "");
  }, [searchParams]);

  const { data, isLoading, isError } = useSearch(initialQ);

  const handleSearch = (value: string) => {
    const q = value.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const resultCount = data?.total ?? 0;
  const results = data?.items ?? [];

  return (
    <PageWrapper>
      <SearchHeader>
        <SearchBarWrapper>
          <SearchBar
            value={inputValue}
            onChange={setInputValue}
            onSearch={handleSearch}
            size="lg"
            placeholder="Search recipes, ingredients, cuisines…"
          />
        </SearchBarWrapper>

        {initialQ && !isLoading && (
          <div role="status" aria-live="polite" aria-atomic="true">
            {isError ? (
              <ResultsError>
                Something went wrong. Please try again.
              </ResultsError>
            ) : (
              <ResultsLabel>
                {buildResultsLabel(resultCount, initialQ)}
              </ResultsLabel>
            )}
          </div>
        )}

        {initialQ && !isLoading && resultCount > 0 && (
          <ResultsHeading>Results for &ldquo;{initialQ}&rdquo;</ResultsHeading>
        )}

        {!initialQ && <ResultsHeading>Search recipes</ResultsHeading>}
      </SearchHeader>

      {initialQ && (
        <RecipeGrid
          recipes={results}
          loading={isLoading}
          skeletonCount={8}
          emptyMessage={`No recipes found for "${initialQ}". Try a different search term.`}
        />
      )}
    </PageWrapper>
  );
}
