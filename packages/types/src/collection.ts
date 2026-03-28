import type { RecipeSummary } from "./recipe.js";
import type { User } from "./user.js";

export interface Collection {
  id: string;
  name: string;
  description: string | null;
  coverImage: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  owner: Pick<User, "id" | "username" | "displayName" | "avatarUrl">;
  recipeCount?: number;
}

export interface CollectionWithRecipes extends Collection {
  recipes: Array<RecipeSummary & { sortOrder: number; addedAt: string }>;
}

export interface CreateCollectionInput {
  name: string;
  description?: string;
  isPublic?: boolean;
  coverImage?: string;
}

export type UpdateCollectionInput = Partial<CreateCollectionInput>;
