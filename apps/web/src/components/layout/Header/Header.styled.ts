import styled from "styled-components";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";

/* ─── Outer wrapper — fixed, centered, full-width pill container ─── */
export const HeaderWrapper = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: min(calc(100vw - 40px), 1200px);
  z-index: 1100;
  pointer-events: none;
`;

/* ─── The visible floating bar ─── */
export const FloatingBar = styled.div<{ $scrolled?: boolean }>`
  pointer-events: all;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: ${({ $scrolled }) => ($scrolled ? "10px 16px" : "12px 20px")};
  background: ${({ $scrolled }) =>
    $scrolled ? "rgba(9, 7, 5, 0.97)" : "rgba(9, 7, 5, 0.82)"};
  backdrop-filter: blur(28px) saturate(200%);
  -webkit-backdrop-filter: blur(28px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 22px;
  box-shadow: ${({ $scrolled }) =>
    $scrolled
      ? "0 12px 48px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.07)"
      : "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.07)"};
  transition:
    background 0.3s ease,
    box-shadow 0.3s ease,
    padding 0.3s ease;
`;

/* ─── Logo ─── */
export const LogoLink = styled.a`
  display: flex;
  align-items: center;
  gap: 9px;
  text-decoration: none;
  flex-shrink: 0;
  margin-right: 4px;

  &:focus-visible {
    outline: 2px solid #e85d26;
    outline-offset: 3px;
    border-radius: 8px;
  }
`;

export const LogoIcon = styled.div`
  width: 34px;
  height: 34px;
  background: linear-gradient(135deg, #e85d26 0%, #ff8c5a 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  flex-shrink: 0;
  box-shadow: 0 2px 10px rgba(232, 93, 38, 0.45);
`;

export const LogoText = styled.span`
  font-weight: 800;
  font-size: 1.05rem;
  letter-spacing: -0.3px;
  color: #ffffff;
  user-select: none;
  white-space: nowrap;

  @media (max-width: 480px) {
    display: none;
  }
`;

/* ─── Desktop navigation ─── */
export const NavGroup = styled.nav`
  display: flex;
  align-items: center;
  gap: 2px;
  flex-grow: 1;
  margin-left: 16px;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const NavLink = styled.a<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 7px 13px;
  border-radius: 11px;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ $active }) => ($active ? "#ffffff" : "rgba(255,255,255,0.58)")};
  text-decoration: none;
  transition:
    color 0.15s ease,
    background 0.15s ease;
  background: ${({ $active }) =>
    $active ? "rgba(255,255,255,0.10)" : "transparent"};
  white-space: nowrap;

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.08);
  }

  &:focus-visible {
    outline: 2px solid #e85d26;
    outline-offset: 2px;
    border-radius: 9px;
  }
