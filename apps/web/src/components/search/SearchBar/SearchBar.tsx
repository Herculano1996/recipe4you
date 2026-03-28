import { useEffect, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import type { SearchBarProps } from "./SearchBar.types.js";
import {
  SearchWrapper,
  SearchIconWrapper,
  StyledInputBase,
  ClearButton,
  SearchButton,
} from "./SearchBar.styled.js";

export function SearchBar({
  value = "",
  onChange,
  onSearch,
  placeholder = "Search recipes, ingredients…",
  size = "md",
  autoFocus = false,
  showButton = true,
  variant = "light",
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch?.(value);
    }
  };

  const handleClear = () => {
    onChange?.("");
    inputRef.current?.focus();
  };

  return (
    <SearchWrapper $size={size} $variant={variant} role="search">
      <SearchIconWrapper $size={size} $variant={variant} aria-hidden>
        <SearchIcon />
      </SearchIconWrapper>

      <StyledInputBase
        $size={size}
        $variant={variant}
        inputRef={inputRef}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        inputProps={{
          "aria-label": placeholder,
          autoComplete: "off",
          spellCheck: false,
        }}
      />

      {value && (
        <ClearButton
          $variant={variant}
          onClick={handleClear}
          aria-label="Clear search"
          size="small"
        >
          <CloseIcon />
        </ClearButton>
      )}

      {showButton && (
        <SearchButton
          $size={size}
          onClick={() => onSearch?.(value)}
          aria-label="Submit search"
          disableElevation
        >
          Search
        </SearchButton>
      )}
    </SearchWrapper>
  );
}
