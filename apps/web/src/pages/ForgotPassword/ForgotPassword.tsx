import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { supabase } from "../../lib/supabase.js";
import { AuthShell } from "../../components/auth/AuthShell/index.js";
import {
  AppButton,
  AppTextField,
  AppAlert,
} from "../../components/ui/index.js";
import { BackLink, SuccessBox, SuccessText } from "./ForgotPassword.styled.js";
import { forgotPasswordSchema } from "./ForgotPassword.types.js";
import type { ForgotPasswordForm } from "./ForgotPassword.types.js";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setServerError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${globalThis.location.origin}/auth/callback`,
    });
    if (error) {
      setServerError(error.message);
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <AuthShell title="Check your inbox">
        <SuccessBox>
          <CheckCircleOutlineIcon
            sx={{ fontSize: 48, color: "#2d6a4f", mt: 1 }}
          />
          <SuccessText>
            We sent a password reset link to{" "}
            <strong>{getValues("email")}</strong>. It may take a few minutes.
          </SuccessText>
          <BackLink onClick={() => navigate("/auth/login")}>
            <ArrowBackIcon sx={{ fontSize: 16 }} />
            Back to sign in
          </BackLink>
        </SuccessBox>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link"
    >
      {serverError && <AppAlert severity="error">{serverError}</AppAlert>}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <AppTextField
          {...register("email")}
          label="Email address"
          type="email"
          autoComplete="email"
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <AppButton
          type="submit"
          appVariant="primary"
          fullWidth
          loading={isSubmitting}
        >
          {isSubmitting ? "Sending…" : "Send reset link"}
        </AppButton>
      </form>

      <BackLink onClick={() => navigate("/auth/login")}>
        <ArrowBackIcon sx={{ fontSize: 16 }} />
        Back to sign in
      </BackLink>
    </AuthShell>
  );
}
