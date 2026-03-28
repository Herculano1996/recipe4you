import styled, { keyframes } from "styled-components";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const HeroSection = styled(Box)`
  position: relative;
  min-height: 600px;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0d1f17 100%);

  @media (max-width: 768px) {
    min-height: 500px;
  }
`;

export const HeroBackground = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
`;

export const HeroBlob = styled.div<{ $which: 1 | 2 | 3 }>`
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.35;

  ${({ $which }) =>
    $which === 1 &&
    `
    width: 600px;
    height: 600px;
    top: -200px;
    right: -100px;
    background: radial-gradient(circle, #e85d26 0%, transparent 70%);
  `}

  ${({ $which }) =>
    $which === 2 &&
    `
    width: 400px;
    height: 400px;
    bottom: -150px;
    left: 10%;
    background: radial-gradient(circle, #2d6a4f 0%, transparent 70%);
  `}

  ${({ $which }) =>
    $which === 3 &&
    `
    width: 300px;
    height: 300px;
    top: 30%;
    left: 40%;
    background: radial-gradient(circle, #ff8c5a 0%, transparent 70%);
    opacity: 0.2;
  `}
`;

export const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;

  @media (max-width: 600px) {
    padding: 60px 16px;
  }
`;

export const HeroBadge = styled(Chip)`
  background: rgba(232, 93, 38, 0.15) !important;
  color: #ff8c5a !important;
  border: 1px solid rgba(232, 93, 38, 0.3) !important;
  font-weight: 600 !important;
  font-size: 0.75rem !important;
  letter-spacing: 0.5px !important;
  margin-bottom: 24px !important;
  animation: ${fadeUp} 0.6s ease both;
`;

export const HeroHeading = styled(Typography)`
  font-size: clamp(2.5rem, 6vw, 4.5rem) !important;
  font-weight: 900 !important;
  line-height: 1.05 !important;
  letter-spacing: -2px !important;
  color: #ffffff !important;
  max-width: 800px;
  animation: ${fadeUp} 0.6s ease 0.1s both;

  @media (max-width: 600px) {
    letter-spacing: -1px !important;
  }
`;

export const HeadingAccent = styled.span`
  background: linear-gradient(135deg, #e85d26 0%, #ff8c5a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const HeroSubheading = styled(Typography)`
  font-size: clamp(1rem, 2vw, 1.25rem) !important;
  color: rgba(255, 255, 255, 0.55) !important;
  max-width: 560px;
  line-height: 1.6 !important;
  margin-top: 20px !important;
  animation: ${fadeUp} 0.6s ease 0.2s both;
`;

export const HeroSearchWrapper = styled.div`
  width: 100%;
  max-width: 680px;
  margin-top: 40px;
  animation: ${fadeUp} 0.6s ease 0.3s both;
`;

export const HeroStats = styled.div`
  display: flex;
  gap: 40px;
  margin-top: 48px;
  animation: ${fadeUp} 0.6s ease 0.4s both;

  @media (max-width: 480px) {
    gap: 24px;
  }
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

export const StatNumber = styled(Typography)`
  font-size: 1.75rem !important;
  font-weight: 800 !important;
  color: #ffffff !important;
  line-height: 1 !important;
`;

export const StatLabel = styled(Typography)`
  font-size: 0.8125rem !important;
  color: rgba(255, 255, 255, 0.4) !important;
  letter-spacing: 0.3px !important;
`;

export const SectionWrapper = styled.section`
  padding: 80px 0;

  @media (max-width: 768px) {
    padding: 56px 0;
  }
`;

export const SectionInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;

  @media (max-width: 600px) {
    padding: 0 16px;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 40px;
  gap: 16px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 28px;
  }
`;

export const SectionLabel = styled(Typography)`
  font-size: 0.75rem !important;
  font-weight: 700 !important;
  letter-spacing: 1.5px !important;
  text-transform: uppercase;
  color: #e85d26 !important;
  margin-bottom: 6px !important;
`;

export const SectionTitle = styled(Typography)`
  font-size: clamp(1.5rem, 3vw, 2rem) !important;
  font-weight: 800 !important;
  letter-spacing: -0.5px !important;
  color: #1a1a1a !important;
  line-height: 1.2 !important;
`;

export const ViewAllButton = styled(Button)`
  color: #e85d26 !important;
  font-weight: 600 !important;
  text-transform: none !important;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    background: rgba(232, 93, 38, 0.06) !important;
  }
`;

export const CategoryStrip = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const CategoryChip = styled(Chip)<{ $active?: boolean }>`
  font-weight: ${({ $active }) => ($active ? "700" : "500")} !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
  flex-shrink: 0;

  ${({ $active }) =>
    $active
      ? `
    background: #e85d26 !important;
    color: #ffffff !important;
  `
      : `
    background: rgba(0,0,0,0.06) !important;
    color: #555 !important;
    &:hover { background: rgba(0,0,0,0.1) !important; }
  `}
`;

export const CtaBanner = styled.div`
  background: linear-gradient(135deg, #e85d26 0%, #ff8c5a 60%, #ffb347 100%);
  border-radius: 24px;
  padding: 56px 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  overflow: hidden;
  position: relative;
  margin: 0 24px 80px;
  max-width: 1152px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 40px 24px;
    margin: 0 16px 56px;
  }
`;

export const CtaText = styled.div`
  position: relative;
  z-index: 1;
`;

export const CtaHeading = styled(Typography)`
  font-size: clamp(1.5rem, 3vw, 2rem) !important;
  font-weight: 800 !important;
  color: #ffffff !important;
  letter-spacing: -0.5px !important;
  line-height: 1.2 !important;
  margin-bottom: 8px !important;
`;

export const CtaSubheading = styled(Typography)`
  color: rgba(255, 255, 255, 0.75) !important;
  font-size: 1rem !important;
  line-height: 1.5 !important;
`;

export const CtaButton = styled(Button)`
  background: #ffffff !important;
  color: #e85d26 !important;
  font-weight: 700 !important;
  text-transform: none !important;
  border-radius: 12px !important;
  padding: 14px 32px !important;
  font-size: 1rem !important;
  white-space: nowrap;
  flex-shrink: 0;
  position: relative;
  z-index: 1;

  &:hover {
    background: rgba(255, 255, 255, 0.9) !important;
  }
`;

export const CtaDecoration = styled.div`
  position: absolute;
  right: -60px;
  top: -60px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  pointer-events: none;
`;
