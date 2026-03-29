import styled from "styled-components";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export const HeroSection = styled(Box)`
  text-align: center;
  padding: 5rem 0 3rem;
`;

export const GradientHeading = styled.span`
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const PricingCard = styled(Paper)<{ $featured?: boolean }>`
  border-radius: 24px;
  padding: 2.5rem 2rem;
  border: ${({ $featured }) =>
    $featured
      ? "2px solid rgba(255,107,53,0.6)"
      : "1px solid rgba(255,255,255,0.08)"};
  background: ${({ $featured }) =>
    $featured
      ? "linear-gradient(135deg, rgba(255,107,53,0.08) 0%, rgba(247,147,30,0.04) 100%)"
      : "rgba(255,255,255,0.03)"};
  position: relative;
`;

export const FeatureCard = styled(Paper)`
  border-radius: 16px;
  padding: 1.75rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  height: 100%;
`;

export const FeatureIconBox = styled(Box)`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: linear-gradient(
    135deg,
    rgba(255, 107, 53, 0.15) 0%,
    rgba(247, 147, 30, 0.08) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  color: #ff6b35;
`;

export const CtaButton = styled(Button)`
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%) !important;
  color: #fff !important;
  border-radius: 50px !important;
  padding: 0.85rem 2.5rem !important;
  font-weight: 700 !important;
  font-size: 1.05rem !important;
  text-transform: none !important;
  box-shadow: 0 4px 20px rgba(255, 107, 53, 0.4) !important;

  &:hover {
    box-shadow: 0 6px 28px rgba(255, 107, 53, 0.55) !important;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
  }
`;

export const ManageButton = styled(Button)`
  border-radius: 24px !important;
  text-transform: none !important;
`;
