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

export const TagHeader = styled.div`
  margin-bottom: 24px;
  text-align: center;
`;

export const TagName = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`;

export const CategoryBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(232, 93, 38, 0.12);
  color: #e85d26;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-top: 8px;
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
