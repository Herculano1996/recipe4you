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
} from "../../components/auth/AuthShell/index.js";
import {
  AppButton,
  AppTextField,
  AppPasswordField,
  AppAlert,
} from "../../components/ui/index.js";
import { ForgotLink } from "./Login.styled.js";
import { loginSchema } from "./Login.types.js";
import type { LoginForm } from "./Login.types.js";
import type { User } from "@recipe4you/types";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    setServerError(null);
    try {
      const result = await api.post<{ user: User; token: string }, LoginForm>(
        "/auth/login",
        data,
      );
      setAuth(result.user, result.token);
      navigate("/");
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Login failed. Please try again.",
      );
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your account to continue"
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
          slotProps={{ htmlInput: { "aria-required": "true" } }}
        />

        <AppPasswordField
          {...register("password")}
          label="Password"
          autoComplete="current-password"
          error={!!errors.password}
          helperText={errors.password?.message}
          sx={{ mt: 2 }}
        />

        <ForgotLink onClick={() => navigate("/auth/forgot-password")}>
          Forgot password?
        </ForgotLink>

        <AppButton
          type="submit"
          appVariant="primary"
          fullWidth
          loading={isSubmitting}
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </AppButton>
      </form>

      <FooterRow>
        Don&apos;t have an account?{" "}
        <FooterLink onClick={() => navigate("/auth/register")}>
          Create one free
        </FooterLink>
      </FooterRow>
    </AuthShell>
  );
}
