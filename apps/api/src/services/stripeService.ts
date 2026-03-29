import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-03-25.dahlia",
});

// ─── Create Checkout Session ────────────────────────────────────────────────

export async function createCheckoutSession(
  userId: string,
  userEmail: string,
  stripeCustomerId: string | null,
): Promise<{ url: string }> {
  const priceId = process.env.STRIPE_PRICE_ID_PREMIUM;
  if (!priceId) {
    throw new Error("Missing STRIPE_PRICE_ID_PREMIUM environment variable");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer: stripeCustomerId ?? undefined,
    customer_email: stripeCustomerId ? undefined : userEmail,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.APP_URL}/billing?success=true`,
    cancel_url: `${process.env.APP_URL}/premium`,
    metadata: { userId },
    subscription_data: {
      metadata: { userId },
    },
    allow_promotion_codes: true,
  });

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL");
  }

  return { url: session.url };
}

// ─── Create Customer Portal Session ────────────────────────────────────────

export async function createPortalSession(
  stripeCustomerId: string,
): Promise<{ url: string }> {
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${process.env.APP_URL}/billing`,
  });

  return { url: session.url };
}

// ─── Construct Webhook Event ────────────────────────────────────────────────

export function constructWebhookEvent(
  rawBody: Buffer,
  signature: string,
): Stripe.Event {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("Missing STRIPE_WEBHOOK_SECRET environment variable");
  }
  return stripe.webhooks.constructEvent(rawBody, signature, secret);
}
