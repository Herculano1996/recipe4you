import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    neutral: Palette["primary"];
  }
  interface PaletteOptions {
    neutral?: PaletteOptions["primary"];
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: "#E85D26", // warm orange — food-forward
      light: "#FF8C5A",
      dark: "#B84210",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#2D6A4F", // deep green — fresh, natural
      light: "#52B788",
      dark: "#1B4332",
      contrastText: "#ffffff",
    },
    error: { main: "#D32F2F" },
    warning: { main: "#F9A825" },
    success: { main: "#388E3C" },
    background: {
      default: "#FAFAF8",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A1A1A",
      secondary: "#5C5C5C",
    },
    neutral: {
      main: "#6E6E6E",
      light: "#ADADAD",
      dark: "#333333",
      contrastText: "#ffffff",
    },
  },
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      "sans-serif",
    ].join(","),
    h1: { fontSize: "2.25rem", fontWeight: 700, lineHeight: 1.2 },
    h2: { fontSize: "1.75rem", fontWeight: 700, lineHeight: 1.3 },
    h3: { fontSize: "1.375rem", fontWeight: 600, lineHeight: 1.4 },
    h4: { fontSize: "1.125rem", fontWeight: 600, lineHeight: 1.4 },
    h5: { fontSize: "1rem", fontWeight: 600, lineHeight: 1.5 },
    h6: { fontSize: "0.875rem", fontWeight: 600, lineHeight: 1.5 },
    body1: { fontSize: "1rem", lineHeight: 1.6 },
    body2: { fontSize: "0.875rem", lineHeight: 1.6 },
  },
  shape: {
    borderRadius: 10,
  },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
          // WCAG 2.1: minimum 44px touch target
          minHeight: 44,
          paddingLeft: 20,
          paddingRight: 20,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          // WCAG 2.1: minimum 44x44px touch target
          minWidth: 44,
          minHeight: 44,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        size: "medium",
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
          },
          transition: "box-shadow 0.2s ease",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: "hover",
      },
    },
    // Ensure focus rings are always visible (WCAG 2.4.7)
    MuiButtonBase: {
      defaultProps: {
        disableRipple: false,
      },
      styleOverrides: {
        root: {
          "&:focus-visible": {
            outline: "3px solid #E85D26",
            outlineOffset: 2,
          },
        },
      },
    },
  },
});
