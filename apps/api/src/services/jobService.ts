import { Queue } from "bullmq";
import { logger } from "../lib/logger.js";

// BullMQ requires a standard Redis TCP connection (ioredis), not the REST client.
// Use REDIS_URL (e.g. rediss://default:token@host:port) for Upstash TCP endpoint.
const connection = {
  url: process.env.REDIS_URL ?? "redis://localhost:6379",
  tls: process.env.REDIS_URL?.startsWith("rediss://") ? {} : undefined,
};

// ─── Queue Definitions ───────────────────────────────────────────────────────

export const aiQueue = new Queue("ai-processing", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
  },
});

export const recipeImportQueue = new Queue("recipe-import", {
  connection,
  defaultJobOptions: {
    attempts: 2,
    backoff: { type: "fixed", delay: 5000 },
    removeOnComplete: { count: 50 },
    removeOnFail: { count: 25 },
  },
});

export const emailQueue = new Queue("email-notification", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 1000 },
    removeOnComplete: { count: 200 },
    removeOnFail: { count: 50 },
  },
});

// ─── Job Type Payloads ────────────────────────────────────────────────────────

export interface AiJobPayload {
  type:
    | "generate-recipe"
    | "estimate-nutrition"
    | "meal-plan"
    | "improve-recipe";
  userId: string;
  data: Record<string, unknown>;
  callbackUrl?: string;
}

export interface RecipeImportJobPayload {
  source: "themealdb" | "spoonacular" | "edamam";
  externalId: string;
  requestedByUserId?: string;
}

export interface EmailJobPayload {
  to: string;
  subject: string;
  template:
    | "welcome"
    | "subscription-activated"
    | "subscription-canceled"
    | "password-reset";
  data?: Record<string, unknown>;
}

// ─── Job Adders ─────────────────────────────────────────────────────────────

export function addAiJob(payload: AiJobPayload) {
  return aiQueue.add(payload.type, payload);
}

export function addRecipeImportJob(payload: RecipeImportJobPayload) {
  return recipeImportQueue.add(`import-${payload.source}`, payload);
}

export function addEmailJob(payload: EmailJobPayload) {
  return emailQueue.add(payload.template, payload);
}

// ─── Queue Event Logging ─────────────────────────────────────────────────────

function attachQueueLogger(queue: Queue) {
  queue.on("error", (err) => {
    logger.error({ err, queue: queue.name }, "BullMQ queue error");
  });
}

attachQueueLogger(aiQueue);
attachQueueLogger(recipeImportQueue);
attachQueueLogger(emailQueue);
