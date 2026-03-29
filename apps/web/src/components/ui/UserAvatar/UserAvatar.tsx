import { StyledAvatar } from "./UserAvatar.styled.js";
import type { UserAvatarProps } from "./UserAvatar.types.js";

export function UserAvatar({ src, displayName, size = "md" }: UserAvatarProps) {
  const initial = displayName ? displayName.charAt(0).toUpperCase() : "?";

  return (
    <StyledAvatar
      $size={size}
      src={src ?? undefined}
      alt={displayName ?? undefined}
    >
      {!src && initial}
    </StyledAvatar>
  );
}
