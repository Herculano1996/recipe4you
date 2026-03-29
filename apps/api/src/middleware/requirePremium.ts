import type { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma.js";

/**
 * Fastify preHandler — must be used after requireAuth.
 * Checks the user's subscriptionTier in the DB and rejects non-premium callers.
 */
export async function requirePremium(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const payload = request.user as { id?: string } | undefined;

  if (!payload?.id) {
    await reply.status(401).send({
      error: { code: "UNAUTHORIZED", message: "Authentication required" },
    });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { subscriptionTier: true },
  });

  if (user?.subscriptionTier !== "PREMIUM") {
    await reply.status(403).send({
      error: {
        code: "PREMIUM_REQUIRED",
        message: "This feature requires a Premium subscription",
      },
    });
  }
}
