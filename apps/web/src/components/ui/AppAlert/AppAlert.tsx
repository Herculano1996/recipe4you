import { StyledAlert } from "./AppAlert.styled.js";
import type { AppAlertProps } from "./AppAlert.types.js";

export function AppAlert(props: AppAlertProps) {
  return <StyledAlert {...props} />;
}
