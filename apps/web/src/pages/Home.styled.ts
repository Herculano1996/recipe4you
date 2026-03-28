import styled, { keyframes } from "styled-components";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";

/* ─── Animations ─── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slowFloat = keyframes`
  0%, 100% { transform: translateY(0px) scale(1); }
  50%       { transform: translateY(-20px) scale(1.04); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50%       { opacity: 1; }
`;

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

/* ─── Hero ─── */
export const HeroSection = styled.section`
  /* Pull up by the main paddingTop so it starts at page top */
  margin-top: -88px;
  height: 100svh;
  min-height: 640px;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: #080808;
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
  filter: blur(100px);
  animation: ${slowFloat} 12s ease-in-out infinite;

  ${({ $which }) =>
    $which === 1 &&
    `
    width: 700px;
    height: 700px;
    top: -220px;
    right: -180px;
    background: radial-gradient(circle, rgba(232,93,38,0.55) 0%, transparent 65%);
    animation-delay: 0s;
  `}

  ${({ $which }) =>
    $which === 2 &&
    `
    width: 500px;
    height: 500px;
    bottom: -180px;
    left: -80px;
    background: radial-gradient(circle, rgba(45,106,79,0.45) 0%, transparent 65%);
    animation-delay: -4s;
  `}

  ${({ $which }) =>
    $which === 3 &&
    `
    width: 320px;
    height: 320px;
    top: 35%;
    left: 42%;
    background: radial-gradient(circle, rgba(255,140,90,0.28) 0%, transparent 65%);
    animation-delay: -8s;
    animation-duration: 16s;
  `}
`;

/* Subtle noise texture overlay */
export const HeroNoise = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  pointer-events: none;
`;

export const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 60px;
  /* Top padding so content sits below the floating header */
  padding-top: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  @media (max-width: 600px) {
    padding: 100px 20px 40px;
  }
`;

export const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 14px 6px 8px;
  background: rgba(232, 93, 38, 0.12);
  border: 1px solid rgba(232, 93, 38, 0.28);
  border-radius: 999px;
  color: #ff9d6e;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  margin-bottom: 28px;
  animation: ${fadeUp} 0.6s ease both;

  span.dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #e85d26;
    animation: ${pulse} 2s ease-in-out infinite;
    display: inline-block;
    flex-shrink: 0;
  }
`;

export const HeroHeading = styled.h1`
  font-family: "Playfair Display", "Georgia", serif;
  font-size: clamp(3rem, 7.5vw, 5.5rem);
  font-weight: 900;
  line-height: 1.04;
  letter-spacing: -2px;
  color: #ffffff;
  margin: 0 0 24px;
  max-width: 840px;
  animation: ${fadeUp} 0.65s ease 0.08s both;

  @media (max-width: 600px) {
    font-size: clamp(2.4rem, 10vw, 3.2rem);
    letter-spacing: -1px;
  }
`;

export const HeadingAccent = styled.span`
  background: linear-gradient(
    135deg,
    #e85d26 0%,
    #ff8c5a 40%,
    #ffb574 70%,
    #e85d26 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 4s linear infinite;
`;

export const HeroSubheading = styled.p`
  font-size: clamp(1.05rem, 2.2vw, 1.25rem);
  color: rgba(255, 255, 255, 0.5);
  max-width: 540px;
  line-height: 1.65;
  margin: 0 0 44px;
  animation: ${fadeUp} 0.65s ease 0.18s both;
`;

export const HeroSearchWrapper = styled.div`
  width: 100%;
  max-width: 680px;
  animation: ${fadeUp} 0.65s ease 0.28s both;
`;

export const HeroTagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  animation: ${fadeUp} 0.65s ease 0.36s both;
`;

export const HeroTag = styled.button`
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.62);
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;

  &:hover {
    background: rgba(255, 255, 255, 0.13);
    border-color: rgba(255, 255, 255, 0.22);
    color: rgba(255, 255, 255, 0.9);
  }

  &:focus-visible {
    outline: 2px solid #e85d26;
    outline-offset: 2px;
  }
`;

export const HeroStats = styled.div`
  display: flex;
  gap: 0;
  margin-top: 52px;
  animation: ${fadeUp} 0.65s ease 0.44s both;
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 0 28px;
  position: relative;

  &:not(:last-child)::after {
    content: "";
    position: absolute;
    right: 0;
    top: 20%;
    height: 60%;
    width: 1px;
    background: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 480px) {
    padding: 0 16px;
  }
`;

export const StatNumber = styled.span`
  font-size: 1.9rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1;
  letter-spacing: -0.5px;
`;

export const StatLabel = styled.span`
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.38);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-weight: 500;
`;

/* ─── Scroll indicator ─── */
export const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 36px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.28);
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  animation: ${fadeUp} 1s ease 0.8s both;

  svg {
    animation: ${slowFloat} 2s ease-in-out infinite;
    width: 20px;
    height: 20px;
  }

  @media (max-width: 600px) {
    display: none;
  }
`;

/* ─── Social proof strip (logos) ─── */
export const SocialProofStrip = styled.div`
  background: #ffffff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const SocialProofText = styled.span`
  font-size: 0.8125rem;
  color: #9e9e9e;
  font-weight: 500;
  white-space: nowrap;
