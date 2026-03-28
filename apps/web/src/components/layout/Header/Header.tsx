import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { Link, useNavigate } from "react-router";
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

  return (
    <StyledAppBar position="sticky" component="header">
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
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          <RestaurantMenuIcon
            sx={{ color: "#E85D26", fontSize: 22, mr: 0.5 }}
            aria-hidden
          />
          <LogoText variant="h6" component="span">
            recipe4you
            <LogoAccent aria-hidden />
          </LogoText>
        </LogoLink>

        <NavGroup component="nav" aria-label="Primary navigation">
          <NavButton component={Link} to="/discover">
            Discover
          </NavButton>
          <NavButton component={Link} to="/search">
            Search
          </NavButton>
          {isAuthenticated && (
            <>
              <NavButton component={Link} to="/collections">
                My Collections
              </NavButton>
              <NavButton component={Link} to="/profile/favorites">
                Favorites
              </NavButton>
            </>
          )}
        </NavGroup>

        <ActionGroup>
          {isAuthenticated ? (
            <>
              <AddRecipeButton
                component={Link}
                to="/recipes/new"
                startIcon={<AddIcon />}
              >
                Add Recipe
              </AddRecipeButton>
              <UserMenuButton
                component={Link}
                to="/profile"
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
              <LoginButton component={Link} to="/auth/login">
                Log in
              </LoginButton>
              <SignUpButton component={Link} to="/auth/register">
                Get started
              </SignUpButton>
            </>
          )}
        </ActionGroup>
      </StyledToolbar>
    </StyledAppBar>
  );
}
