/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { RootLayout } from "../layouts/RootLayout.js";
import { AuthLayout } from "../layouts/AuthLayout.js";
import { ProtectedLayout } from "../layouts/ProtectedLayout.js";

// Lazy-loaded pages for code splitting
const HomePage = lazy(() => import("../pages/Home/index.js"));
const DiscoverPage = lazy(() => import("../pages/Discover/index.js"));
const SearchPage = lazy(() => import("../pages/Search/index.js"));
const RecipeDetailPage = lazy(() => import("../pages/RecipeDetail/index.js"));
const RecipeCreatePage = lazy(() => import("../pages/RecipeCreate/index.js"));
const RecipeEditPage = lazy(() => import("../pages/RecipeEdit/index.js"));
const TagPage = lazy(() => import("../pages/Tag/index.js"));
const CollectionsPage = lazy(() => import("../pages/Collections/index.js"));
const CollectionDetailPage = lazy(
  () => import("../pages/CollectionDetail/index.js"),
);
const ProfilePage = lazy(() => import("../pages/Profile/index.js"));
const FavoritesPage = lazy(() => import("../pages/Favorites/index.js"));
const SettingsPage = lazy(() => import("../pages/Settings/index.js"));
const PublicProfilePage = lazy(() => import("../pages/PublicProfile/index.js"));
const LoginPage = lazy(() => import("../pages/Login/index.js"));
const RegisterPage = lazy(() => import("../pages/Register/index.js"));
const ForgotPasswordPage = lazy(
  () => import("../pages/ForgotPassword/index.js"),
);
const PremiumPage = lazy(() => import("../pages/Premium/index.js"));
const BillingPage = lazy(() => import("../pages/Billing/index.js"));
const AiAssistantPage = lazy(() => import("../pages/AiAssistant/index.js"));
const NotFoundPage = lazy(() => import("../pages/NotFound/index.js"));

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

      // Premium / public upsell page (accessible to all)
      { path: "premium", element: withSuspense(PremiumPage) },

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
          { path: "billing", element: withSuspense(BillingPage) },
          { path: "ai", element: withSuspense(AiAssistantPage) },
        ],
      },

      // 404
      { path: "*", element: withSuspense(NotFoundPage) },
    ],
  },
]);
