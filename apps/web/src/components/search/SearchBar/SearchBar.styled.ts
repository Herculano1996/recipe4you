import styled, { css } from "styled-components";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

type Size = "sm" | "md" | "lg";
type Variant = "light" | "dark";

const sizeStyles: Record<Size, ReturnType<typeof css>> = {
  sm: css`
    height: 44px;
    font-size: 0.875rem;
    border-radius: 12px;
  `,
  md: css`
    height: 54px;
    font-size: 1rem;
    border-radius: 14px;
  `,
  lg: css`
    height: 66px;
    font-size: 1.08rem;
    border-radius: 18px;
  `,
};

export const SearchWrapper = styled(Box)<{ $size: Size; $variant?: Variant }>`
  display: flex;
  align-items: center;
  background: ${({ $variant }) =>
    $variant === "dark" ? "rgba(255, 255, 255, 0.09)" : "#ffffff"};
  border: ${({ $variant }) =>
    $variant === "dark"
      ? "1.5px solid rgba(255, 255, 255, 0.16)"
      : "2px solid rgba(0, 0, 0, 0.10)"};
  backdrop-filter: ${({ $variant }) =>
    $variant === "dark" ? "blur(20px)" : "none"};
  -webkit-backdrop-filter: ${({ $variant }) =>
    $variant === "dark" ? "blur(20px)" : "none"};
  transition: all 0.22s ease;
  width: 100%;
  overflow: hidden;
  ${({ $size }) => sizeStyles[$size]}

  &:focus-within {
    border-color: ${({ $variant }) =>
      $variant === "dark" ? "rgba(255,255,255,0.42)" : "#e85d26"};
    box-shadow: ${({ $variant }) =>
      $variant === "dark"
        ? "0 0 0 4px rgba(255,255,255,0.07), 0 8px 32px rgba(0,0,0,0.28)"
        : "0 0 0 4px rgba(232, 93, 38, 0.12)"};
    background: ${({ $variant }) =>
      $variant === "dark" ? "rgba(255,255,255,0.13)" : "#ffffff"};
  }

  &:hover:not(:focus-within) {
    border-color: ${({ $variant }) =>
      $variant === "dark" ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.2)"};
    background: ${({ $variant }) =>
      $variant === "dark" ? "rgba(255,255,255,0.11)" : "#ffffff"};
  }
`;

export const SearchIconWrapper = styled.div<{
  $size: Size;
  $variant?: Variant;
}>`
  display: flex;
  align-items: center;
  padding-left: ${({ $size }) =>
    $size === "lg" ? "20px" : $size === "md" ? "16px" : "14px"};
  color: ${({ $variant }) =>
    $variant === "dark" ? "rgba(255,255,255,0.42)" : "#c0c0c0"};
  flex-shrink: 0;
  transition: color 0.2s ease;

  ${SearchWrapper}:focus-within & {
    color: ${({ $variant }) =>
      $variant === "dark" ? "rgba(255,255,255,0.78)" : "#e85d26"};
  }

  svg {
    font-size: ${({ $size }) =>
      $size === "lg" ? "24px" : $size === "md" ? "22px" : "18px"} !important;
  }
`;

export const StyledInputBase = styled(InputBase)<{
  $size: Size;
  $variant?: Variant;
}>`
  flex: 1;
  padding: 0 ${({ $size }) => ($size === "lg" ? "20px" : "14px")} !important;

  .MuiInputBase-input {
    padding: 0 !important;
    font-size: inherit;
    font-weight: 400;
    color: ${({ $variant }) => ($variant === "dark" ? "#ffffff" : "#1a1a1a")};

    &::placeholder {
      color: ${({ $variant }) =>
        $variant === "dark" ? "rgba(255,255,255,0.36)" : "#c0c0c0"};
      opacity: 1;
    }
  }
`;

export const ClearButton = styled(IconButton)<{ $variant?: Variant }>`
  color: ${({ $variant }) =>
    $variant === "dark" ? "rgba(255,255,255,0.38)" : "#c0c0c0"} !important;
  width: 32px !important;
  height: 32px !important;
  margin-right: 6px !important;
  flex-shrink: 0;

  &:hover {
    color: ${({ $variant }) =>
      $variant === "dark" ? "rgba(255,255,255,0.7)" : "#6e6e6e"} !important;
    background: ${({ $variant }) =>
      $variant === "dark"
        ? "rgba(255,255,255,0.08)"
        : "rgba(0,0,0,0.05)"} !important;
  }

  svg {
    font-size: 16px !important;
  }
`;

export const SearchButton = styled(Button)<{ $size: Size }>`
  background: linear-gradient(135deg, #e85d26 0%, #ff8c5a 100%) !important;
  color: #ffffff !important;
  font-weight: 600 !important;
  text-transform: none !important;
  border-radius: ${({ $size }) =>
    $size === "lg" ? "0 16px 16px 0" : "0 12px 12px 0"} !important;
  height: 100% !important;
  padding: 0
    ${({ $size }) =>
      $size === "lg" ? "28px" : $size === "md" ? "22px" : "16px"} !important;
  font-size: ${({ $size }) =>
    $size === "lg" ? "0.95rem" : "0.875rem"} !important;
  flex-shrink: 0;
  transition: filter 0.2s ease !important;

  &:hover {
    filter: brightness(1.1);
  }
`;
