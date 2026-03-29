import Skeleton from "@mui/material/Skeleton";
import { useParams, useNavigate } from "react-router";
import { usePublicProfile } from "../../hooks/useProfile.js";
import { AppAlert, UserAvatar } from "../../components/ui/index.js";
import {
  PageWrapper,
  ProfileCard,
  AvatarSection,
  ProfileInfo,
  ProfileName,
  ProfileUsername,
  ProfileBio,
  StatsRow,
  StatItem,
  StatValue,
  StatLabel,
  BackButton,
} from "./PublicProfile.styled.js";

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = usePublicProfile(username ?? "");

  if (isLoading) {
    return (
      <PageWrapper>
        <ProfileCard>
          <AvatarSection>
            <Skeleton variant="circular" width={80} height={80} />
          </AvatarSection>
          <ProfileInfo>
            <Skeleton variant="text" width={200} height={32} />
            <Skeleton variant="text" width={140} height={20} sx={{ mt: 0.5 }} />
            <Skeleton variant="text" width="100%" height={20} sx={{ mt: 2 }} />
            <Skeleton variant="text" width="80%" height={20} />
          </ProfileInfo>
        </ProfileCard>
      </PageWrapper>
    );
  }

  const is404 =
    isError &&
    error instanceof Error &&
    (error.message.includes("404") || error.message.includes("not found"));

  if (is404 || (!isLoading && !profile)) {
    return (
      <PageWrapper>
        <BackButton onClick={() => navigate(-1)}>&#8592; Go back</BackButton>
        <AppAlert severity="error">
          User not found. The profile you are looking for does not exist.
        </AppAlert>
      </PageWrapper>
    );
  }

  if (isError || !profile) {
    return (
      <PageWrapper>
        <BackButton onClick={() => navigate(-1)}>&#8592; Go back</BackButton>
        <AppAlert severity="error">
          Failed to load this profile. Please try again later.
        </AppAlert>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <BackButton onClick={() => navigate(-1)}>&#8592; Go back</BackButton>

      <ProfileCard>
        <AvatarSection>
          <UserAvatar
            src={profile.avatarUrl}
            displayName={profile.displayName ?? profile.username}
            size="lg"
          />
        </AvatarSection>

        <ProfileInfo>
          <ProfileName>{profile.displayName ?? profile.username}</ProfileName>
          <ProfileUsername>@{profile.username}</ProfileUsername>

          {profile.bio && <ProfileBio>{profile.bio}</ProfileBio>}

          <StatsRow>
            <StatItem>
              <StatValue>{profile.recipeCount}</StatValue>
              <StatLabel>Recipes</StatLabel>
            </StatItem>
          </StatsRow>
        </ProfileInfo>
      </ProfileCard>
    </PageWrapper>
  );
}
