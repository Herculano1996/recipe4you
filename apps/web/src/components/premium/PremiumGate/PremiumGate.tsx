import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { useSubscription } from "../../../hooks/useSubscription.js";
import { useAuthStore } from "../../../store/authStore.js";
import {
  GateCard,
  GateWrapper,
  IconRing,
  UpgradeButton,
} from "./PremiumGate.styled.js";
import type { PremiumGateProps } from "./PremiumGate.types.js";

export function PremiumGate({
  children,
  featureName = "Premium Feature",
  description = "Unlock AI-powered tools, meal planning, and more with a Premium subscription.",
}: PremiumGateProps) {
  const { isPremium } = useSubscription();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  if (isPremium) {
    return <>{children}</>;
  }

  function handleUpgradeClick() {
    if (!isAuthenticated) {
      navigate("/auth/login", { state: { from: "/premium" } });
    } else {
      navigate("/premium");
    }
  }

  return (
    <GateWrapper>
      <GateCard elevation={0}>
        <IconRing>
          <AutoAwesomeIcon sx={{ color: "#fff", fontSize: 32 }} />
        </IconRing>

        <Typography
          variant="h5"
          fontWeight={700}
          gutterBottom
          sx={{ color: "text.primary" }}
        >
          {featureName}
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "text.secondary", lineHeight: 1.7 }}
        >
          {description}
        </Typography>

        <UpgradeButton
          variant="contained"
          disableElevation
          onClick={handleUpgradeClick}
          startIcon={<AutoAwesomeIcon />}
        >
          Upgrade to Premium
        </UpgradeButton>
      </GateCard>
    </GateWrapper>
  );
}
