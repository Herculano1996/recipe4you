import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckIcon from "@mui/icons-material/Check";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { api } from "../../lib/api.js";
import { useSubscription } from "../../hooks/useSubscription.js";
import { useAuthStore } from "../../store/authStore.js";
import {
  HeroSection,
  GradientHeading,
  PricingCard,
  FeatureCard,
  FeatureIconBox,
  CtaButton,
  ManageButton,
} from "./Premium.styled.js";
import { FREE_PERKS, PREMIUM_PERKS } from "./Premium.types.js";
import type { PremiumFeatureItem } from "./Premium.types.js";

const PREMIUM_FEATURES: PremiumFeatureItem[] = [
  {
    icon: <SmartToyIcon />,
    title: "AI Recipe Generator",
    description:
      "Tell Claude what ingredients you have and get a personalized recipe in seconds.",
  },
  {
    icon: <RestaurantMenuIcon />,
    title: "Nutrition Estimation",
    description:
      "Get accurate macro and micro-nutrient breakdowns for any recipe.",
  },
  {
    icon: <CalendarMonthIcon />,
    title: "Weekly Meal Planner",
    description:
      "Generate a complete 7-day meal plan tailored to your goals and dietary needs.",
  },
  {
    icon: <TipsAndUpdatesIcon />,
    title: "Recipe Improvement",
    description:
      "Get expert suggestions to improve flavor, nutrition, or technique for any recipe.",
  },
];

export default function PremiumPage() {
  const { isPremium } = useSubscription();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const { mutate: startCheckout, isPending } = useMutation({
    mutationFn: () =>
      api.post<{ data: { url: string } }, Record<string, never>>(
        "/billing/checkout",
        {},
      ),
    onSuccess: (res) => {
      globalThis.location.href = res.data.url;
    },
  });

  function handleUpgradeClick() {
    if (!isAuthenticated) {
      navigate("/auth/login", { state: { from: "/premium" } });
      return;
    }
    startCheckout();
  }

  return (
    <Container maxWidth="lg">
      <HeroSection>
        <Chip
          icon={<AutoAwesomeIcon />}
          label="Premium"
          sx={{
            mb: 2,
            background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.85rem",
          }}
        />
        <Typography
          variant="h2"
          fontWeight={800}
          letterSpacing="-1px"
          gutterBottom
        >
          Cook smarter with <GradientHeading>AI</GradientHeading>
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 540, mx: "auto", lineHeight: 1.7 }}
        >
          Upgrade to Premium and unlock Claude-powered tools that transform how
          you plan, cook, and eat.
        </Typography>
      </HeroSection>

      <Grid container spacing={3} sx={{ mb: 8 }}>
        {PREMIUM_FEATURES.map((feature) => (
          <Grid size={{ xs: 12, sm: 6 }} key={feature.title}>
            <FeatureCard elevation={0}>
              <FeatureIconBox>{feature.icon}</FeatureIconBox>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                {feature.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                lineHeight={1.7}
              >
                {feature.description}
              </Typography>
            </FeatureCard>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 8 }} alignItems="stretch">
        <Grid size={{ xs: 12, md: 6 }}>
          <PricingCard elevation={0}>
            <Typography
              variant="overline"
              color="text.secondary"
              fontWeight={600}
            >
              Free
            </Typography>
            <Typography variant="h3" fontWeight={800} sx={{ my: 1 }}>
              $0
              <Typography
                component="span"
                variant="body1"
                color="text.secondary"
              >
                {" "}
                / forever
              </Typography>
            </Typography>
            <List dense>
              {FREE_PERKS.map((perk) => (
                <ListItem key={perk} disableGutters>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={perk}
                    primaryTypographyProps={{ variant: "body2" }}
                  />
                </ListItem>
              ))}
            </List>
          </PricingCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <PricingCard elevation={0} $featured>
            <Box
              sx={{
                position: "absolute",
                top: -14,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <Chip
                label="Most Popular"
                size="small"
                sx={{
                  background:
                    "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
                  color: "#fff",
                  fontWeight: 700,
                }}
              />
            </Box>
            <Typography
              variant="overline"
              sx={{ color: "#ff6b35" }}
              fontWeight={600}
            >
              Premium
            </Typography>
            <Typography variant="h3" fontWeight={800} sx={{ my: 1 }}>
              $9
              <Typography
                component="span"
                variant="body1"
                color="text.secondary"
              >
                {" "}
                / month
              </Typography>
            </Typography>
            <List dense>
              {PREMIUM_PERKS.map((perk) => (
                <ListItem key={perk} disableGutters>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckIcon sx={{ fontSize: 18, color: "#ff6b35" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={perk}
                    primaryTypographyProps={{
                      variant: "body2",
                      fontWeight: perk === "Everything in Free" ? 400 : 500,
                    }}
                  />
                </ListItem>
              ))}
            </List>

            {isPremium ? (
              <ManageButton
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate("/billing")}
              >
                Manage subscription
              </ManageButton>
            ) : (
              <CtaButton
                variant="contained"
                fullWidth
                disableElevation
                onClick={handleUpgradeClick}
                disabled={isPending}
                startIcon={
                  isPending ? (
                    <CircularProgress size={18} sx={{ color: "#fff" }} />
                  ) : (
                    <AutoAwesomeIcon />
                  )
                }
              >
                {isPending ? "Redirecting..." : "Get Premium"}
              </CtaButton>
            )}
          </PricingCard>
        </Grid>
      </Grid>
    </Container>
  );
}
