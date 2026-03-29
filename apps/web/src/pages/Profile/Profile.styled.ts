import styled from "styled-components";

export const PageWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding-top: 40px;
  padding-bottom: 48px;
  padding-left: 16px;
  padding-right: 16px;
`;

export const ProfileCard = styled.div`
  background: #fff;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  padding: 32px;
  display: flex;
  gap: 32px;
  align-items: flex-start;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 24px 16px;
    gap: 20px;
  }
`;

export const AvatarWrapper = styled.div`
  flex-shrink: 0;
`;

export const ProfileInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ProfileName = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`;

export const ProfileUsername = styled.p`
  color: #6e6e6e;
  font-size: 0.95rem;
  margin-top: 2px;
  margin-bottom: 0;
`;

export const ProfileBio = styled.p`
  margin-top: 16px;
  color: #333;
  line-height: 1.6;
  margin-bottom: 0;
`;

export const StatsRow = styled.div`
  display: flex;
  gap: 32px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);

  @media (max-width: 600px) {
    justify-content: center;
  }
`;

export const StatItem = styled.div`
  text-align: center;
`;

export const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #e85d26;
`;

export const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #6e6e6e;
  margin-top: 2px;
`;

export const ActionsRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    justify-content: center;
  }
`;
