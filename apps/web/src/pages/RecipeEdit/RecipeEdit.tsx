import { useEffect, useRef } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router";
import MenuItem from "@mui/material/MenuItem";
import Skeleton from "@mui/material/Skeleton";
import type { FieldErrors } from "react-hook-form";
import type { UpdateRecipeInput } from "@recipe4you/types";
import { useRecipeDetail } from "../../hooks/useRecipeDetail.js";
import { useUpdateRecipe } from "../../hooks/useRecipeMutations.js";
import { useUploadRecipeImage } from "../../hooks/useUpload.js";
import { useTags } from "../../hooks/useTags.js";
import {
  AppTextField,
  AppButton,
  AppAlert,
} from "../../components/ui/index.js";
import {
  recipeFormSchema,
  type RecipeForm,
  type IngredientRow,
} from "../RecipeCreate/RecipeCreate.types.js";
import { IngredientAutocompleteRow } from "../RecipeCreate/RecipeCreate.js";
import * as S from "../RecipeCreate/RecipeCreate.styled.js";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DIFFICULTY_OPTIONS = [
  { value: "EASY" as const, label: "Easy" },
  { value: "MEDIUM" as const, label: "Medium" },
  { value: "HARD" as const, label: "Hard" },
  { value: "EXPERT" as const, label: "Expert" },
];

// ---------------------------------------------------------------------------
// RecipeEditPage
// ---------------------------------------------------------------------------

