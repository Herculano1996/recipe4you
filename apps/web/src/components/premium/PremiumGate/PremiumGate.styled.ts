import styled from "styled-components";
import { Box, Button, Paper } from "@mui/material";

export const GateWrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 2rem;
`;

export const GateCard = styled(Paper)`
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.06) 0%,
    rgba(255, 255, 255, 0.02) 100%
  );
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 3rem 2.5rem;
  max-width: 480px;
  width: 100%;
  text-align: center;
`;

export const IconRing = styled(Box)`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 8px 32px rgba(255, 107, 53, 0.35);
`;

export const UpgradeButton = styled(Button)`
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: #fff;
  border-radius: 50px;
  padding: 0.75rem 2.5rem;
  font-weight: 700;
  font-size: 1rem;
  text-transform: none;
  box-shadow: 0 4px 20px rgba(255, 107, 53, 0.4);
  margin-top: 1.5rem;

  &:hover {
    background: linear-gradient(135deg, #e85c2a 0%, #e07f15 100%);
    box-shadow: 0 6px 28px rgba(255, 107, 53, 0.5);
  }
`;
