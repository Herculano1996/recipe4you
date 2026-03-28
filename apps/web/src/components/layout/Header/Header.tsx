import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../../store/authStore.js";
import type { HeaderProps } from "./Header.types.js";
import {
  StyledAppBar,
  StyledToolbar,
  LogoText,
  LogoAccent,
  LogoLink,
  NavGroup,
  NavButton,
  ActionGroup,
  AddRecipeButton,
  LoginButton,
  SignUpButton,
  UserMenuButton,
  MobileMenuButton,
} from "./Header.styled.js";

export function Header({ onMenuToggle }: HeaderProps) {
  const navigate = useNavigate();
  const { isAuthenticated, user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  const handleNav =
    (path: string) => (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      navigate(path);
    };

  return (
    <StyledAppBar position="sticky">
      <StyledToolbar disableGutters>
        <MobileMenuButton
          edge="start"
          aria-label="Toggle navigation menu"
          onClick={onMenuToggle}
        >
          <MenuIcon />
        </MobileMenuButton>

        <LogoLink
          href="/"
          aria-label="recipe4you — go to home"
          onClick={handleNav("/")}
        >
          <RestaurantMenuIcon
            sx={{ color: "#E85D26", fontSize: 22, mr: 0.5 }}
            aria-hidden
          />
          <LogoText variant="h6" as="span">
            recipe4you
            <LogoAccent aria-hidden />
          </LogoText>
        </LogoLink>

        <NavGroup as="nav" aria-label="Primary navigation">
          <NavButton href="/discover" onClick={handleNav("/discover")}>
            Discover
          </NavButton>
          <NavButton href="/search" onClick={handleNav("/search")}>
            Search
          </NavButton>
          {isAuthenticated && (
            <>
              <NavButton href="/collections" onClick={handleNav("/collections")}>
                My Collections
              </NavButton>
              <NavButton
                href="/profile/favorites"
                onClick={handleNav("/profile/favorites")}
              >
                Favorites
              </NavButton>
            </>
          )}
        </NavGroup>

        <ActionGroup>
          {isAuthenticated ? (
            <>
              <AddRecipeButton
                href="/recipes/new"
                onClick={handleNav("/recipes/new")}
                startIcon={<AddIcon />}
              >
                Add Recipe
              </AddRecipeButton>
              <UserMenuButton
                href="/profile"
                onClick={handleNav("/profile")}
                aria-label={`Your profile — ${user?.displayName ?? user?.username}`}
              >
                {user?.displayName ?? user?.username}
              </UserMenuButton>
              <LoginButton onClick={handleLogout} aria-label="Log out">
                Log out
              </LoginButton>
            </>
          ) : (
            <>
              <LoginButton href="/auth/login" onClick={handleNav("/auth/login")}>
                Log in
              </LoginButton>
              <SignUpButton
                href="/auth/register"
                onClick={handleNav("/auth/register")}
              >
                Get started
              </SignUpButton>
            </>
          )}
        </ActionGroup>
      </StyledToolbar>
    </StyledAppBar>
  );
}
