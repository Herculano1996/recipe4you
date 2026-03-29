import { config } from "dotenv";
// Monorepo: .env lives two levels up from apps/api/
// In production env vars come from the host — dotenv is a no-op if file is absent.
config({ path: "../../.env" });
import Fastify from "fastify";
import fastifyHelmet from "@fastify/helmet";
import fastifyMultipart from "@fastify/multipart";
import fastifyRawBody from "fastify-raw-body";

import { corsPlugin } from "./plugins/cors.js";
import { authPlugin } from "./plugins/auth.js";
import { rateLimitPlugin } from "./plugins/rateLimit.js";
import { swaggerPlugin } from "./plugins/swagger.js";

import { sanitizeBody } from "./middleware/sanitize.js";

import { authRoutes } from "./routes/auth/index.js";
import { recipesRoutes } from "./routes/recipes/index.js";
import { favoritesRoutes } from "./routes/favorites/index.js";
import { collectionsRoutes } from "./routes/collections/index.js";
import { tagsRoutes } from "./routes/tags/index.js";
import { ingredientsRoutes } from "./routes/ingredients/index.js";
import { searchRoutes } from "./routes/search/index.js";
import { usersRoutes } from "./routes/users/index.js";
import { uploadRoutes } from "./routes/upload/index.js";
import { aiRoutes } from "./routes/ai/index.js";
import { billingRoutes } from "./routes/billing/index.js";

const app = Fastify({
  logger: {
    level: process.env.LOG_LEVEL ?? "info",
    transport:
      process.env.NODE_ENV === "development"
        ? { target: "pino-pretty", options: { colorize: true } }
        : undefined,
  },
});

// ─── Plugins ────────────────────────────────────────────────────────────────
await app.register(fastifyHelmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
});
await app.register(fastifyMultipart);
// Raw body needed for Stripe webhook signature verification
await app.register(fastifyRawBody, {
  field: "rawBody",
  global: false,
  encoding: false,
});
await corsPlugin(app);
await rateLimitPlugin(app);
await authPlugin(app);
await swaggerPlugin(app);

// ─── Global sanitize hook ────────────────────────────────────────────────────
app.addHook("preHandler", sanitizeBody);

// ─── Routes ─────────────────────────────────────────────────────────────────
const API_PREFIX = "/api/v1";

await app.register(
  async (v1) => {
    await v1.register(authRoutes);
    await v1.register(recipesRoutes);
    await v1.register(favoritesRoutes);
    await v1.register(collectionsRoutes);
    await v1.register(tagsRoutes);
    await v1.register(ingredientsRoutes);
    await v1.register(searchRoutes);
    await v1.register(usersRoutes);
    await v1.register(uploadRoutes);
    await v1.register(aiRoutes);
    await v1.register(billingRoutes);
  },
  { prefix: API_PREFIX },
);

// ─── Health check ───────────────────────────────────────────────────────────
app.get("/health", async () => ({
  status: "ok",
  timestamp: new Date().toISOString(),
}));

// ─── Start ──────────────────────────────────────────────────────────────────
const port = Number.parseInt(process.env.PORT ?? "3001", 10);
const host = process.env.HOST ?? "0.0.0.0";

try {
  await app.listen({ port, host });
  app.log.info(`Server running on http://${host}:${port}`);
  app.log.info(`API docs: http://${host}:${port}/documentation`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
