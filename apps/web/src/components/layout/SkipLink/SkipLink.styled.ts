import styled from "styled-components";

export const StyledSkipLink = styled.a`
  position: absolute;
  top: -100%;
  left: 0;
  padding: 12px 20px;
  background: #e85d26;
  color: #ffffff;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  z-index: 9999;
  border-radius: 0 0 10px 0;
  box-shadow: 0 4px 12px rgba(232, 93, 38, 0.4);
  transition: top 0.15s ease;

  &:focus {
    top: 0;
    outline: 3px solid #ffffff;
    outline-offset: -4px;
  }
`;
