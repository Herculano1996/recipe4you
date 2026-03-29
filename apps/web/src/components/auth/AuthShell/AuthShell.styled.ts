import styled from "styled-components";
import Paper from "@mui/material/Paper";

export const AuthCard = styled(Paper)`
  width: 100%;
  max-width: 420px;
  border-radius: 20px !important;
  padding: 40px 36px 36px;
  border: 1px solid rgba(0, 0, 0, 0.07) !important;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.09) !important;
`;

export const LogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 32px;
`;

export const LogoIcon = styled.div`
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #e85d26 0%, #ff8c5a 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  box-shadow: 0 2px 10px rgba(232, 93, 38, 0.38);
  flex-shrink: 0;
`;

export const LogoName = styled.span`
  font-weight: 800;
  font-size: 1.1rem;
  letter-spacing: -0.3px;
  color: #0f0f0f;
`;

export const FormStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
`;

export const FooterRow = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: #6e6e6e;
  margin-top: 20px;
`;

export const FooterLink = styled.a`
  color: #e85d26;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const TermsNote = styled.p`
  font-size: 0.75rem;
  color: #9e9e9e;
  text-align: center;
  margin-top: 12px;
  line-height: 1.5;
`;
