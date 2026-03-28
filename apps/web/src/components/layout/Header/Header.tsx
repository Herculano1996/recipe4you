import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import type { HeaderProps } from "./Header.types.js";
import { useAuthStore } from "../../../store/authStore.js";
import {
  HeaderWrapper,
  FloatingBar,
  LogoLink,
  LogoIcon,
  LogoText,
  NavGroup,
  NavLink,
  ActionGroup,
  AddRecipeButton,
  LoginButton,
  SignUpButton,
  UserMenuButton,
  LogoutButton,
  MobileMenuButton,
  MobileMenuOverlay,
  MobileCloseButton,
  MobileNavItem,
  MobileDivider,
  MobileSignUpItem,
} from "./Header.styled.js";

export function Header({ onMenuToggle }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    setMobileOpen(false);
    clearAuth();
    navigate("/");
  };

  const go = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileOpen(false);
    navigate(path);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <HeaderWrapper>
        <FloatingBar $scrolled={scrolled}>
          {/* Logo */}
          <LogoLink href="/" aria-label="recipe4you — home" onClick={go("/")}>
            <LogoIcon aria-hidden>🍳</LogoIcon>
            <LogoText>recipe4you</LogoText>
          </LogoLink>

          {/* Desktop nav */}
          <NavGroup aria-label="Primary navigation">
            <NavLink
              href="/discover"
              $active={isActive("/discover")}
              onClick={go("/discover")}
            >
              Discover
            </NavLink>
            <NavLink
              href="/search"
              $active={isActive("/search")}
              onClick={go("/search")}
            >
              Search
            </NavLink>
            {isAuthenticated && (
              <>
                <NavLink
                  href="/collections"
                  $active={isActive("/collections")}
                  onClick={go("/collections")}
                >
                  Collections
                </NavLink>
                <NavLink
                  href="/profile/favorites"
                  $active={isActive("/profile/favorites")}
                  onClick={go("/profile/favorites")}
                >
                  Favorites
                </NavLink>
              </>
            )}
          </NavGroup>

          {/* Desktop actions */}
          <ActionGroup>
            {isAuthenticated ? (
              <>
                <AddRecipeButton
                  href="/recipes/new"
                  onClick={go("/recipes/new")}
                  startIcon={<AddIcon sx={{ fontSize: "16px !important" }} />}
                >
                  Add Recipe
                </AddRecipeButton>
                <UserMenuButton
                  href="/profile"
                  onClick={go("/profile")}
                  aria-label={`Profile — ${user?.displayName ?? user?.username}`}
                >
                  {user?.displayName ?? user?.username}
                </UserMenuButton>
                <LogoutButton onClick={handleLogout} aria-label="Log out">
                  Log out
                </LogoutButton>
              </>
            ) : (
              <>
                <LoginButton href="/auth/login" onClick={go("/auth/login")}>
                  Log in
                </LoginButton>
                <SignUpButton
                  href="/auth/register"
                  onClick={go("/auth/register")}
                >
                  Get started
                </SignUpButton>
              </>
            )}
          </ActionGroup>

          {/* Mobile toggle */}
          <MobileMenuButton
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => {
              setMobileOpen((v) => !v);
              onMenuToggle();
            }}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </MobileMenuButton>
        </FloatingBar>
      </HeaderWrapper>

      {/* Full-screen mobile menu */}
      <MobileMenuOverlay
        $open={mobileOpen}
        role="dialog"
        aria-modal
        aria-label="Navigation menu"
      >
        <MobileCloseButton
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        >
          <CloseIcon />
        </MobileCloseButton>

        <MobileNavItem href="/discover" onClick={go("/discover")}>
          Discover
        </MobileNavItem>
        <MobileNavItem href="/search" onClick={go("/search")}>
          Search
        </MobileNavItem>

        {isAuthenticated && (
          <>
            <MobileNavItem href="/collections" onClick={go("/collections")}>
              Collections
            </MobileNavItem>
            <MobileNavItem
              href="/profile/favorites"
              onClick={go("/profile/favorites")}
            >
              Favorites
            </MobileNavItem>
          </>
        )}

        <MobileDivider />

        {isAuthenticated ? (
          <>
            <MobileNavItem href="/recipes/new" onClick={go("/recipes/new")}>
              + Add Recipe
            </MobileNavItem>
            <MobileNavItem href="/profile" onClick={go("/profile")}>
              {user?.displayName ?? user?.username}
            </MobileNavItem>
            <MobileNavItem href="#" onClick={handleLogout}>
              Log out
            </MobileNavItem>
          </>
        ) : (
          <>
            <MobileNavItem href="/auth/login" onClick={go("/auth/login")}>
              Log in
            </MobileNavItem>
            <MobileSignUpItem
              href="/auth/register"
              onClick={go("/auth/register")}
            >
              Get started →
            </MobileSignUpItem>
          </>
        )}
      </MobileMenuOverlay>
    </>
  );
}