`;

/* ─── Action buttons ─── */
export const ActionGroup = styled(Box)`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
`;

export const AddRecipeButton = styled(Button)`
  background: linear-gradient(135deg, #e85d26 0%, #ff8c5a 100%) !important;
  color: #ffffff !important;
  font-weight: 600 !important;
  font-size: 0.8125rem !important;
  padding: 7px 16px !important;
  border-radius: 11px !important;
  text-transform: none !important;
  white-space: nowrap;
  min-height: 36px !important;
  box-shadow: 0 2px 10px rgba(232, 93, 38, 0.45) !important;
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease !important;

  &:hover {
    box-shadow: 0 4px 20px rgba(232, 93, 38, 0.65) !important;
    transform: translateY(-1px) !important;
  }

  @media (max-width: 768px) {
    display: none !important;
  }
`;

export const LoginButton = styled(Button)`
  color: rgba(255, 255, 255, 0.68) !important;
  font-weight: 500 !important;
  font-size: 0.875rem !important;
  padding: 7px 13px !important;
  border-radius: 11px !important;
  text-transform: none !important;
  min-height: 36px !important;

  &:hover {
    color: #ffffff !important;
    background: rgba(255, 255, 255, 0.07) !important;
  }

  @media (max-width: 768px) {
    display: none !important;
  }
`;

export const SignUpButton = styled(Button)`
  background: rgba(255, 255, 255, 0.11) !important;
  border: 1px solid rgba(255, 255, 255, 0.18) !important;
  color: #ffffff !important;
  font-weight: 600 !important;
  font-size: 0.875rem !important;
  padding: 7px 16px !important;
  border-radius: 11px !important;
  text-transform: none !important;
  min-height: 36px !important;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease !important;

  &:hover {
    background: rgba(255, 255, 255, 0.18) !important;
    border-color: rgba(255, 255, 255, 0.32) !important;
    transform: translateY(-1px) !important;
  }

  @media (max-width: 768px) {
    display: none !important;
  }
`;

export const UserMenuButton = styled(Button)`
  color: rgba(255, 255, 255, 0.82) !important;
  font-weight: 500 !important;
  font-size: 0.875rem !important;
  padding: 6px 12px !important;
  border-radius: 11px !important;
  text-transform: none !important;
  border: 1px solid rgba(255, 255, 255, 0.14) !important;
  gap: 6px !important;

  &:hover {
    color: #ffffff !important;
    background: rgba(255, 255, 255, 0.07) !important;
    border-color: rgba(255, 255, 255, 0.25) !important;
  }

  @media (max-width: 768px) {
    display: none !important;
  }
`;

export const LogoutButton = styled(Button)`
  color: rgba(255, 255, 255, 0.48) !important;
  font-weight: 500 !important;
  font-size: 0.8125rem !important;
  padding: 7px 12px !important;
  border-radius: 11px !important;
  text-transform: none !important;

  &:hover {
    color: rgba(255, 255, 255, 0.78) !important;
    background: rgba(255, 255, 255, 0.06) !important;
  }

  @media (max-width: 768px) {
    display: none !important;
  }
`;

/* ─── Mobile menu toggle ─── */
export const MobileMenuButton = styled(IconButton)`
  display: none !important;
  color: rgba(255, 255, 255, 0.85) !important;
  width: 40px !important;
  height: 40px !important;
  border-radius: 11px !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  margin-left: auto !important;

  &:hover {
    background: rgba(255, 255, 255, 0.08) !important;
  }

  @media (max-width: 768px) {
    display: inline-flex !important;
  }
`;

/* ─── Full-screen mobile menu overlay ─── */
export const MobileMenuOverlay = styled.div<{ $open: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: ${({ $open }) => ($open ? "flex" : "none")};
    position: fixed;
    inset: 0;
    background: rgba(9, 7, 5, 0.98);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    z-index: 1090;
    flex-direction: column;
    padding: 96px 28px 48px;
    overflow-y: auto;
  }
`;

export const MobileCloseButton = styled(IconButton)`
  position: fixed !important;
  top: 22px;
  right: 20px;
  color: rgba(255, 255, 255, 0.7) !important;
  width: 44px !important;
  height: 44px !important;
  border: 1px solid rgba(255, 255, 255, 0.13) !important;
  border-radius: 13px !important;
  z-index: 1091;

  &:hover {
    color: #ffffff !important;
    border-color: rgba(255, 255, 255, 0.28) !important;
    background: rgba(255, 255, 255, 0.07) !important;
  }
`;

export const MobileNavItem = styled.a`
  display: block;
  padding: 16px 20px;
  border-radius: 16px;
  font-size: 1.2rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition:
    color 0.15s ease,
    background 0.15s ease;
  border: 1px solid transparent;

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.08);
  }

  &:focus-visible {
    outline: 2px solid #e85d26;
    outline-offset: 2px;
  }
`;

export const MobileDivider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 12px 0;
`;

export const MobileSignUpItem = styled(MobileNavItem)`
  color: #ff8c5a;
  margin-top: 8px;
`;

/* ─── Legacy exports kept so nothing else breaks ─── */
export const LogoAccent = styled.span`
  display: none;
`;
