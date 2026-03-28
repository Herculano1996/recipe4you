import styled from "styled-components";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export const StyledAppBar = styled(AppBar)`
  background: rgba(255, 255, 255, 0.88) !important;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06) !important;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06) !important;
  color: #1a1a1a !important;
`;

export const StyledToolbar = styled(Toolbar)`
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 0 24px !important;
  min-height: 64px !important;
  gap: 8px;
`;

export const LogoText = styled(Typography)`
  font-weight: 800 !important;
  font-size: 1.35rem !important;
  letter-spacing: -0.5px !important;
  background: linear-gradient(135deg, #e85d26 0%, #ff8c5a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  line-height: 1 !important;
  user-select: none;
`;

export const LogoAccent = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #e85d26;
  border-radius: 50%;
  margin-left: 2px;
  vertical-align: super;
  font-size: 0;
`;

export const NavGroup = styled(Box)`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-grow: 1;
  margin-left: 32px;

  @media (max-width: 900px) {
    display: none;
  }
`;

export const NavButton = styled(Button)`
  color: #4a4a4a !important;
  font-weight: 500 !important;
  font-size: 0.9rem !important;
  padding: 6px 14px !important;
  border-radius: 8px !important;
  text-transform: none !important;
  min-height: 36px !important;
  transition: all 0.15s ease !important;

  &:hover {
    background: rgba(232, 93, 38, 0.08) !important;
    color: #e85d26 !important;
  }
`;

export const ActionGroup = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
`;

export const AddRecipeButton = styled(Button)`
  background: linear-gradient(135deg, #e85d26 0%, #ff8c5a 100%) !important;
  color: #ffffff !important;
  font-weight: 600 !important;
  font-size: 0.875rem !important;
  padding: 8px 18px !important;
  border-radius: 10px !important;
  text-transform: none !important;
  box-shadow: 0 2px 8px rgba(232, 93, 38, 0.35) !important;
  transition: all 0.2s ease !important;

  &:hover {
    box-shadow: 0 4px 16px rgba(232, 93, 38, 0.5) !important;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const LoginButton = styled(Button)`
  color: #4a4a4a !important;
  font-weight: 500 !important;
  font-size: 0.875rem !important;
  padding: 8px 16px !important;
  border-radius: 10px !important;
  text-transform: none !important;
  min-height: 38px !important;

  &:hover {
    background: rgba(0, 0, 0, 0.05) !important;
    color: #1a1a1a !important;
  }
`;

export const SignUpButton = styled(Button)`
  background: #1a1a1a !important;
  color: #ffffff !important;
  font-weight: 600 !important;
  font-size: 0.875rem !important;
  padding: 8px 18px !important;
  border-radius: 10px !important;
  text-transform: none !important;
  transition: all 0.2s ease !important;

  &:hover {
    background: #333333 !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
  }

  &:active {
    transform: translateY(0);
  }
`;

export const UserMenuButton = styled(Button)`
  color: #4a4a4a !important;
  font-weight: 500 !important;
  font-size: 0.875rem !important;
  padding: 6px 12px !important;
  border-radius: 10px !important;
  text-transform: none !important;
  border: 1.5px solid rgba(0, 0, 0, 0.1) !important;
  gap: 8px !important;

  &:hover {
    border-color: rgba(232, 93, 38, 0.4) !important;
    color: #e85d26 !important;
    background: rgba(232, 93, 38, 0.04) !important;
  }
`;

export const MobileMenuButton = styled(IconButton)`
  display: none !important;
  color: #1a1a1a !important;

  @media (max-width: 900px) {
    display: inline-flex !important;
  }
`;

export const LogoLink = styled.a`
  display: flex;
  align-items: center;
  gap: 2px;
  text-decoration: none;
  flex-shrink: 0;
`;
