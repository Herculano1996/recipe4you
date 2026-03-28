/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { RootLayout } from "../layouts/RootLayout.js";
import { AuthLayout } from "../layouts/AuthLayout.js";
import { ProtectedLayout } from "../layouts/ProtectedLayout.js";

// Lazy-loaded pages for code splitting
const HomePage = lazy(() => import("../pages/Home.js"));
const DiscoverPage = lazy(() => import("../pages/Discover.js"));
const SearchPage = lazy(() => import("../pages/Search.js"));
const RecipeDetailPage = lazy(() => import("../pages/RecipeDetail.js"));
const RecipeCreatePage = lazy(() => import("../pages/RecipeCreate.js"));
const RecipeEditPage = lazy(() => import("../pages/RecipeEdit.js"));
const TagPage = lazy(() => import("../pages/Tag.js"));
const CollectionsPage = lazy(() => import("../pages/Collections.js"));
const CollectionDetailPage = lazy(() => import("../pages/CollectionDetail.js"));
const ProfilePage = lazy(() => import("../pages/Profile.js"));
const FavoritesPage = lazy(() => import("../pages/Favorites.js"));
const SettingsPage = lazy(() => import("../pages/Settings.js"));
const PublicProfilePage = lazy(() => import("../pages/PublicProfile.js"));
const LoginPage = lazy(() => import("../pages/Login.js"));
const RegisterPage = lazy(() => import("../pages/Register.js"));
const ForgotPasswordPage = lazy(() => import("../pages/ForgotPassword.js"));
const NotFoundPage = lazy(() => import("../pages/NotFound.js"));

function PageLoader() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
    >
      <CircularProgress aria-label="Loading page" />
    </Box>
  );
}

function withSuspense(Component: React.ComponentType) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Public routes
      { index: true, element: withSuspense(HomePage) },
      { path: "discover", element: withSuspense(DiscoverPage) },
      { path: "search", element: withSuspense(SearchPage) },
      { path: "recipes/:slug", element: withSuspense(RecipeDetailPage) },
      { path: "tags/:slug", element: withSuspense(TagPage) },
      { path: "u/:username", element: withSuspense(PublicProfilePage) },

      // Auth routes (redirect to home if already logged in)
      {
        element: <AuthLayout />,
        children: [
          { path: "auth/login", element: withSuspense(LoginPage) },
          { path: "auth/register", element: withSuspense(RegisterPage) },
          {
            path: "auth/forgot-password",
            element: withSuspense(ForgotPasswordPage),
          },
        ],
      },

      // Protected routes (redirect to login if not authenticated)
      {
        element: <ProtectedLayout />,
        children: [
          { path: "recipes/new", element: withSuspense(RecipeCreatePage) },
          { path: "recipes/:slug/edit", element: withSuspense(RecipeEditPage) },
          { path: "collections", element: withSuspense(CollectionsPage) },
          {
            path: "collections/:id",
            element: withSuspense(CollectionDetailPage),
          },
          { path: "profile", element: withSuspense(ProfilePage) },
          { path: "profile/favorites", element: withSuspense(FavoritesPage) },
          { path: "profile/settings", element: withSuspense(SettingsPage) },
        ],
      },

      // 404
      { path: "*", element: withSuspense(NotFoundPage) },
    ],
  },
]);
