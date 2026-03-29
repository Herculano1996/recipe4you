import { StyledTextField } from "./AppTextField.styled.js";
import type { AppTextFieldProps } from "./AppTextField.types.js";

export function AppTextField({
  fullWidth = true,
  ...props
}: AppTextFieldProps) {
  return <StyledTextField fullWidth={fullWidth} {...props} />;
}
