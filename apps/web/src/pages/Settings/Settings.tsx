import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import {
  PageContainer,
  AppButton,
  AppTextField,
  AppAlert,
  UserAvatar,
} from "../../components/ui/index.js";
import { useOwnProfile, useUpdateProfile } from "../../hooks/useProfile.js";
import { useUploadAvatar } from "../../hooks/useUpload.js";
import { settingsSchema } from "./Settings.types.js";
import type { SettingsForm } from "./Settings.types.js";
import {
  PageWrapper,
  SectionTitle,
  FormCard,
  AvatarEditWrapper,
  AvatarEditOverlay,
  EditIcon,
  FormStack,
  SaveRow,
} from "./Settings.styled.js";

export default function SettingsPage() {
  const { data: profile } = useOwnProfile();
  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [success, setSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      username: "",
      displayName: "",
      bio: "",
      avatarUrl: "",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const avatarUrl = watch("avatarUrl");

  useEffect(() => {
    if (profile) {
      reset({
        username: profile.username ?? "",
        displayName: profile.displayName ?? "",
        bio: profile.bio ?? "",
        avatarUrl: profile.avatarUrl ?? "",
      });
    }
  }, [profile, reset]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadAvatarMutation.mutate(file, {
      onSuccess: (result) => {
        setValue("avatarUrl", result.url);
      },
    });
  };

  const onSubmit = (data: SettingsForm) => {
    setSuccess(false);
    updateProfileMutation.mutate(data, {
      onSuccess: () => {
        setSuccess(true);
      },
    });
  };

  return (
    <PageContainer>
      <PageWrapper>
        <SectionTitle>Profile Settings</SectionTitle>
        <FormCard>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <AvatarEditWrapper onClick={handleAvatarClick}>
              <UserAvatar
                src={avatarUrl}
                displayName={profile?.displayName ?? profile?.username}
                size="lg"
              />
              <AvatarEditOverlay>
                <EditIcon>
                  {uploadAvatarMutation.isPending ? (
                    "..."
                  ) : (
                    <CameraAltIcon sx={{ color: "#fff", fontSize: "1.2rem" }} />
                  )}
                </EditIcon>
              </AvatarEditOverlay>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </AvatarEditWrapper>

            <FormStack>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <AppTextField
                    {...field}
                    label="Username"
                    error={Boolean(errors.username)}
                    helperText={errors.username?.message}
                  />
                )}
              />
              <Controller
                name="displayName"
                control={control}
                render={({ field }) => (
                  <AppTextField
                    {...field}
                    label="Display Name"
                    error={Boolean(errors.displayName)}
                    helperText={errors.displayName?.message}
                  />
                )}
              />
              <Controller
                name="bio"
                control={control}
                render={({ field }) => (
                  <AppTextField
                    {...field}
                    label="Bio"
                    multiline
                    rows={4}
                    error={Boolean(errors.bio)}
                    helperText={errors.bio?.message}
                  />
                )}
              />

              {success && (
                <AppAlert severity="success">
                  Profile updated successfully.
                </AppAlert>
              )}
              {updateProfileMutation.isError && (
                <AppAlert severity="error">
                  {(updateProfileMutation.error as Error)?.message ??
                    "Failed to update profile."}
                </AppAlert>
              )}

              <SaveRow>
                <AppButton
                  type="submit"
                  loading={updateProfileMutation.isPending}
                >
                  Save Changes
                </AppButton>
              </SaveRow>
            </FormStack>
          </form>
        </FormCard>
      </PageWrapper>
    </PageContainer>
  );
}
