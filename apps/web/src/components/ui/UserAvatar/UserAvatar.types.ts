export type UserAvatarSize = "sm" | "md" | "lg";

export interface UserAvatarProps {
  src?: string | null;
  displayName?: string | null;
  size?: UserAvatarSize;
}
