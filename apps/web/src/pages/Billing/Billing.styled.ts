import styled from "styled-components";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

export const BillingCard = styled(Paper)`
  border-radius: 24px;
  padding: 2.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  max-width: 560px;
`;

export const StatusDot = styled.span<{ $active: boolean }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? "#4caf50" : "#9e9e9e")};
  margin-right: 6px;
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
  margin: 0 0 32px;
`;

export const ManageButton = styled(Button)`
  border-radius: 24px !important;
  text-transform: none !important;
  font-weight: 600 !important;
`;

export const UpgradeButton = styled(Button)`
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%) !important;
  border-radius: 24px !important;
  text-transform: none !important;
  font-weight: 700 !important;
  padding: 8px 24px !important;
`;
