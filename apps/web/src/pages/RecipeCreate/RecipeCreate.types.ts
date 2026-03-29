import { z } from "zod";

const toOptionalNumber = (v: unknown): unknown =>
  v === "" || v === null || v === undefined ? undefined : v;

export const ingredientRowSchema = z.object({
  ingredientName: z.string().min(1, "Required"),
  ingredientId: z.string().optional(),
  quantity: z.coerce.number().positive("Must be > 0"),
  unit: z.string().min(1, "Required"),
  notes: z.string().optional(),
  groupName: z.string().optional(),
});

export const stepRowSchema = z.object({
  title: z.string().optional(),
  description: z.string().min(1, "Required"),
  duration: z.preprocess(toOptionalNumber, z.coerce.number().optional()),
});

export const recipeFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(1000).optional(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD", "EXPERT"]),
  prepTime: z.coerce.number().min(0),
  cookTime: z.coerce.number().min(0),
  servings: z.coerce.number().min(1),
  calories: z.preprocess(toOptionalNumber, z.coerce.number().optional()),
  coverImage: z.string().optional(),
  ingredients: z
    .array(ingredientRowSchema)
    .min(1, "Add at least one ingredient"),
  steps: z.array(stepRowSchema).min(1, "Add at least one step"),
  tagIds: z.array(z.string()).optional(),
});

export type RecipeForm = z.infer<typeof recipeFormSchema>;
export type IngredientRow = z.infer<typeof ingredientRowSchema>;
export type StepRow = z.infer<typeof stepRowSchema>;
