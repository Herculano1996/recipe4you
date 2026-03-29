import type { ReactNode } from "react";

export interface PremiumGateProps {
  children: ReactNode;
  /** Optional title override for the paywall card */
  featureName?: string;
  /** Optional description override */
  description?: string;
}
