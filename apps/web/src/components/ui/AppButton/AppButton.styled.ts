import styled from "styled-components";
import Button from "@mui/material/Button";
import type { AppButtonProps } from "./AppButton.types.js";

type StyledProps = { $appVariant: AppButtonProps["appVariant"] };

export const StyledButton = styled(Button)<StyledProps>`
  font-weight: 600 !important;
  font-size: 1rem !important;
  padding: 13px !important;
  border-radius: 12px !important;
  text-transform: none !important;
  transition: all 0.2s ease !important;

  ${({ $appVariant }) =>
    $appVariant === "primary" &&
    `
    background: linear-gradient(135deg, #e85d26 0%, #ff8c5a 100%) !important;
    color: #ffffff !important;
    box-shadow: 0 4px 16px rgba(232, 93, 38, 0.38) !important;
    margin-top: 8px !important;

    &:hover {
      box-shadow: 0 6px 24px rgba(232, 93, 38, 0.55) !important;
      transform: translateY(-1px);
    }

    &:disabled {
      background: rgba(0, 0, 0, 0.12) !important;
      color: rgba(0, 0, 0, 0.26) !important;
      box-shadow: none !important;
      transform: none !important;
    }
  `}

  ${({ $appVariant }) =>
    $appVariant === "secondary" &&
    `
    border: 2px solid #e85d26 !important;
    color: #e85d26 !important;
    background: transparent !important;

    &:hover {
      background: rgba(232, 93, 38, 0.06) !important;
    }
  `}

  ${({ $appVariant }) =>
    $appVariant === "ghost" &&
    `
    color: #6e6e6e !important;
    background: transparent !important;

    &:hover {
      background: rgba(0, 0, 0, 0.05) !important;
      color: #0f0f0f !important;
    }
  `}
`;
