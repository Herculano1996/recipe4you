import { Worker, type Job } from "bullmq";
import {
  generateRecipeFromIngredients,
  estimateNutrition,
  generateMealPlan,
  improveRecipe,
} from "../services/aiService.js";
import { logger } from "../lib/logger.js";
import type { AiJobPayload } from "../services/jobService.js";

const connection = {
  url: process.env.REDIS_URL ?? "redis://localhost:6379",
  tls: process.env.REDIS_URL?.startsWith("rediss://") ? {} : undefined,
};

async function processAiJob(job: Job<AiJobPayload>): Promise<unknown> {
  const { type, data } = job.data;
  logger.info({ jobId: job.id, type }, "Processing AI job");

  switch (type) {
    case "generate-recipe":
      return generateRecipeFromIngredients(
        data.ingredients as string[],
        data.preferences as Parameters<typeof generateRecipeFromIngredients>[1],
      );
    case "estimate-nutrition":
      return estimateNutrition(
        data.recipeTitle as string,
        data.ingredients as Parameters<typeof estimateNutrition>[1],
        data.servings as number,
      );
    case "meal-plan":
      return generateMealPlan(data as Parameters<typeof generateMealPlan>[0]);
    case "improve-recipe":
      return improveRecipe(data as Parameters<typeof improveRecipe>[0]);
    default:
      throw new Error(`Unknown AI job type: ${type}`);
  }
}

export const aiWorker = new Worker<AiJobPayload>(
  "ai-processing",
  processAiJob,
  {
    connection,
    concurrency: 2,
  },
);

aiWorker.on("completed", (job) => {
  logger.info({ jobId: job.id, type: job.data.type }, "AI job completed");
});

aiWorker.on("failed", (job, err) => {
  logger.error({ jobId: job?.id, type: job?.data.type, err }, "AI job failed");
});
