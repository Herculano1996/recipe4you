import styled from "styled-components";
import Button from "@mui/material/Button";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 40px 24px;
`;

export const Emoji = styled.div`
  font-size: 5rem;
  margin-bottom: 24px;
  line-height: 1;
`;

export const Code = styled.span`
  font-size: clamp(5rem, 15vw, 9rem);
  font-weight: 900;
  letter-spacing: -4px;
  background: linear-gradient(135deg, #e85d26 0%, #ff8c5a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  display: block;
  margin-bottom: 16px;
`;

export const NotFoundTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.3px;
  color: #0f0f0f;
  margin: 0 0 12px;
`;

export const NotFoundText = styled.p`
  font-size: 1rem;
  color: #6e6e6e;
  line-height: 1.6;
  max-width: 400px;
  margin: 0;
`;

export const HomeButton = styled(Button)`
  background: linear-gradient(135deg, #e85d26 0%, #ff8c5a 100%) !important;
  color: #ffffff !important;
  font-weight: 600 !important;
  text-transform: none !important;
  padding: 12px 32px !important;
  border-radius: 12px !important;
  font-size: 1rem !important;
  margin-top: 32px !important;
  box-shadow: 0 4px 16px rgba(232, 93, 38, 0.35) !important;

  &:hover {
    box-shadow: 0 6px 24px rgba(232, 93, 38, 0.52) !important;
    transform: translateY(-1px);
  }
`;
