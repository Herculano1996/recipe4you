import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { StyledPasswordField } from "./AppPasswordField.styled.js";
import type { AppPasswordFieldProps } from "./AppPasswordField.types.js";

export function AppPasswordField({
  slotProps,
  fullWidth = true,
  ...props
}: AppPasswordFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <StyledPasswordField
      type={show ? "text" : "password"}
      fullWidth={fullWidth}
      slotProps={{
        ...slotProps,
        input: {
          ...(slotProps?.input as object),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={show ? "Hide password" : "Show password"}
                onClick={() => setShow((v) => !v)}
                edge="end"
              >
                {show ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      {...props}
    />
  );
}
