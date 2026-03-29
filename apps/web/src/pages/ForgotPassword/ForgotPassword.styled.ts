import styled from "styled-components";

export const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: #6e6e6e;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  margin-top: 20px;
  font-family: inherit;

  &:hover {
    color: #e85d26;
  }
`;

export const SuccessBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  padding: 8px 0;
`;

export const SuccessText = styled.p`
  font-size: 0.875rem;
  color: #6e6e6e;
  line-height: 1.6;
  margin: 0;
`;
