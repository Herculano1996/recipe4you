import styled, { css } from "styled-components";
import type { ContainerSize } from "./PageContainer.types.js";

const maxWidths: Record<ContainerSize, string> = {
  sm: "640px",
  md: "900px",
  lg: "1200px",
  xl: "1400px",
  full: "100%",
};

export const Container = styled.div<{ $size: ContainerSize }>`
  width: 100%;
  max-width: ${({ $size }) => maxWidths[$size]};
  margin: 0 auto;
  padding: 0 24px;

  @media (max-width: 600px) {
    padding: 0 16px;
  }

  ${({ $size }) =>
    $size === "full" &&
    css`
      padding: 0;
    `}
`;
