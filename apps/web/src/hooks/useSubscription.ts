import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api.js";
import { useAuthStore } from "../store/authStore.js";

type SubscriptionTier = "FREE" | "PREMIUM";
type SubscriptionStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "TRIALING"
  | "PAST_DUE"
  | "CANCELED"
  | "UNPAID";

interface SubscriptionInfo {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  trialEnd?: string;
}

export function useSubscription() {
  const { isAuthenticated } = useAuthStore();

  const { data } = useQuery({
    queryKey: ["subscription"],
    queryFn: () => api.get<SubscriptionInfo>("/billing/status"),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });

  return {
    tier: data?.tier ?? "FREE",
    status: data?.status ?? "INACTIVE",
    currentPeriodEnd: data?.currentPeriodEnd,
    cancelAtPeriodEnd: data?.cancelAtPeriodEnd ?? false,
    trialEnd: data?.trialEnd,
    isPremium: data?.tier === "PREMIUM",
  };
}
