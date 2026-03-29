import styled from "styled-components";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export const PageWrapper = styled(Box)`
  padding-top: 40px;
  padding-bottom: 48px;
  max-width: 640px;
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
`;

export const SectionTitle = styled(Typography)`
  font-size: 1.4rem !important;
  font-weight: 700 !important;
  color: #1a1a1a !important;
  margin-bottom: 24px !important;
`;

export const FormCard = styled(Box)`
  background: #fff;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  padding: 32px;
`;

export const AvatarEditWrapper = styled(Box)`
  position: relative;
  display: inline-block;
  cursor: pointer;
  margin-bottom: 24px;
`;

export const AvatarEditOverlay = styled(Box)`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

export const EditIcon = styled.span`
  color: #fff;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
`;

export const FormStack = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const SaveRow = styled(Box)`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
`;
