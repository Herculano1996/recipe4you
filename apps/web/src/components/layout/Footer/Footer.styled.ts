import styled from "styled-components";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import Divider from "@mui/material/Divider";

export const FooterRoot = styled(Box)`
  background: #080808;
  color: rgba(255, 255, 255, 0.82);
  padding: 72px 0 36px;
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

export const FooterInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;

  @media (max-width: 600px) {
    padding: 0 20px;
  }
`;

export const FooterTop = styled.div`
  display: grid;
  grid-template-columns: 2.2fr 1fr 1fr 1fr;
  gap: 48px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 36px;
  }
`;

export const BrandColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const LogoMark = styled(Typography)`
  font-weight: 800 !important;
  font-size: 1.3rem !important;
  letter-spacing: -0.4px !important;
  background: linear-gradient(135deg, #e85d26 0%, #ff9d6e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1 !important;
`;

export const Tagline = styled(Typography)`
  color: rgba(255, 255, 255, 0.42) !important;
  font-size: 0.875rem !important;
  line-height: 1.65 !important;
  max-width: 270px;
`;

export const SocialRow = styled.div`
  display: flex;
  gap: 8px;
`;

export const SocialButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.52);
  text-decoration: none;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    background: rgba(232, 93, 38, 0.15);
    border-color: rgba(232, 93, 38, 0.28);
    color: #ff9d6e;
  }

  &:focus-visible {
    outline: 2px solid #e85d26;
    outline-offset: 2px;
  }

  svg {
    font-size: 17px;
  }
`;

export const LinkSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const SectionTitle = styled(Typography)`
  font-size: 0.72rem !important;
  font-weight: 700 !important;
  letter-spacing: 1.4px !important;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.3) !important;
  margin-bottom: 2px !important;
`;

export const FooterLink = styled(MuiLink)`
  color: rgba(255, 255, 255, 0.58) !important;
  text-decoration: none !important;
  font-size: 0.875rem !important;
  line-height: 1.5 !important;
  transition: color 0.18s ease !important;

  &:hover {
    color: rgba(255, 255, 255, 0.92) !important;
  }

  &:focus-visible {
    outline: 2px solid #e85d26;
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

export const FooterDivider = styled(Divider)`
  border-color: rgba(255, 255, 255, 0.07) !important;
  margin: 52px 0 28px !important;
`;

export const FooterBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

export const Copyright = styled(Typography)`
  color: rgba(255, 255, 255, 0.28) !important;
  font-size: 0.8rem !important;
`;

export const BottomLinks = styled.div`
  display: flex;
  gap: 24px;
`;

export const BottomLink = styled(MuiLink)`
  color: rgba(255, 255, 255, 0.28) !important;
  text-decoration: none !important;
  font-size: 0.8rem !important;
  transition: color 0.18s ease !important;

  &:hover {
    color: rgba(255, 255, 255, 0.65) !important;
  }

  &:focus-visible {
    outline: 2px solid #e85d26;
    outline-offset: 2px;
    border-radius: 2px;
  }
`;
