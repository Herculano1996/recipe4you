export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  recipeCount: number;
  followerCount?: number;
}

export interface UpdateProfileInput {
  username?: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
}
