import Typography from "@mui/material/Typography";
import {
  AuthCard,
  LogoRow,
  LogoIcon,
  LogoName,
  FormStack,
} from "./AuthShell.styled.js";
import type { AuthShellProps } from "./AuthShell.types.js";

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <AuthCard elevation={0}>
      <LogoRow>
        <LogoIcon aria-hidden>🍳</LogoIcon>
        <LogoName>recipe4you</LogoName>
      </LogoRow>

      <Typography variant="h5" fontWeight={800} letterSpacing="-0.4px">
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          {subtitle}
        </Typography>
      )}

      <FormStack>{children}</FormStack>
    </AuthCard>
  );
}
