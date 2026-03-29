import type { ButtonProps } from "@mui/material/Button";
import type { ReactNode } from "react";

export interface AppButtonProps extends Omit<ButtonProps, "variant"> {
  loading?: boolean;
  appVariant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
}
