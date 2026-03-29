import type { FastifyInstance } from "fastify";
import fastifyRateLimit from "@fastify/rate-limit";

export async function rateLimitPlugin(app: FastifyInstance): Promise<void> {
  await app.register(fastifyRateLimit, {
    max: Number.parseInt(process.env.RATE_LIMIT_MAX ?? "200", 10),
    timeWindow: process.env.RATE_LIMIT_WINDOW ?? "1 minute",
    // Key per authenticated user, fallback to IP for horizontal-scaling fairness
    keyGenerator: (request) => {
      const user = request.user as { id?: string } | undefined;
      return user?.id ?? request.ip;
    },
    errorResponseBuilder: () => ({
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Too many requests, please try again later.",
      },
    }),
  });
}
