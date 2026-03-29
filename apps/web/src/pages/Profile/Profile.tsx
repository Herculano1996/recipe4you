import Skeleton from "@mui/material/Skeleton";
import { useNavigate } from "react-router";
import { useOwnProfile } from "../../hooks/useProfile.js";
import { AppButton, AppAlert, UserAvatar } from "../../components/ui/index.js";
import {
  PageWrapper,
  ProfileCard,
  AvatarWrapper,
  ProfileInfo,
  ProfileName,
  ProfileUsername,
  ProfileBio,
  StatsRow,
  StatItem,
  StatValue,
  StatLabel,
  ActionsRow,
} from "./Profile.styled.js";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { data: profile, isLoading, isError } = useOwnProfile();

  if (isLoading) {
    return (
      <PageWrapper>
        <ProfileCard>
          <AvatarWrapper>
            <Skeleton variant="circular" width={80} height={80} />
          </AvatarWrapper>
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

  if (isError || !profile) {
    return (
      <PageWrapper>
        <AppAlert severity="error">
          Failed to load your profile. Please try again later.
        </AppAlert>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <ProfileCard>
        <AvatarWrapper>
          <UserAvatar
            src={profile.avatarUrl}
            displayName={profile.displayName ?? profile.username}
            size="lg"
          />
        </AvatarWrapper>

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

          <ActionsRow>
            <AppButton
              appVariant="primary"
              onClick={() => navigate("/profile/settings")}
            >
              Edit Profile
            </AppButton>
            <AppButton
              appVariant="secondary"
              onClick={() => navigate("/profile/favorites")}
            >
              My Favorites
            </AppButton>
          </ActionsRow>
        </ProfileInfo>
      </ProfileCard>
    </PageWrapper>
  );
}
