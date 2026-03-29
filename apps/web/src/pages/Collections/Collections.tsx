import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import {
  PageContainer,
  AppButton,
  AppTextField,
} from "../../components/ui/index.js";
import {
  useCollections,
  useCreateCollection,
  useDeleteCollection,
} from "../../hooks/useCollections.js";
import { collectionSchema } from "./Collections.types.js";
import type { CollectionForm } from "./Collections.types.js";
import {
  PageWrapper,
  PageHeader,
  PageTitle,
  CollectionGrid,
  CollectionCard,
  CollectionName,
  CollectionDesc,
  CollectionMeta,
  RecipeCount,
  PublicBadge,
  NewCollectionForm,
  FormRow,
  EmptyState,
  EmptyTitle,
  EmptyText,
  DeleteBtn,
} from "./Collections.styled.js";

export default function CollectionsPage() {
  const navigate = useNavigate();
  const { data: collections, isLoading } = useCollections();
  const createCollection = useCreateCollection();
  const deleteCollection = useDeleteCollection();
  const [showForm, setShowForm] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CollectionForm>({
    resolver: zodResolver(collectionSchema),
    defaultValues: { name: "", description: "", isPublic: false },
  });

  const onSubmit = (data: CollectionForm) => {
    createCollection.mutate(
      {
        name: data.name,
        description: data.description || undefined,
        isPublic: data.isPublic ?? false,
      },
      {
        onSuccess: () => {
          reset();
          setShowForm(false);
        },
      },
    );
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Delete this collection?")) return;
    deleteCollection.mutate(id);
  };

  return (
    <PageContainer>
      <PageWrapper>
        <PageHeader>
          <PageTitle>My Collections</PageTitle>
          <AppButton
            onClick={() => setShowForm((v) => !v)}
            appVariant={showForm ? "secondary" : "primary"}
          >
            {showForm ? "Cancel" : "New Collection"}
          </AppButton>
        </PageHeader>

        {showForm && (
          <NewCollectionForm onSubmit={handleSubmit(onSubmit)} noValidate>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <AppTextField
                  {...field}
                  label="Collection Name"
                  error={Boolean(errors.name)}
                  helperText={errors.name?.message}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <AppTextField
                  {...field}
                  label="Description (optional)"
                  multiline
                  rows={2}
                  error={Boolean(errors.description)}
                  helperText={errors.description?.message}
                />
              )}
            />
            <FormRow>
              <Controller
                name="isPublic"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value ?? false}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Make public"
                  />
                )}
              />
              <AppButton type="submit" loading={createCollection.isPending}>
                Create
              </AppButton>
            </FormRow>
          </NewCollectionForm>
        )}

        {isLoading && (
          <CollectionGrid>
            {[0, 1, 2].map((i) => (
              <Box key={i}>
                <Skeleton
                  variant="rectangular"
                  height={140}
                  sx={{ borderRadius: "16px" }}
                />
              </Box>
            ))}
          </CollectionGrid>
        )}

        {!isLoading && collections && collections.length === 0 && (
          <EmptyState>
            <EmptyTitle>No collections yet</EmptyTitle>
            <EmptyText>
              Create your first collection to organise your favourite recipes.
            </EmptyText>
          </EmptyState>
        )}

        {!isLoading && collections && collections.length > 0 && (
          <CollectionGrid>
            {collections.map((collection) => (
              <CollectionCard
                key={collection.id}
                onClick={() => navigate(`/collections/${collection.id}`)}
              >
                <CollectionName>{collection.name}</CollectionName>
                {collection.description && (
                  <CollectionDesc>{collection.description}</CollectionDesc>
                )}
                <CollectionMeta>
                  <RecipeCount>
                    {collection.recipeCount ?? 0} recipe
                    {(collection.recipeCount ?? 0) !== 1 ? "s" : ""}
                  </RecipeCount>
                  {collection.isPublic ? (
                    <PublicBadge>Public</PublicBadge>
                  ) : (
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "#666",
                        fontWeight: 600,
                      }}
                    >
                      Private
                    </span>
                  )}
                </CollectionMeta>
                <DeleteBtn
                  type="button"
                  onClick={(e) => handleDelete(e, collection.id)}
                >
                  Delete
                </DeleteBtn>
              </CollectionCard>
            ))}
          </CollectionGrid>
        )}
      </PageWrapper>
    </PageContainer>
  );
}
