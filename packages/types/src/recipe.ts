import type { User } from "./user.js";

export type Difficulty = "EASY" | "MEDIUM" | "HARD" | "EXPERT";

export type TagCategory =
  | "GENERAL"
  | "DIETARY"
  | "CUISINE"
  | "MEAL_TYPE"
  | "OCCASION"
  | "COOKING_METHOD";

export interface Tag {
  id: string;
  name: string;
  slug: string;
  category: TagCategory;
}

export interface Ingredient {
  id: string;
  name: string;
  category: string | null;
}

export interface RecipeIngredient {
  id: string;
  ingredientId: string;
  ingredient: Ingredient;
  quantity: string;
  unit: string;
  notes: string | null;
  groupName: string | null;
  sortOrder: number;
}

export interface RecipeStep {
  id: string;
  stepNumber: number;
  title: string | null;
  description: string;
  duration: number | null;
  imageUrl: string | null;
}

export interface RecipeImage {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
}

export interface RecipeRating {
  id: string;
  score: number;
  comment: string | null;
  userId: string;
  createdAt: string;
}

export interface Recipe {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  difficulty: Difficulty;
  prepTime: number;
  cookTime: number;
  restTime: number;
  servings: number;
  calories: number | null;
  isPublished: boolean;
  isPublic: boolean;
  coverImage: string | null;
  sourceUrl: string | null;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: Pick<User, "id" | "username" | "displayName" | "avatarUrl">;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  images: RecipeImage[];
  tags: Tag[];
  averageRating?: number;
  ratingCount?: number;
  isFavorited?: boolean;
}

export interface RecipeSummary {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  difficulty: Difficulty;
  prepTime: number;
  cookTime: number;
  servings: number;
  coverImage: string | null;
  createdAt: string;
  authorId: string;
  author: Pick<User, "id" | "username" | "displayName" | "avatarUrl">;
  tags: Tag[];
  averageRating?: number;
  ratingCount?: number;
  isFavorited?: boolean;
}

export interface CreateRecipeInput {
  title: string;
  description?: string;
  difficulty: Difficulty;
  prepTime: number;
  cookTime: number;
  restTime?: number;
  servings: number;
  calories?: number;
  coverImage?: string;
  sourceUrl?: string;
  ingredients: Array<{
    ingredientId: string;
    quantity: number;
    unit: string;
    notes?: string;
    groupName?: string;
    sortOrder?: number;
  }>;
  steps: Array<{
    stepNumber: number;
    title?: string;
    description: string;
    duration?: number;
    imageUrl?: string;
  }>;
  tagIds: string[];
}

export type UpdateRecipeInput = Partial<CreateRecipeInput>;

export interface RecipeFilters {
  q?: string;
  tag?: string | string[];
  ingredient?: string;
  difficulty?: Difficulty;
  maxTime?: number;
  dietary?: string;
  sort?: "newest" | "popular" | "rating" | "time";
  cursor?: string;
  limit?: number;
}
