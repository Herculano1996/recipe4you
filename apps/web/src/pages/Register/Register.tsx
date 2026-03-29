import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { api } from "../../lib/api.js";
import { useAuthStore } from "../../store/authStore.js";
import {
  AuthShell,
  FooterRow,
  FooterLink,
  TermsNote,
} from "../../components/auth/AuthShell/index.js";
import {
  AppButton,
  AppTextField,
  AppPasswordField,
  AppAlert,
} from "../../components/ui/index.js";
import { FieldRow } from "./Register.styled.js";
import { registerSchema } from "./Register.types.js";
import type { RegisterForm } from "./Register.types.js";
import type { User } from "@recipe4you/types";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterForm) => {
    setServerError(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword: _confirmPassword, ...payload } = data;
      const result = await api.post<
        { user: User; token: string },
        Omit<RegisterForm, "confirmPassword">
      >("/auth/register", payload);
      setAuth(result.user, result.token);
      navigate("/");
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.",
      );
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join thousands of home cooks — it's free"
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

        <FieldRow style={{ marginTop: 16 }}>
          <AppTextField
            {...register("username")}
            label="Username"
            autoComplete="username"
            error={!!errors.username}
            helperText={errors.username?.message}
          />
          <AppTextField
            {...register("displayName")}
            label="Display name"
            autoComplete="name"
            error={!!errors.displayName}
            helperText={errors.displayName?.message ?? "Optional"}
          />
        </FieldRow>

        <AppPasswordField
          {...register("password")}
          label="Password"
          autoComplete="new-password"
          error={!!errors.password}
          helperText={errors.password?.message}
          sx={{ mt: 2 }}
        />

        <AppPasswordField
          {...register("confirmPassword")}
          label="Confirm password"
          autoComplete="new-password"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          sx={{ mt: 2 }}
        />

        <AppButton
          type="submit"
          appVariant="primary"
          fullWidth
          loading={isSubmitting}
        >
          {isSubmitting ? "Creating account…" : "Create account"}
        </AppButton>
      </form>

      <TermsNote>
        By creating an account you agree to our Terms of Service and Privacy
        Policy.
      </TermsNote>

      <FooterRow>
        Already have an account?{" "}
        <FooterLink onClick={() => navigate("/auth/login")}>Sign in</FooterLink>
      </FooterRow>
    </AuthShell>
  );
}
