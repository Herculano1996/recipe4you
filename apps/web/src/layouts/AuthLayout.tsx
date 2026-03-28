import { Navigate, Outlet } from "react-router";
import Box from "@mui/material/Box";
import { useAuthStore } from "../store/authStore.js";

export function AuthLayout() {
  const { isAuthenticated } = useAuthStore();

  // Already logged in — redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "60vh",
        pt: 6,
        px: 2,
      }}
    >
      <Outlet />
    </Box>
  );
}
