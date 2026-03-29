import CircularProgress from "@mui/material/CircularProgress";
import { StyledButton } from "./AppButton.styled.js";
import type { AppButtonProps } from "./AppButton.types.js";

export function AppButton({
  loading = false,
  appVariant = "primary",
  disabled,
  children,
  ...props
}: AppButtonProps) {
  return (
    <StyledButton
      $appVariant={appVariant}
      disabled={disabled ?? loading}
      startIcon={
        loading ? (
          <CircularProgress size={16} color="inherit" aria-label="Loading" />
        ) : (
          props.startIcon
        )
      }
      {...props}
    >
      {children}
    </StyledButton>
  );
}
