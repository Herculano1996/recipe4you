import styled from "styled-components";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

export const PageHeader = styled(Box)`
  padding: 4rem 0 2rem;
  text-align: center;
`;

export const GradientText = styled.span`
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const AiIconBox = styled(Box)`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  box-shadow: 0 8px 32px rgba(255, 107, 53, 0.35);
`;

export const ResultCard = styled(Paper)`
  border-radius: 20px;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-top: 2rem;
`;

export const StepCircle = styled(Box)`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-weight: 700;
  font-size: 0.85rem;
  color: #fff;
`;

export const GenerateButton = styled(Button)`
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%) !important;
  color: #fff !important;
  border-radius: 50px !important;
  padding: 0.75rem 2.5rem !important;
  font-weight: 700 !important;
  text-transform: none !important;
  box-shadow: 0 4px 20px rgba(255, 107, 53, 0.35) !important;

  &:disabled {
    opacity: 0.6;
  }
`;

export const AddButton = styled(Button)`
  border-radius: 8px !important;
  text-transform: none !important;
  white-space: nowrap;
`;
