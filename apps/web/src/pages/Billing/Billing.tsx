import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router";
import { api } from "../../lib/api.js";
import { useSubscription } from "../../hooks/useSubscription.js";
import { AppAlert } from "../../components/ui/index.js";
import {
  BillingCard,
  StatusDot,
  PageTitle,
  PageSubtitle,
  ManageButton,
  UpgradeButton,
} from "./Billing.styled.js";
import { formatDate, buildStatusLabel } from "./Billing.utils.js";

export default function BillingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const justSubscribed = searchParams.get("success") === "true";

  const { tier, status, isPremium, currentPeriodEnd, cancelAtPeriodEnd } =
    useSubscription();

  const { mutate: openPortal, isPending } = useMutation({
    mutationFn: () =>
      api.post<{ data: { url: string } }, Record<string, never>>(
        "/billing/portal",
        {},
      ),
    onSuccess: (res) => {
      globalThis.location.href = res.data.url;
    },
  });

  const isActive = status === "ACTIVE" || status === "TRIALING";

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <PageTitle>Billing</PageTitle>
      <PageSubtitle>Manage your subscription and payment details.</PageSubtitle>

      {justSubscribed && (
        <AppAlert severity="success" icon={<AutoAwesomeIcon />} sx={{ mb: 3 }}>
          Welcome to Premium! Your subscription is now active.
        </AppAlert>
      )}

      <BillingCard elevation={0}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <AutoAwesomeIcon
            sx={{ color: isPremium ? "#ff6b35" : "text.disabled" }}
          />
          <Typography variant="h6" fontWeight={700}>
            {isPremium ? "Premium Plan" : "Free Plan"}
          </Typography>
          {isPremium && (
            <Chip
              label={buildStatusLabel(status)}
              size="small"
              sx={{
                background: isActive
                  ? "rgba(76,175,80,0.15)"
                  : "rgba(158,158,158,0.15)",
                color: isActive ? "#4caf50" : "text.secondary",
                fontWeight: 600,
              }}
            />
          )}
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Plan
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {tier === "PREMIUM" ? "Premium · $9/month" : "Free"}
            </Typography>
          </Box>

          {isPremium && (
            <>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  <StatusDot $active={isActive} />
                  {buildStatusLabel(status)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  {cancelAtPeriodEnd ? "Access until" : "Next billing date"}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {formatDate(currentPeriodEnd)}
                </Typography>
              </Box>

              {cancelAtPeriodEnd && (
                <AppAlert severity="warning">
                  Your subscription will cancel at the end of the current
                  period.
                </AppAlert>
              )}
            </>
          )}
        </Box>

        {isPremium ? (
          <ManageButton
            variant="outlined"
            endIcon={
              isPending ? (
                <CircularProgress size={16} />
              ) : (
                <OpenInNewIcon fontSize="small" />
              )
            }
            onClick={() => openPortal()}
            disabled={isPending}
            sx={{ borderColor: "rgba(255,255,255,0.15)" }}
          >
            {isPending ? "Opening portal..." : "Manage billing"}
          </ManageButton>
        ) : (
          <UpgradeButton
            variant="contained"
            disableElevation
            onClick={() => navigate("/premium")}
            startIcon={<AutoAwesomeIcon />}
          >
            Upgrade to Premium
          </UpgradeButton>
        )}
      </BillingCard>
    </Container>
  );
}