`;

/* ─── Feature cards strip ─── */
export const FeaturesSection = styled.section`
  background: #ffffff;
  padding: 80px 24px;

  @media (max-width: 768px) {
    padding: 56px 20px;
  }
`;

export const FeaturesInner = styled.div`
  max-width: 1160px;
  margin: 0 auto;
`;

export const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 48px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-top: 36px;
  }
`;

export const FeatureCard = styled.div`
  padding: 32px 28px;
  border-radius: 20px;
  background: #fafaf8;
  border: 1px solid rgba(0, 0, 0, 0.07);
  transition:
    box-shadow 0.25s ease,
    transform 0.25s ease;

  &:hover {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    transform: translateY(-4px);
  }
`;

export const FeatureIcon = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: linear-gradient(
    135deg,
    rgba(232, 93, 38, 0.12) 0%,
    rgba(255, 140, 90, 0.08) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 20px;
`;

export const FeatureTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  color: #111;
  margin: 0 0 10px;
  letter-spacing: -0.2px;
`;

export const FeatureDesc = styled.p`
  font-size: 0.9rem;
  color: #777;
  line-height: 1.6;
  margin: 0;
`;

/* ─── Section wrapper ─── */
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

export const SectionEyebrow = styled.span`
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  color: #e85d26;
  margin-bottom: 8px;
`;

export const SectionTitle = styled(Typography)`
  font-size: clamp(1.5rem, 3vw, 2rem) !important;
  font-weight: 800 !important;
  letter-spacing: -0.5px !important;
  color: #0f0f0f !important;
  line-height: 1.2 !important;
`;

export const ViewAllButton = styled(Button)`
  color: #e85d26 !important;
  font-weight: 600 !important;
  text-transform: none !important;
  white-space: nowrap;
  flex-shrink: 0;
  font-size: 0.875rem !important;
  border: 1px solid rgba(232, 93, 38, 0.25) !important;
  border-radius: 10px !important;
  padding: 7px 16px !important;

  &:hover {
    background: rgba(232, 93, 38, 0.06) !important;
    border-color: rgba(232, 93, 38, 0.45) !important;
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
  transition: all 0.18s ease !important;
  flex-shrink: 0;
  border-radius: 999px !important;

  ${({ $active }) =>
    $active
      ? `
    background: #0f0f0f !important;
    color: #ffffff !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
  `
      : `
    background: rgba(0,0,0,0.05) !important;
    color: #444 !important;
    &:hover { background: rgba(0,0,0,0.1) !important; }
  `}
`;

/* ─── CTA Banner ─── */
export const CtaBanner = styled.div`
  margin: 0 24px 80px;
  max-width: 1152px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 28px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  padding: 60px 56px;
  background: linear-gradient(135deg, #0f0f0f 0%, #1c1c1c 60%, #0d1f17 100%);
  border: 1px solid rgba(255, 255, 255, 0.07);

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 44px 28px;
    margin: 0 16px 60px;
  }

  /* Decorative glow */
  &::before {
    content: "";
    position: absolute;
    top: -60px;
    right: -60px;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(232, 93, 38, 0.35) 0%,
      transparent 70%
    );
    pointer-events: none;
  }
`;

export const CtaContent = styled.div`
  position: relative;
  z-index: 1;
`;

export const CtaHeading = styled.h2`
  font-family: "Playfair Display", "Georgia", serif;
  font-size: clamp(1.6rem, 3.5vw, 2.2rem);
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 10px;
  letter-spacing: -0.5px;
  line-height: 1.2;
`;

export const CtaSubheading = styled.p`
  color: rgba(255, 255, 255, 0.55);
  font-size: 1rem;
  line-height: 1.55;
  margin: 0;
  max-width: 460px;
`;

export const CtaActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  position: relative;
  z-index: 1;
  flex-shrink: 0;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

export const CtaPrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #e85d26 0%, #ff8c5a 100%) !important;
  color: #ffffff !important;
  font-weight: 700 !important;
  text-transform: none !important;
  border-radius: 14px !important;
  padding: 14px 32px !important;
  font-size: 1rem !important;
  white-space: nowrap;
  box-shadow: 0 4px 20px rgba(232, 93, 38, 0.45) !important;

  &:hover {
    box-shadow: 0 6px 28px rgba(232, 93, 38, 0.65) !important;
    transform: translateY(-1px) !important;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const CtaSecondaryButton = styled(Button)`
  background: rgba(255, 255, 255, 0.08) !important;
  border: 1px solid rgba(255, 255, 255, 0.16) !important;
  color: rgba(255, 255, 255, 0.82) !important;
  font-weight: 600 !important;
  text-transform: none !important;
  border-radius: 14px !important;
  padding: 14px 28px !important;
  font-size: 1rem !important;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.13) !important;
    color: #ffffff !important;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

/* ─── Legacy ─── */
export const CtaBanner_deprecated = Box;
export const CtaText = Box;
export const CtaButton = Button;
export const CtaDecoration = Box;
