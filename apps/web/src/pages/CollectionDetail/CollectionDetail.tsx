import { useParams, useNavigate } from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { PageContainer, UserAvatar } from "../../components/ui/index.js";
import { RecipeCard } from "../../components/recipe/RecipeCard/index.js";
import {
  useCollectionDetail,
  useRemoveRecipeFromCollection,
} from "../../hooks/useCollections.js";
import { useAuthStore } from "../../store/authStore.js";
import {
  PageWrapper,
  BackLink,
  CollectionHeader,
  CollectionTitle,
  CollectionDescription,
  HeaderMeta,
  PublicBadge,
  PrivateBadge,
  OwnerRow,
  SectionTitle,
  EmptyState,
  RecipeGridWrapper,
  RemoveBtn,
  RecipeCardWrapper,
} from "./CollectionDetail.styled.js";

export default function CollectionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { data: collection, isLoading } = useCollectionDetail(id ?? "");
  const removeRecipe = useRemoveRecipeFromCollection(id ?? "");

  const isOwner = user?.id === collection?.ownerId;

  const handleRemoveRecipe = (recipeId: string, recipeTitle: string) => {
    if (!confirm(`Remove "${recipeTitle}" from this collection?`)) return;
    removeRecipe.mutate(recipeId);
  };

  if (isLoading) {
    return (
      <PageContainer>
        <PageWrapper>
          <Skeleton variant="text" width={120} height={24} sx={{ mb: 3 }} />
          <Skeleton variant="text" width="60%" height={48} />
          <Skeleton variant="text" width="80%" height={24} sx={{ mt: 1 }} />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "20px",
              mt: 4,
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={300}
                sx={{ borderRadius: "16px" }}
              />
            ))}
          </Box>
        </PageWrapper>
      </PageContainer>
    );
  }

  if (!collection) {
    return (
      <PageContainer>
        <PageWrapper>
          <BackLink onClick={() => navigate("/collections")}>
            <ArrowBackIcon sx={{ fontSize: "1rem" }} />
            Back to Collections
          </BackLink>
          <EmptyState>Collection not found.</EmptyState>
        </PageWrapper>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageWrapper>
        <BackLink onClick={() => navigate("/collections")}>
          <ArrowBackIcon sx={{ fontSize: "1rem" }} />
          Back to Collections
        </BackLink>

        <CollectionHeader>
          <CollectionTitle>{collection.name}</CollectionTitle>
          {collection.description && (
            <CollectionDescription>
              {collection.description}
            </CollectionDescription>
          )}
          <HeaderMeta>
            {collection.isPublic ? (
              <PublicBadge>Public</PublicBadge>
            ) : (
              <PrivateBadge>Private</PrivateBadge>
            )}
            <OwnerRow>
              <UserAvatar
                src={collection.owner.avatarUrl}
                displayName={
                  collection.owner.displayName ?? collection.owner.username
                }
                size="sm"
              />
              {collection.owner.displayName ?? collection.owner.username}
            </OwnerRow>
          </HeaderMeta>
        </CollectionHeader>

        <SectionTitle>
          {collection.recipes.length} Recipe
          {collection.recipes.length !== 1 ? "s" : ""}
        </SectionTitle>

        {collection.recipes.length === 0 ? (
          <EmptyState>No recipes yet.</EmptyState>
        ) : (
          <RecipeGridWrapper>
            {collection.recipes.map((recipe) =>
              isOwner ? (
                <RecipeCardWrapper key={recipe.id}>
                  <RecipeCard recipe={recipe} />
                  <RemoveBtn
                    type="button"
                    onClick={() => handleRemoveRecipe(recipe.id, recipe.title)}
                  >
                    Remove
                  </RemoveBtn>
                </RecipeCardWrapper>
              ) : (
                <div key={recipe.id}>
                  <RecipeCard recipe={recipe} />
                </div>
              ),
            )}
          </RecipeGridWrapper>
        )}
      </PageWrapper>
    </PageContainer>
  );
}
