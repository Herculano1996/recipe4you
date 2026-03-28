import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router";
import Box from "@mui/material/Box";
import { SkipLink } from "../components/layout/SkipLink/SkipLink.js";
import { Header } from "../components/layout/Header/Header.js";
import { Footer } from "../components/layout/Footer/Footer.js";
import { useUIStore } from "../store/uiStore.js";

export function RootLayout() {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  // WCAG 2.4.3 — move focus to main content on route change
  useEffect(() => {
    mainRef.current?.focus();
  }, [location.pathname]);

  return (
    <>
      <SkipLink />
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <Box
          component="main"
          id="main-content"
          ref={mainRef}
          tabIndex={-1}
          sx={{
            flexGrow: 1,
            outline: "none", // focus is managed programmatically
          }}
        >
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </>
  );
}
