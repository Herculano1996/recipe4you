import { Worker, type Job } from "bullmq";
import { logger } from "../lib/logger.js";
import type { EmailJobPayload } from "../services/jobService.js";

const connection = {
  url: process.env.REDIS_URL ?? "redis://localhost:6379",
  tls: process.env.REDIS_URL?.startsWith("rediss://") ? {} : undefined,
};

// Email templates — swap for your mail provider (Resend, SendGrid, etc.)
const TEMPLATES: Record<
  EmailJobPayload["template"],
  (data?: Record<string, unknown>) => string
> = {
  welcome: () => "Welcome to recipe4you! We're glad to have you.",
  "subscription-activated": () =>
    "Your Premium subscription is now active. Enjoy all features!",
  "subscription-canceled": () =>
    "Your Premium subscription has been canceled. You can resubscribe anytime.",
  "password-reset": (data) =>
    `Reset your password: ${data?.resetUrl ?? "(no link provided)"}`,
};

async function processEmailJob(job: Job<EmailJobPayload>): Promise<void> {
  const { to, subject, template, data } = job.data;
  const body = TEMPLATES[template](data);

  logger.info({ jobId: job.id, to, subject, template, body }, "Sending email");

  // TODO: integrate with your mail provider, e.g.:
  // await resend.emails.send({ from: "noreply@recipe4you.app", to, subject, text: body });

  logger.info({ jobId: job.id, to, template }, "Email sent (stub)");
}

export const emailWorker = new Worker<EmailJobPayload>(
  "email-notification",
  processEmailJob,
  { connection, concurrency: 10 },
);

emailWorker.on("completed", (job) => {
  logger.info(
    { jobId: job.id, template: job.data.template },
    "Email notification sent",
  );
});

emailWorker.on("failed", (job, err) => {
  logger.error(
    { jobId: job?.id, template: job?.data.template, err },
    "Email notification failed",
  );
});
