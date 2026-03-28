import { RouterProvider } from "react-router";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClientProvider } from "@tanstack/react-query";
import { theme } from "./styles/theme.js";
import { GlobalStyles } from "./styles/GlobalStyles.js";
import { queryClient } from "./lib/queryClient.js";
import { router } from "./router/index.js";

// Development-only accessibility checker
if (import.meta.env.DEV) {
  import("@axe-core/react").then(({ default: axe }) => {
    import("react").then((React) => {
      import("react-dom").then((ReactDOM) => {
        axe(React.default, ReactDOM.default, 1000);
      });
    });
  });
}

export default function App() {
  return (
    // StyledEngineProvider with injectFirst ensures styled-components styles
    // can override MUI styles (required for @mui/styled-engine-sc)
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
