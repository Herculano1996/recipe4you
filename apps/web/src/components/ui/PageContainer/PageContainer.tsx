import type { PageContainerProps } from "./PageContainer.types.js";
import { Container } from "./PageContainer.styled.js";

export function PageContainer({
  children,
  size = "lg",
  className,
}: PageContainerProps) {
  return (
    <Container $size={size} className={className}>
      {children}
    </Container>
  );
}
