import type { ReactNode } from "react";

export type ContainerSize = "sm" | "md" | "lg" | "xl" | "full";

export interface PageContainerProps {
  children: ReactNode;
  size?: ContainerSize;
  className?: string;
}
