import { PageContainer } from "../PageContainer/PageContainer.js";
import { StubWrapper, StubTitle, StubText } from "./StubPage.styled.js";
import type { StubPageProps } from "./StubPage.types.js";

export function StubPage({
  title,
  description = "This page is under construction.",
}: StubPageProps) {
  return (
    <PageContainer size="lg">
      <StubWrapper>
        <StubTitle>{title}</StubTitle>
        <StubText>{description}</StubText>
      </StubWrapper>
    </PageContainer>
  );
}
