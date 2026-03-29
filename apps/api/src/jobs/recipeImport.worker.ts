import { Worker, type Job } from "bullmq";
import {
  getTheMealDBById,
  searchSpoonacular,
} from "../services/externalApi.js";
import { logger } from "../lib/logger.js";
import type { RecipeImportJobPayload } from "../services/jobService.js";

const connection = {
  url: process.env.REDIS_URL ?? "redis://localhost:6379",
  tls: process.env.REDIS_URL?.startsWith("rediss://") ? {} : undefined,
};

async function processImportJob(
  job: Job<RecipeImportJobPayload>,
): Promise<unknown> {
  const { source, externalId } = job.data;
  logger.info(
    { jobId: job.id, source, externalId },
    "Processing recipe import job",
  );

  switch (source) {
    case "themealdb":
      return getTheMealDBById(externalId);
    case "spoonacular":
      return searchSpoonacular(externalId);
    default:
      throw new Error(`Unsupported import source: ${source}`);
  }
}

export const recipeImportWorker = new Worker<RecipeImportJobPayload>(
  "recipe-import",
  processImportJob,
  { connection, concurrency: 5 },
);

recipeImportWorker.on("completed", (job) => {
  logger.info(
    { jobId: job.id, source: job.data.source },
    "Recipe import job completed",
  );
});

recipeImportWorker.on("failed", (job, err) => {
  logger.error(
    { jobId: job?.id, source: job?.data.source, err },
    "Recipe import job failed",
  );
});
