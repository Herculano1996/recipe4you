import styled from "styled-components";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export const PageWrapper = styled(Box)`
  padding-top: 32px;
  padding-bottom: 48px;
`;

export const PageHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

export const PageTitle = styled(Typography)`
  font-size: 1.75rem !important;
  font-weight: 700 !important;
`;

export const CollectionGrid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 8px;
`;

export const CollectionCard = styled(Box)`
  background: #fff;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  padding: 20px;
  cursor: pointer;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

export const CollectionName = styled(Typography)`
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  color: #1a1a1a !important;
  margin-bottom: 4px !important;
`;

export const CollectionDesc = styled(Typography)`
  font-size: 0.875rem !important;
  color: #6e6e6e !important;
  margin-bottom: 12px !important;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

export const CollectionMeta = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const RecipeCount = styled(Typography)`
  font-size: 0.8rem !important;
  color: #6e6e6e !important;
`;

export const PublicBadge = styled(Typography)`
  font-size: 0.75rem !important;
  color: #e85d26 !important;
  font-weight: 600 !important;
`;

export const NewCollectionForm = styled.form`
  background: #f5f5f5;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FormRow = styled(Box)`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const EmptyState = styled(Box)`
  text-align: center;
  padding-top: 60px;
  padding-bottom: 60px;
`;

export const EmptyTitle = styled(Typography)`
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  color: #1a1a1a !important;
`;

export const EmptyText = styled(Typography)`
  color: #6e6e6e !important;
  margin-top: 8px !important;
`;

export const DeleteBtn = styled.button`
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  color: #d32f2f;
  font-size: 0.8rem;
  margin-top: 8px;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;
