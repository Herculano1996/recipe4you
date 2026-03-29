import styled from "styled-components";
import Chip from "@mui/material/Chip";

export const StyledChip = styled(Chip)<{ $color: string; $overlay: boolean }>`
  background: ${({ $color }) => $color} !important;
  color: #ffffff !important;
  font-weight: 600 !important;
  font-size: 0.72rem !important;
  height: 24px !important;
  border-radius: 6px !important;
  letter-spacing: 0.3px;

  .MuiChip-label {
    padding: 0 8px !important;
  }

  ${({ $overlay }) =>
    $overlay &&
    `
    position: absolute !important;
    top: 12px;
    left: 12px;
  `}
`;
