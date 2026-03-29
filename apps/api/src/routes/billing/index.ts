import type { FastifyInstance } from "fastify";
import type Stripe from "stripe";
import { requireAuth } from "../../middleware/requireAuth.js";
import { logAuditEvent } from "../../middleware/auditLog.js";
import {
  createCheckoutSession,
  createPortalSession,
  constructWebhookEvent,
} from "../../services/stripeService.js";
import { prisma } from "../../lib/prisma.js";

export async function billingRoutes(app: FastifyInstance): Promise<void> {
  // GET /billing/status — subscription info for the current user
  app.get(
    "/billing/status",
    { preHandler: [requireAuth] },
    async (request, reply) => {
      const user = request.user as { id: string };

      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          subscriptionTier: true,
          stripeCustomerId: true,
          subscription: true,
        },
      });

      if (!dbUser) {
        return reply.status(404).send({
          error: { code: "USER_NOT_FOUND", message: "User not found" },
        });
      }

      const sub = dbUser.subscription;

      return reply.send({
        data: {
          tier: dbUser.subscriptionTier,
          status: sub?.status ?? "inactive",
          isPremium: dbUser.subscriptionTier === "PREMIUM",
          currentPeriodEnd: sub?.currentPeriodEnd?.toISOString() ?? null,
          cancelAtPeriodEnd: sub?.cancelAtPeriodEnd ?? false,
        },
      });
    },
  );

  // POST /billing/checkout — create Stripe Checkout session
  app.post(
    "/billing/checkout",
    { preHandler: [requireAuth] },
    async (request, reply) => {
      const user = request.user as { id: string };

      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { email: true, stripeCustomerId: true, subscriptionTier: true },
      });

      if (!dbUser) {
        return reply.status(404).send({
          error: { code: "USER_NOT_FOUND", message: "User not found" },
        });
      }

      if (dbUser.subscriptionTier === "PREMIUM") {
        return reply.status(409).send({
          error: {
            code: "ALREADY_PREMIUM",
            message: "You already have an active Premium subscription",
          },
        });
      }

      await logAuditEvent({
        action: "BILLING_CHECKOUT",
        userId: user.id,
        request,
      });

      const { url } = await createCheckoutSession(
        user.id,
        dbUser.email,
        dbUser.stripeCustomerId,
      );

      return reply.send({ data: { url } });
    },
  );

  // POST /billing/portal — create Stripe Customer Portal session
  app.post(
    "/billing/portal",
    { preHandler: [requireAuth] },
    async (request, reply) => {
      const user = request.user as { id: string };

      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { stripeCustomerId: true },
      });

      if (!dbUser?.stripeCustomerId) {
        return reply.status(404).send({
          error: {
            code: "NO_CUSTOMER",
            message: "No billing account found. Please subscribe first.",
          },
        });
      }

      await logAuditEvent({
        action: "BILLING_PORTAL",
        userId: user.id,
        request,
      });

      const { url } = await createPortalSession(dbUser.stripeCustomerId);

      return reply.send({ data: { url } });
    },
  );

  // POST /billing/webhook — Stripe webhook receiver (no auth, raw body)
  app.post(
    "/billing/webhook",
    {
      config: { rawBody: true },
    },
    async (request, reply) => {
      const signature = request.headers["stripe-signature"] as string;

      if (!signature) {
        return reply
          .status(400)
          .send({ error: "Missing stripe-signature header" });
      }

      let event: Stripe.Event;
      try {
        event = constructWebhookEvent(request.rawBody as Buffer, signature);
      } catch {
        return reply.status(400).send({ error: "Invalid webhook signature" });
      }

      await logAuditEvent({
        action: "BILLING_WEBHOOK",
        metadata: { eventType: event.type, eventId: event.id },
        request,
      });

      await handleStripeEvent(event);

      return reply.status(200).send({ received: true });
    },
  );
}

// ─── Stripe Event Handlers ──────────────────────────────────────────────────

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
): Promise<void> {
  const userId = session.metadata?.userId;
  const customerId =
    typeof session.customer === "string" ? session.customer : null;
  const subscriptionId =
    typeof session.subscription === "string" ? session.subscription : null;

  if (!userId || !subscriptionId) return;

  const { stripe } = await import("../../services/stripeService.js");
  const sub = await stripe.subscriptions.retrieve(subscriptionId);
  const item = sub.items.data[0];
  const periodStart = new Date((item?.current_period_start ?? 0) * 1000);
  const periodEnd = new Date((item?.current_period_end ?? 0) * 1000);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionTier: "PREMIUM",
        role: "PREMIUM",
        stripeCustomerId: customerId ?? undefined,
      },
    }),
    prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        stripeSubscriptionId: subscriptionId,
        stripePriceId: item?.price.id ?? "",
        status: sub.status,
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: sub.cancel_at_period_end,
      },
      update: {
        stripeSubscriptionId: subscriptionId,
        stripePriceId: item?.price.id ?? "",
        status: sub.status,
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: sub.cancel_at_period_end,
      },
    }),
  ]);
}

async function handleSubscriptionUpdated(
  sub: Stripe.Subscription,
): Promise<void> {
  const userId = sub.metadata?.userId;
  if (!userId) return;

  const item = sub.items.data[0];
  const isActive = sub.status === "active" || sub.status === "trialing";

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionTier: isActive ? "PREMIUM" : "FREE",
        role: isActive ? "PREMIUM" : "USER",
      },
    }),
    prisma.subscription.update({
      where: { userId },
      data: {
        status: sub.status,
        stripePriceId: item?.price.id ?? "",
        currentPeriodStart: new Date((item?.current_period_start ?? 0) * 1000),
        currentPeriodEnd: new Date((item?.current_period_end ?? 0) * 1000),
        cancelAtPeriodEnd: sub.cancel_at_period_end,
      },
    }),
  ]);
}

async function handleSubscriptionDeleted(
  sub: Stripe.Subscription,
): Promise<void> {
  const userId = sub.metadata?.userId;
  if (!userId) return;

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { subscriptionTier: "FREE", role: "USER" },
    }),
    prisma.subscription.update({
      where: { userId },
      data: { status: "canceled" },
    }),
  ]);
}

async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice,
): Promise<void> {
  const parent = invoice.parent as {
    subscription_details?: { subscription?: string };
  } | null;
  const subId = parent?.subscription_details?.subscription ?? null;
  if (!subId) return;

  await prisma.subscription.update({
    where: { stripeSubscriptionId: subId },
    data: { status: "past_due" },
  });
}

async function handleStripeEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object);
      break;
    case "customer.subscription.updated":
      await handleSubscriptionUpdated(event.data.object);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event.data.object);
      break;
    case "invoice.payment_failed":
      await handleInvoicePaymentFailed(event.data.object);
      break;
    default:
      break;
  }
}
