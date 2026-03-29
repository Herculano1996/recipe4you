import styled from "styled-components";
import Button from "@mui/material/Button";

export const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 32px;
  padding-bottom: 48px;
  padding-left: 24px;
  padding-right: 24px;

  @media (max-width: 600px) {
    padding-left: 16px;
    padding-right: 16px;
  }
`;

export const PageHeader = styled.div`
  margin-bottom: 32px;
`;

export const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`;

export const PageSubtitle = styled.p`
  color: #6e6e6e;
  margin-top: 4px;
  font-size: 0.95rem;
  margin-bottom: 0;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding-top: 80px;
  padding-bottom: 80px;
`;

export const EmptyIcon = styled.span`
  font-size: 3rem;
  display: block;
  margin-bottom: 16px;
`;

export const EmptyTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
`;

export const EmptyText = styled.p`
  color: #6e6e6e;
  margin-top: 8px;
  margin-bottom: 24px;
`;

export const LoadMoreWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
`;

export const LoadMoreBtn = styled(Button)`
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
