import styled, { css } from "styled-components";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

type Size = "sm" | "md" | "lg";

const sizeStyles: Record<Size, ReturnType<typeof css>> = {
  sm: css`
    height: 40px;
    font-size: 0.875rem;
    border-radius: 10px;
  `,
  md: css`
    height: 52px;
    font-size: 1rem;
    border-radius: 14px;
  `,
  lg: css`
    height: 64px;
    font-size: 1.1rem;
    border-radius: 16px;
  `,
};

export const SearchWrapper = styled(Box)<{ $size: Size }>`
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 2px solid rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  width: 100%;
  overflow: hidden;
  ${({ $size }) => sizeStyles[$size]}

  &:focus-within {
    border-color: #e85d26;
    box-shadow: 0 0 0 4px rgba(232, 93, 38, 0.1);
  }

  &:hover:not(:focus-within) {
    border-color: rgba(0, 0, 0, 0.2);
  }
`;

export const SearchIconWrapper = styled.div<{ $size: Size }>`
  display: flex;
  align-items: center;
  padding-left: ${({ $size }) =>
    $size === "lg" ? "20px" : $size === "md" ? "16px" : "12px"};
  color: #9e9e9e;
  flex-shrink: 0;
  transition: color 0.2s ease;

  ${SearchWrapper}:focus-within & {
    color: #e85d26;
  }

  svg {
    font-size: ${({ $size }) =>
      $size === "lg" ? "24px" : $size === "md" ? "22px" : "18px"} !important;
  }
`;

export const StyledInputBase = styled(InputBase)<{ $size: Size }>`
  flex: 1;
  padding: 0 ${({ $size }) => ($size === "lg" ? "20px" : "14px")} !important;

  .MuiInputBase-input {
    padding: 0 !important;
    font-size: inherit;
    font-weight: 400;
    color: #1a1a1a;

    &::placeholder {
      color: #b0b0b0;
      opacity: 1;
    }
  }
`;

export const ClearButton = styled(IconButton)`
  color: #b0b0b0 !important;
  width: 32px !important;
  height: 32px !important;
  margin-right: 6px !important;
  flex-shrink: 0;

  &:hover {
    color: #6e6e6e !important;
    background: rgba(0, 0, 0, 0.05) !important;
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
  border-radius: 0 !important;
  height: 100% !important;
  padding: 0
    ${({ $size }) =>
      $size === "lg" ? "28px" : $size === "md" ? "22px" : "16px"} !important;
  font-size: ${({ $size }) =>
    $size === "lg" ? "1rem" : "0.875rem"} !important;
  flex-shrink: 0;
  transition: filter 0.2s ease !important;

  &:hover {
    filter: brightness(1.08);
  }
`;
