import type { ReactNode } from "react";

export interface PremiumFeatureItem {
  icon: ReactNode;
  title: string;
  description: string;
}

export const FREE_PERKS = [
  "Browse & save unlimited recipes",
  "Create up to 10 personal recipes",
  "Organize into collections",
  "Basic search & filtering",
];

export const PREMIUM_PERKS = [
  "Everything in Free",
  "Unlimited AI recipe generation",
  "Nutrition estimation for any recipe",
  "Personalized weekly meal plans",
  "AI-powered recipe improvements",
  "Priority support",
];
