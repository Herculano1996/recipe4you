import { useNavigate } from "react-router";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import type {
  RecipeCardProps,
  RecipeCardSkeletonProps,
} from "./RecipeCard.types.js";
import {
  formatTotalTime,
  formatRating,
  getDifficultyColor,
  getDifficultyLabel,
} from "./RecipeCard.utils.js";
import {
  StyledCard,
  StyledCardActionArea,
  ImageWrapper,
  RecipeImage,
  ImagePlaceholder,
  ImageOverlay,
  DifficultyChip,
  FavoriteButton,
  StyledCardContent,
  RecipeTitle,
  RecipeDescription,
  MetaRow,
  MetaItem,
  Divider,
  AuthorRow,
  AuthorAvatar,
  AuthorName,
  RatingRow,
  RatingText,
  RatingCount,
  SkeletonCard,
} from "./RecipeCard.styled.js";
import Box from "@mui/material/Box";

export function RecipeCard({ recipe, onFavoriteToggle }: RecipeCardProps) {
  const navigate = useNavigate();

  const authorInitial = (recipe.author.displayName ?? recipe.author.username)
    .charAt(0)
    .toUpperCase();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onFavoriteToggle?.(recipe.id);
  };

  return (
    <StyledCard>
      <StyledCardActionArea
        onClick={() => navigate(`/recipes/${recipe.slug}`)}
        aria-label={`View recipe: ${recipe.title}`}
      >
        <ImageWrapper>
          {recipe.coverImage ? (
            <RecipeImage
              src={recipe.coverImage}
              alt={recipe.title}
              loading="lazy"
              width="400"
              height="300"
            />
          ) : (
            <ImagePlaceholder
              role="img"
              aria-label={`${recipe.title} — no image`}
            >
              🍽️
            </ImagePlaceholder>
          )}
          <ImageOverlay aria-hidden />

          <DifficultyChip
            label={getDifficultyLabel(recipe.difficulty)}
            $color={getDifficultyColor(recipe.difficulty)}
            size="small"
            aria-label={`Difficulty: ${getDifficultyLabel(recipe.difficulty)}`}
          />
        </ImageWrapper>

        <StyledCardContent>
          <RecipeTitle variant="h3">
            {recipe.title}
          </RecipeTitle>

          {recipe.description && (
            <RecipeDescription variant="body2">
              {recipe.description}
            </RecipeDescription>
          )}

          <MetaRow role="list" aria-label="Recipe details">
            <MetaItem
              role="listitem"
              aria-label={`Total time: ${formatTotalTime(recipe.prepTime, recipe.cookTime)}`}
            >
              <AccessTimeIcon sx={{ fontSize: 15 }} aria-hidden />
              {formatTotalTime(recipe.prepTime, recipe.cookTime)}
            </MetaItem>
            <Divider aria-hidden />
            <MetaItem role="listitem" aria-label={`Serves ${recipe.servings}`}>
              <PeopleOutlineIcon sx={{ fontSize: 15 }} aria-hidden />
              {recipe.servings} servings
            </MetaItem>
          </MetaRow>

          <AuthorRow>
            <AuthorAvatar
              src={recipe.author.avatarUrl ?? undefined}
              alt={recipe.author.displayName ?? recipe.author.username}
              aria-hidden
            >
              {authorInitial}
            </AuthorAvatar>
            <AuthorName>
              {recipe.author.displayName ?? recipe.author.username}
            </AuthorName>

            {recipe.averageRating != null &&
              recipe.ratingCount != null &&
              recipe.ratingCount > 0 && (
                <RatingRow
                  aria-label={`Rating: ${formatRating(recipe.averageRating)} out of 5, ${recipe.ratingCount} reviews`}
                >
                  <StarRoundedIcon
                    sx={{ fontSize: 15, color: "#F59E0B" }}
                    aria-hidden
                  />
                  <RatingText>{formatRating(recipe.averageRating)}</RatingText>
                  <RatingCount>({recipe.ratingCount})</RatingCount>
                </RatingRow>
              )}
          </AuthorRow>
        </StyledCardContent>
      </StyledCardActionArea>

      {onFavoriteToggle && (
        <FavoriteButton
          $active={recipe.isFavorited ?? false}
          onClick={handleFavoriteClick}
          aria-label={
            recipe.isFavorited
              ? `Remove ${recipe.title} from favorites`
              : `Add ${recipe.title} to favorites`
          }
          aria-pressed={recipe.isFavorited ?? false}
        >
          {recipe.isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </FavoriteButton>
      )}
    </StyledCard>
  );
}

export function RecipeCardSkeleton({ count = 1 }: RecipeCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Box
          key={i}
          sx={{
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <SkeletonCard variant="rectangular" width="100%" height={200} />
          <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
            <SkeletonCard variant="text" width="85%" height={28} />
            <SkeletonCard variant="text" width="60%" height={20} />
            <SkeletonCard variant="text" width="40%" height={16} />
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, pt: 0.5 }}
            >
              <SkeletonCard variant="circular" width={24} height={24} />
              <SkeletonCard variant="text" width="30%" height={16} />
            </Box>
          </Box>
        </Box>
      ))}
    </>
  );
}
