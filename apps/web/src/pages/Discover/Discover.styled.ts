import styled from "styled-components";
import Button from "@mui/material/Button";

export const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px 80px;

  @media (max-width: 600px) {
    padding: 24px 16px 60px;
  }
`;

export const PageHeader = styled.div`
  margin-bottom: 32px;
`;

export const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: #0f0f0f;
  margin: 0 0 4px;
`;

export const PageSubtitle = styled.p`
  font-size: 1rem;
  color: #6e6e6e;
  margin: 0;
`;

export const FiltersRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 20px;
`;

export const DietaryStrip = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 16px;
`;

export const LoadMoreWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 48px;
`;

export const LoadMoreButton = styled(Button)`
  border-color: rgba(232, 93, 38, 0.4) !important;
  color: #e85d26 !important;
  font-weight: 600 !important;
  text-transform: none !important;
  padding: 10px 32px !important;
  border-radius: 12px !important;

  &:hover {
    border-color: #e85d26 !important;
    background: rgba(232, 93, 38, 0.05) !important;
  }
`;

export const ClearFiltersButton = styled(Button)`
  text-transform: none !important;
  color: #9e9e9e !important;
`;
