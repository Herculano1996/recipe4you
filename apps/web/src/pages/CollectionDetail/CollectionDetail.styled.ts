import styled from "styled-components";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export const PageWrapper = styled(Box)`
  padding-top: 32px;
  padding-bottom: 48px;
`;

export const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #e85d26;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 24px;
  background: none;
  border: none;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

export const CollectionHeader = styled(Box)`
  margin-bottom: 32px;
`;

export const CollectionTitle = styled(Typography)`
  font-size: 2rem !important;
  font-weight: 700 !important;
  color: #1a1a1a !important;
`;

export const CollectionDescription = styled(Typography)`
  color: #6e6e6e !important;
  margin-top: 8px !important;
  font-size: 0.95rem !important;
  line-height: 1.6 !important;
`;

export const HeaderMeta = styled(Box)`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
  flex-wrap: wrap;
`;

export const PublicBadge = styled.span`
  background: rgba(232, 93, 38, 0.1);
  color: #e85d26;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 0.78rem;
  font-weight: 600;
`;

export const PrivateBadge = styled.span`
  background: rgba(0, 0, 0, 0.06);
  color: #666;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 0.78rem;
  font-weight: 600;
`;

export const OwnerRow = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: #6e6e6e;
`;

export const SectionTitle = styled(Typography)`
  font-size: 1.2rem !important;
  font-weight: 600 !important;
  color: #1a1a1a !important;
  margin-bottom: 16px !important;
`;

export const EmptyState = styled(Box)`
  text-align: center;
  padding-top: 60px;
  padding-bottom: 60px;
  color: #6e6e6e;
`;

export const RecipeGridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`;

export const RemoveBtn = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  cursor: pointer;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 0.75rem;
  color: #d32f2f;

  &:hover {
    background: #fff;
  }
`;

export const RecipeCardWrapper = styled.div`
  position: relative;
`;
