/**
 * Authorship Receipt — Worker Entrypoint
 *
 * Background job processor for document analysis.
 * Run with: npm run dev --workspace=apps/worker
 */

import { Worker } from "bullmq";
import { config } from "./utils/env.js";
import { logger } from "./utils/logger.js";
import { getAnalysisQueue, closeAnalysisQueue, type AnalysisJobData } from "./queues/analysisQueue.js";
import { processAnalyzeDocumentJob } from "./jobs/analyzeDocumentJob.js";
import { startHttpServer } from "./http-server.js";

// Import routes to register them
import "./routes/enqueue.js";

let worker: Worker<AnalysisJobData> | null = null;

async function startWorker(): Promise<void> {
  logger.info("=".repeat(50));
  logger.info("Authorship Receipt — Worker starting");
  logger.info(`Queue: ${config.queue.name}`);
  logger.info(`Concurrency: ${config.queue.concurrency}`);
  logger.info(`Redis: ${config.redis.host}:${config.redis.port}`);
  logger.info("=".repeat(50));

  // Verify Redis connection by getting the queue
  const queue = getAnalysisQueue();

  worker = new Worker<AnalysisJobData>(
    config.queue.name,
    async (job) => {
      return processAnalyzeDocumentJob(job);
    },
    {
      connection: config.redis.url
        ? { url: config.redis.url }
        : { host: config.redis.host, port: config.redis.port },
      concurrency: config.queue.concurrency,
    }
  );

  // Event handlers
  worker.on("active", (job) => {
    logger.info(`Job ${job.id} is now active`, { jobId: job.id, attempt: job.attemptsMade });
  });

  worker.on("completed", (job) => {
    logger.info(`Job ${job.id} completed successfully`, { jobId: job.id });
  });

  worker.on("failed", (job, err) => {
    logger.error(`Job ${job?.id} failed`, err, {
      jobId: job?.id,
      attemptsMade: job?.attemptsMade,
    });
  });

  worker.on("progress", (job, progress) => {
    logger.debug(`Job ${job.id} progress: ${progress}%`, { jobId: job.id });
  });

  worker.on("error", (err) => {
    logger.error("Worker error", err);
  });

  worker.on("stalled", (jobId) => {
    logger.warn(`Job ${jobId} stalled`, { jobId });
  });

  // Start HTTP server for web app communication
  startHttpServer(config.app.port, () => {
    logger.info(`✅ Worker HTTP server listening on port ${config.app.port}`);
  });

  logger.info("✅ Worker initialized and ready");
}

// Graceful shutdown
async function shutdown(signal: string): Promise<void> {
  logger.info(`Received ${signal} — shutting down gracefully...`);

  if (worker) {
    await worker.close();
    logger.info("Worker closed");
  }

  await closeAnalysisQueue();
  logger.info("Queue closed");

  process.exit(0);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// Unhandled rejection safety
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled rejection", reason);
});

startWorker().catch((err) => {
  logger.error("Failed to start worker", err);
  process.exit(1);
});
