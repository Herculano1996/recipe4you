import { useParams, useNavigate } from "react-router";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import StarIcon from "@mui/icons-material/Star";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRecipeDetail } from "../../hooks/useRecipeDetail.js";
import { useToggleFavorite } from "../../hooks/useFavorites.js";
import { useAuthStore } from "../../store/authStore.js";
import { AppAlert } from "../../components/ui/index.js";
import {
  getDifficultyColor,
  getDifficultyLabel,
} from "../../components/recipe/RecipeCard/RecipeCard.utils.js";
import {
  PageWrapper,
  BackButton,
  HeroImage,
  HeroImg,
  HeroPlaceholder,
  FavButton,
  MetaBar,
  MetaItem,
  AuthorRow,
  AuthorAvatar,
  AuthorName,
  AuthorHandle,
  TagsRow,
  ContentGrid,
  IngredientsCard,
  IngredientsTitle,
  IngredientsServing,
  IngredientItem,
  IngredientQty,
  IngredientName,
  StepsTitle,
  StepItem,
  StepNumber,
  StepBody,
  StepTitle,
  StepDescription,
  StepDuration,
  RecipeTitle,
  RecipeDescription,
} from "./RecipeDetail.styled.js";
import { formatTime } from "./RecipeDetail.utils.js";