export default function RecipeEditPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: recipe, isLoading, isError } = useRecipeDetail(slug ?? "");
  const updateRecipe = useUpdateRecipe(recipe?.id ?? "");
  const uploadImage = useUploadRecipeImage();
  const { data: tags } = useTags();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<RecipeForm>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(recipeFormSchema) as any,
    defaultValues: {
      difficulty: "MEDIUM",
      prepTime: 0,
      cookTime: 0,
      servings: 1,
      ingredients: [],
      steps: [],
      tagIds: [],
    },
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({ control, name: "ingredients" });

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({ control, name: "steps" });

  // Prefill the form once recipe data is available
  useEffect(() => {
    if (!recipe) return;
    reset({
      title: recipe.title,
      description: recipe.description ?? "",
      difficulty: recipe.difficulty,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      servings: recipe.servings,
      calories: recipe.calories ?? undefined,
      coverImage: recipe.coverImage ?? undefined,
      ingredients: recipe.ingredients
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((ri) => ({
          ingredientName: ri.ingredient.name,
          ingredientId: ri.ingredientId,
          quantity: parseFloat(ri.quantity),
          unit: ri.unit,
          notes: ri.notes ?? "",
          groupName: ri.groupName ?? "",
        })),
      steps: recipe.steps
        .slice()
        .sort((a, b) => a.stepNumber - b.stepNumber)
        .map((step) => ({
          title: step.title ?? "",
          description: step.description,
          duration: step.duration ?? undefined,
        })),
      tagIds: recipe.tags.map((t) => t.id),
    });
  }, [recipe, reset]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const coverImageUrl = watch("coverImage");
  const tagIds = watch("tagIds") ?? [];

  const handleTagToggle = (tagId: string) => {
    if (tagIds.includes(tagId)) {
      setValue(
        "tagIds",
        tagIds.filter((id) => id !== tagId),
        {
          shouldDirty: true,
        },
      );
    } else {
      setValue("tagIds", [...tagIds, tagId], { shouldDirty: true });
    }
  };

  const handleImageZoneClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadImage.mutate(file, {
      onSuccess: (result) => {
        setValue("coverImage", result.url, { shouldDirty: true });
      },
    });
    e.target.value = "";
  };

  const onSubmit = (data: RecipeForm) => {
    const validIngredients = data.ingredients.filter((i) => !!i.ingredientId);

    const input: UpdateRecipeInput = {
      title: data.title,
      description: data.description ?? undefined,
      difficulty: data.difficulty,
      prepTime: data.prepTime,
      cookTime: data.cookTime,
      servings: data.servings,
      calories: data.calories ?? undefined,
      coverImage: data.coverImage ?? undefined,
      ingredients: validIngredients.map((ing, idx) => ({
        ingredientId: ing.ingredientId!,
        quantity: ing.quantity,
        unit: ing.unit,
        notes: ing.notes ?? undefined,
        groupName: ing.groupName ?? undefined,
        sortOrder: idx,
      })),
      steps: data.steps.map((step, idx) => ({
        stepNumber: idx + 1,
        title: step.title ?? undefined,
        description: step.description,
        duration: step.duration ?? undefined,
      })),
      tagIds: data.tagIds ?? [],
    };

    updateRecipe.mutate(input, {
      onSuccess: () => {
        navigate(`/recipes/${slug ?? ""}`);
      },
    });
  };

  // Array-level validation errors
  const ingredientsRootError =
    (errors.ingredients as { root?: { message?: string } } | undefined)?.root
      ?.message ??
    (errors.ingredients as { message?: string } | undefined)?.message;

  const stepsRootError =
    (errors.steps as { root?: { message?: string } } | undefined)?.root
      ?.message ?? (errors.steps as { message?: string } | undefined)?.message;

  // -------------------------------------------------------------------------
  // Loading state
  // -------------------------------------------------------------------------
  if (isLoading) {
    return (
      <S.PageWrapper>
        <Skeleton variant="text" height={56} width="40%" sx={{ mb: 3 }} />
        <Skeleton
          variant="rectangular"
          height={200}
          sx={{ borderRadius: 2, mb: 2 }}
        />
        <Skeleton
          variant="rectangular"
          height={160}
          sx={{ borderRadius: 2, mb: 2 }}
        />
        <Skeleton
          variant="rectangular"
          height={160}
          sx={{ borderRadius: 2, mb: 2 }}
        />
      </S.PageWrapper>
    );
  }

  // -------------------------------------------------------------------------
  // Error / not found state
  // -------------------------------------------------------------------------
  if (isError || !recipe) {
    return (
      <S.PageWrapper>
        <AppAlert severity="error" sx={{ mt: 4 }}>
          Recipe not found or an error occurred. Please go back and try again.
        </AppAlert>
        <S.SubmitRow>
          <AppButton
            appVariant="ghost"
            type="button"
            onClick={() => navigate(-1)}
          >
            Go Back
          </AppButton>
        </S.SubmitRow>
      </S.PageWrapper>
    );
  }

  // -------------------------------------------------------------------------
  // Form
  // -------------------------------------------------------------------------
  return (
    <S.PageWrapper>
      <S.PageTitle>Edit Recipe</S.PageTitle>

      {updateRecipe.isError && (
        <AppAlert severity="error" sx={{ mb: 3 }}>
          {(updateRecipe.error as Error)?.message ??
            "Failed to update recipe. Please try again."}
        </AppAlert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* ---------------------------------------------------------------- */}
        {/* Section 1: Basic Information                                      */}
        {/* ---------------------------------------------------------------- */}
        <S.Section>
          <S.SectionTitle>
            <S.SectionIcon>📝</S.SectionIcon>
            Basic Information
          </S.SectionTitle>

          <AppTextField
            label="Title *"
            {...register("title")}
            error={!!errors.title}
            helperText={errors.title?.message}
            sx={{ mb: 2 }}
            fullWidth
          />

          <AppTextField
            label="Description"
            {...register("description")}
            multiline
            rows={3}
            error={!!errors.description}
            helperText={errors.description?.message}
            sx={{ mb: 2 }}
            fullWidth
          />

          <S.FormGrid>
            <div>
              <S.FieldLabel>Difficulty</S.FieldLabel>
              <Controller
                name="difficulty"
                control={control}
                render={({ field }) => (
                  <AppTextField select size="small" fullWidth {...field}>
                    {DIFFICULTY_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </AppTextField>
                )}
              />
            </div>

            <div>
              <S.FieldLabel>Prep Time (min)</S.FieldLabel>
              <AppTextField
                size="small"
                type="number"
                inputProps={{ min: 0 }}
                {...register("prepTime")}
                error={!!errors.prepTime}
                helperText={errors.prepTime?.message}
                fullWidth
              />
            </div>

            <div>
              <S.FieldLabel>Cook Time (min)</S.FieldLabel>
              <AppTextField
                size="small"
                type="number"
                inputProps={{ min: 0 }}
                {...register("cookTime")}
                error={!!errors.cookTime}
                helperText={errors.cookTime?.message}
                fullWidth
              />
            </div>

            <div>
              <S.FieldLabel>Servings</S.FieldLabel>
              <AppTextField
                size="small"
                type="number"
                inputProps={{ min: 1 }}
                {...register("servings")}
                error={!!errors.servings}
                helperText={errors.servings?.message}
                fullWidth
              />
            </div>

            <div>
              <S.FieldLabel>Calories (optional)</S.FieldLabel>
              <AppTextField
                size="small"
                type="number"
                inputProps={{ min: 0 }}
                {...register("calories")}
                error={!!errors.calories}
                helperText={errors.calories?.message as string | undefined}
                fullWidth
              />
            </div>
          </S.FormGrid>
        </S.Section>

        {/* ---------------------------------------------------------------- */}
        {/* Section 2: Cover Image                                            */}
        {/* ---------------------------------------------------------------- */}
        <S.Section>
          <S.SectionTitle>
            <S.SectionIcon>🖼️</S.SectionIcon>
            Cover Image
          </S.SectionTitle>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
            aria-label="Upload cover image"
          />

          {coverImageUrl ? (
            <div>
              <S.ImagePreview src={coverImageUrl} alt="Recipe cover preview" />
              <AppButton
                appVariant="ghost"
                type="button"
                sx={{ mt: 1 }}
                onClick={handleImageZoneClick}
                loading={uploadImage.isPending}
              >
                Change Image
              </AppButton>
            </div>
          ) : (
            <S.ImageZone
              onClick={handleImageZoneClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleImageZoneClick();
              }}
              aria-label="Click to upload cover image"
            >
              {uploadImage.isPending ? (
                <span style={{ color: "#888" }}>Uploading…</span>
              ) : (
                <>
                  <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>📷</div>
                  <div style={{ fontWeight: 600, color: "#555" }}>
                    Click to upload a cover image
                  </div>
                  <div
                    style={{ fontSize: "0.8rem", color: "#999", marginTop: 4 }}
                  >
                    JPG, PNG, WebP
                  </div>
                </>
              )}
            </S.ImageZone>
          )}

          {uploadImage.isError && (
            <AppAlert severity="error" sx={{ mt: 1 }}>
              {(uploadImage.error as Error)?.message ?? "Image upload failed."}
            </AppAlert>
          )}
        </S.Section>

        {/* ---------------------------------------------------------------- */}
        {/* Section 3: Ingredients                                            */}
        {/* ---------------------------------------------------------------- */}
        <S.Section>
          <S.SectionTitle>
            <S.SectionIcon>🥕</S.SectionIcon>
            Ingredients
          </S.SectionTitle>

          {ingredientsRootError && (
            <AppAlert severity="error" sx={{ mb: 2 }}>
              {ingredientsRootError}
            </AppAlert>
          )}

          {ingredientFields.map((field, index) => (
            <IngredientAutocompleteRow
              key={field.id}
              index={index}
              register={register}
              setValue={setValue}
              remove={removeIngredient}
              canRemove={ingredientFields.length > 1}
              errors={
                errors.ingredients?.[index] as
                  | FieldErrors<IngredientRow>
                  | undefined
              }
            />
          ))}

          <S.AddBtn
            type="button"
            onClick={() =>
              appendIngredient({
                ingredientName: "",
                ingredientId: undefined,
                quantity: 1,
                unit: "",
                notes: "",
                groupName: "",
              })
            }
          >
            + Add Ingredient
          </S.AddBtn>
        </S.Section>

        {/* ---------------------------------------------------------------- */}
        {/* Section 4: Steps                                                  */}
        {/* ---------------------------------------------------------------- */}
        <S.Section>
          <S.SectionTitle>
            <S.SectionIcon>📋</S.SectionIcon>
            Steps
          </S.SectionTitle>

          {stepsRootError && (
            <AppAlert severity="error" sx={{ mb: 2 }}>
              {stepsRootError}
            </AppAlert>
          )}

          {stepFields.map((field, index) => (
            <S.StepRow key={field.id}>
              <S.StepNumber aria-label={`Step ${index + 1}`}>
                {index + 1}
              </S.StepNumber>
              <S.StepFields>
                <AppTextField
                  size="small"
                  placeholder="Step title (optional)"
                  {...register(`steps.${index}.title`)}
                  fullWidth
                />
                <AppTextField
                  size="small"
                  placeholder="Description *"
                  multiline
                  rows={2}
                  {...register(`steps.${index}.description`)}
                  error={!!errors.steps?.[index]?.description}
                  helperText={errors.steps?.[index]?.description?.message}
                  fullWidth
                />
                <AppTextField
                  size="small"
                  type="number"
                  placeholder="Duration (min, optional)"
                  inputProps={{ min: 0 }}
                  {...register(`steps.${index}.duration`)}
                  fullWidth
                />
              </S.StepFields>
              {stepFields.length > 1 && (
                <S.RemoveBtn
                  type="button"
                  aria-label={`Remove step ${index + 1}`}
                  onClick={() => removeStep(index)}
                >
                  ✕
                </S.RemoveBtn>
              )}
            </S.StepRow>
          ))}

          <S.AddBtn
            type="button"
            onClick={() => appendStep({ title: "", description: "" })}
          >
            + Add Step
          </S.AddBtn>
        </S.Section>

        {/* ---------------------------------------------------------------- */}
        {/* Section 5: Tags                                                   */}
        {/* ---------------------------------------------------------------- */}
        <S.Section>
          <S.SectionTitle>
            <S.SectionIcon>🏷️</S.SectionIcon>
            Tags
          </S.SectionTitle>

          {tags && tags.length > 0 ? (
            <S.TagGrid role="group" aria-label="Recipe tags">
              {tags.map((tag) => {
                const isSelected = tagIds.includes(tag.id);
                return (
                  <S.TagChip
                    key={tag.id}
                    type="button"
                    $selected={isSelected}
                    onClick={() => handleTagToggle(tag.id)}
                    aria-pressed={isSelected}
                  >
                    {tag.name}
                  </S.TagChip>
                );
              })}
            </S.TagGrid>
          ) : (
            <span style={{ color: "#999", fontSize: "0.875rem" }}>
              No tags available.
            </span>
          )}
        </S.Section>

        {/* ---------------------------------------------------------------- */}
        {/* Submit Row                                                        */}
        {/* ---------------------------------------------------------------- */}
        <S.SubmitRow>
          <AppButton
            appVariant="ghost"
            type="button"
            onClick={() => navigate(-1)}
          >
            Cancel
          </AppButton>
          <AppButton
            appVariant="primary"
            type="submit"
            loading={updateRecipe.isPending}
          >
            Save Changes
          </AppButton>
        </S.SubmitRow>
      </form>
    </S.PageWrapper>
  );
}
