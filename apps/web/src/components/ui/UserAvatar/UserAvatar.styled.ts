import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import type { UserAvatarSize } from "./UserAvatar.types.js";

const SIZE_MAP: Record<UserAvatarSize, string> = {
  sm: "26px",
  md: "36px",
  lg: "48px",
};

const FONT_SIZE_MAP: Record<UserAvatarSize, string> = {
  sm: "0.68rem",
  md: "0.85rem",
  lg: "1.1rem",
};

export const StyledAvatar = styled(Avatar)<{ $size: UserAvatarSize }>`
  width: ${({ $size }) => SIZE_MAP[$size]} !important;
  height: ${({ $size }) => SIZE_MAP[$size]} !important;
  font-size: ${({ $size }) => FONT_SIZE_MAP[$size]} !important;
  background: linear-gradient(135deg, #e85d26, #ff8c5a) !important;
  font-weight: 700 !important;
  border: 1.5px solid rgba(232, 93, 38, 0.2) !important;
  flex-shrink: 0;
`;
