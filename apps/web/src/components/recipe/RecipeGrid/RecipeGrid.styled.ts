import styled from "styled-components";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export const Grid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const EmptyState = styled(Box)`
  text-align: center;
  padding: 80px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

export const EmptyIcon = styled.div`
  font-size: 4rem;
  line-height: 1;
`;

export const EmptyMessage = styled(Typography)`
  color: #6e6e6e !important;
  font-size: 1rem !important;
`;
