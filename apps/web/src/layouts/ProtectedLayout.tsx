import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/authStore.js";

export function ProtectedLayout() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}
