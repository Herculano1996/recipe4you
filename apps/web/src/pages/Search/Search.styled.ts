import styled from "styled-components";

export const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px 80px;

  @media (max-width: 600px) {
    padding: 24px 16px 60px;
  }
`;

export const SearchHeader = styled.div`
  margin-bottom: 40px;
`;

export const SearchBarWrapper = styled.div`
  max-width: 680px;
  margin-bottom: 20px;
`;

export const ResultsLabel = styled.p`
  font-size: 0.875rem;
  color: #6e6e6e;
  margin: 0;
`;

export const ResultsError = styled.p`
  font-size: 0.875rem;
  color: #d32f2f;
  margin: 0;
`;

export const ResultsHeading = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.3px;
  color: #0f0f0f;
  margin: 8px 0 0;
`;
