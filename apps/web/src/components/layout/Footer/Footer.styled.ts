import styled from "styled-components";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import Divider from "@mui/material/Divider";

export const FooterRoot = styled(Box)`
  background: #0f0f0f;
  color: rgba(255, 255, 255, 0.85);
  padding: 64px 0 32px;
  margin-top: auto;
`;

export const FooterInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;

  @media (max-width: 600px) {
    padding: 0 16px;
  }
`;

export const FooterTop = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

export const BrandColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const LogoMark = styled(Typography)`
  font-weight: 800 !important;
  font-size: 1.5rem !important;
  letter-spacing: -0.5px !important;
  background: linear-gradient(135deg, #e85d26 0%, #ff8c5a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1 !important;
`;

export const Tagline = styled(Typography)`
  color: rgba(255, 255, 255, 0.5) !important;
  font-size: 0.875rem !important;
  line-height: 1.6 !important;
  max-width: 260px;
`;

export const SocialRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 4px;
`;

export const SocialButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition:
    background 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: rgba(232, 93, 38, 0.2);
    color: #e85d26;
  }

  svg {
    font-size: 18px;
  }
`;

export const LinkSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SectionTitle = styled(Typography)`
  font-size: 0.75rem !important;
  font-weight: 700 !important;
  letter-spacing: 1.2px !important;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4) !important;
  margin-bottom: 4px !important;
`;

export const FooterLink = styled(MuiLink)`
  color: rgba(255, 255, 255, 0.65) !important;
  text-decoration: none !important;
  font-size: 0.875rem !important;
  line-height: 1.5 !important;
  transition: color 0.2s ease !important;
  display: inline-block;

  &:hover {
    color: #e85d26 !important;
  }

  &:focus-visible {
    outline: 2px solid #e85d26;
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

export const FooterDivider = styled(Divider)`
  border-color: rgba(255, 255, 255, 0.08) !important;
  margin: 48px 0 24px !important;
`;

export const FooterBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

export const Copyright = styled(Typography)`
  color: rgba(255, 255, 255, 0.35) !important;
  font-size: 0.8125rem !important;
`;

export const BottomLinks = styled.div`
  display: flex;
  gap: 20px;
`;

export const BottomLink = styled(MuiLink)`
  color: rgba(255, 255, 255, 0.35) !important;
  text-decoration: none !important;
  font-size: 0.8125rem !important;
  transition: color 0.2s ease !important;

  &:hover {
    color: rgba(255, 255, 255, 0.7) !important;
  }

  &:focus-visible {
    outline: 2px solid #e85d26;
    outline-offset: 2px;
    border-radius: 2px;
  }
`;