export default function RecipeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { data: recipe, isLoading, isError } = useRecipeDetail(slug ?? "");
  const { mutate: toggleFavorite, isPending: isFavPending } =
    useToggleFavorite();

  if (isLoading) {
    return (
      <PageWrapper>
        <Skeleton
          variant="rectangular"
          height={44}
          width={120}
          sx={{ mt: 3, borderRadius: 2 }}
        />
        <Skeleton
          variant="rectangular"
          sx={{ mt: 2, mb: 4, borderRadius: "20px", aspectRatio: "16/9" }}
        />
        <Skeleton variant="text" height={60} width="70%" />
        <Skeleton variant="text" height={28} width="40%" sx={{ mt: 1 }} />
      </PageWrapper>
    );
  }

  if (isError || !recipe) {
    return (
      <PageWrapper>
        <BackButton onClick={() => navigate(-1)}>
          <ArrowBackIcon sx={{ fontSize: 18 }} /> Back
        </BackButton>
        <AppAlert severity="error" sx={{ mt: 4 }}>
          Recipe not found or an error occurred.
        </AppAlert>
      </PageWrapper>
    );
  }

  const totalTime = recipe.prepTime + recipe.cookTime;
  const authorInitial = (recipe.author.displayName ?? recipe.author.username)
    .charAt(0)
    .toUpperCase();

  return (
    <PageWrapper>
      <BackButton onClick={() => navigate(-1)} aria-label="Go back">
        <ArrowBackIcon sx={{ fontSize: 18 }} /> Back
      </BackButton>

      <HeroImage>
        {recipe.coverImage ? (
          <HeroImg src={recipe.coverImage} alt={recipe.title} loading="eager" />
        ) : (
          <HeroPlaceholder aria-hidden>🍽️</HeroPlaceholder>
        )}
        {isAuthenticated && (
          <FavButton
            aria-label={
              recipe.isFavorited ? "Remove from favorites" : "Add to favorites"
            }
            onClick={() =>
              toggleFavorite({
                recipeId: recipe.id,
                isFavorited: recipe.isFavorited ?? false,
              })
            }
            disabled={isFavPending}
          >
            {recipe.isFavorited ? (
              <FavoriteIcon sx={{ color: "#e85d26", fontSize: 22 }} />
            ) : (
              <FavoriteBorderIcon sx={{ color: "#9e9e9e", fontSize: 22 }} />
            )}
          </FavButton>
        )}
      </HeroImage>

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <Chip
          label={getDifficultyLabel(recipe.difficulty)}
          size="small"
          sx={{
            background: getDifficultyColor(recipe.difficulty),
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.72rem",
            borderRadius: "6px",
            flexShrink: 0,
            mt: 0.5,
          }}
        />
      </div>

      <RecipeTitle>{recipe.title}</RecipeTitle>

      {recipe.description && (
        <RecipeDescription>{recipe.description}</RecipeDescription>
      )}

      <MetaBar>
        <MetaItem>
          <AccessTimeIcon aria-hidden />
          <span>
            <strong>Prep</strong> {formatTime(recipe.prepTime)}
          </span>
        </MetaItem>
        <MetaItem>
          <AccessTimeIcon aria-hidden />
          <span>
            <strong>Cook</strong> {formatTime(recipe.cookTime)}
          </span>
        </MetaItem>
        <MetaItem>
          <AccessTimeIcon aria-hidden />
          <span>
            <strong>Total</strong> {formatTime(totalTime)}
          </span>
        </MetaItem>
        <MetaItem>
          <PeopleIcon aria-hidden />
          <span>{recipe.servings} servings</span>
        </MetaItem>
        {recipe.calories && (
          <MetaItem>
            <LocalFireDepartmentIcon aria-hidden />
            <span>{recipe.calories} kcal</span>
          </MetaItem>
        )}
        {recipe.averageRating && (
          <MetaItem>
            <StarIcon sx={{ color: "#f59e0b !important" }} aria-hidden />
            <span>
              {recipe.averageRating.toFixed(1)}
              {recipe.ratingCount ? ` (${recipe.ratingCount})` : ""}
            </span>
          </MetaItem>
        )}
      </MetaBar>

      <AuthorRow>
        <AuthorAvatar>{authorInitial}</AuthorAvatar>
        <div>
          <AuthorName>
            {recipe.author.displayName ?? recipe.author.username}
          </AuthorName>
          <AuthorHandle>@{recipe.author.username}</AuthorHandle>
        </div>
      </AuthorRow>

      {recipe.tags.length > 0 && (
        <TagsRow>
          {recipe.tags.map((t) => (
            <Chip
              key={t.id}
              label={t.name}
              size="small"
              clickable
              onClick={() => navigate(`/tags/${t.slug}`)}
              sx={{ background: "rgba(0,0,0,0.06)", fontWeight: 500 }}
            />
          ))}
        </TagsRow>
      )}

      <ContentGrid>
        <section aria-labelledby="ingredients-heading">
          <IngredientsCard>
            <IngredientsTitle id="ingredients-heading">
              Ingredients
            </IngredientsTitle>
            <IngredientsServing>
              For {recipe.servings} servings
            </IngredientsServing>
            <ul style={{ margin: 0, padding: 0 }}>
              {recipe.ingredients.map((ing) => (
                <IngredientItem key={ing.id}>
                  <IngredientQty>
                    {Number(ing.quantity)} {ing.unit}
                  </IngredientQty>
                  <IngredientName>
                    {ing.ingredient.name}
                    {ing.notes ? ` (${ing.notes})` : ""}
                  </IngredientName>
                </IngredientItem>
              ))}
            </ul>
          </IngredientsCard>
        </section>

        <section aria-labelledby="steps-heading">
          <StepsTitle id="steps-heading">Instructions</StepsTitle>
          <ol style={{ margin: 0, padding: 0 }}>
            {recipe.steps.map((step) => (
              <StepItem key={step.id}>
                <StepNumber aria-hidden>{step.stepNumber}</StepNumber>
                <StepBody>
                  {step.title && <StepTitle>{step.title}</StepTitle>}
                  <StepDescription>{step.description}</StepDescription>
                  {step.duration && (
                    <StepDuration>
                      <AccessTimeIcon
                        sx={{ fontSize: 13, verticalAlign: "middle", mr: 0.3 }}
                      />
                      {step.duration} min
                    </StepDuration>
                  )}
                </StepBody>
              </StepItem>
            ))}
          </ol>
        </section>
      </ContentGrid>
    </PageWrapper>
  );
}
