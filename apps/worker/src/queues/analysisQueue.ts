/**
 * BullMQ queue for analysis jobs.
 */

import { Queue } from "bullmq";
import { config } from "../utils/env.js";
import { logger } from "../utils/logger.js";

// Job data shape
export interface AnalysisJobData {
  jobId: string;      // Database AnalysisJob ID
  documentId: string;
  versionId: string;
}

// Create the queue (singleton)
let queueInstance: Queue<AnalysisJobData> | null = null;

export function getAnalysisQueue(): Queue<AnalysisJobData> {
  if (!queueInstance) {
    queueInstance = new Queue<AnalysisJobData>(config.queue.name, {
      connection: config.redis.url
        ? { url: config.redis.url }
        : { host: config.redis.host, port: config.redis.port },
      defaultJobOptions: {
        attempts: config.job.maxAttempts,
        backoff: {
          type: "exponential",
          delay: 2000, // 2s, 4s, 8s
        },
        removeOnComplete: { count: 100 },  // Keep last 100 completed
        removeOnFail: { count: 500 },      // Keep last 500 failed
      },
    });

    queueInstance.on("error", (err) => {
      logger.error("Queue error", err);
    });
  }

  return queueInstance;
}

// Enqueue an analysis job
export async function enqueueAnalysisJob(data: AnalysisJobData): Promise<void> {
  const queue = getAnalysisQueue();

  await queue.add("analyze", data, {
    jobId: data.jobId,  // Use DB ID as BullMQ job ID for deduplication
  });

  logger.info("Job enqueued", { jobId: data.jobId, documentId: data.documentId, versionId: data.versionId });
}

// Close the queue (for graceful shutdown)
export async function closeAnalysisQueue(): Promise<void> {
  if (queueInstance) {
    await queueInstance.close();
    queueInstance = null;
  }
}
