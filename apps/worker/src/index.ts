/**
 * Authorship Receipt - Worker App
 * 
 * Background job processor for document analysis and receipt generation.
 */

import { Worker } from "bullmq";
import { analysisQueue, exportQueue } from "./queues/index.js";

// Job processors will be imported here
import "./jobs/analyzeDocumentJob.js";
import "./jobs/exportReceiptJob.js";

const PORT = parseInt(process.env.WORKER_PORT || "3001", 10);

async function startWorker() {
  console.log(`🚀 Worker starting on port ${PORT}...`);

  // Create analysis worker
  const analysisWorker = new Worker("analysis", undefined, {
    connection: {
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "6379", 10),
    },
    concurrency: 5,
  });

  analysisWorker.on("completed", (job) => {
    console.log(`✅ Job ${job.id} completed`);
  });

  analysisWorker.on("failed", (job, err) => {
    console.error(`❌ Job ${job?.id} failed:`, err.message);
  });

  // Create export worker
  const exportWorker = new Worker("export", undefined, {
    connection: {
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "6379", 10),
    },
    concurrency: 3,
  });

  exportWorker.on("completed", (job) => {
    console.log(`✅ Export job ${job.id} completed`);
  });

  exportWorker.on("failed", (job, err) => {
    console.error(`❌ Export job ${job?.id} failed:`, err.message);
  });

  console.log("✅ Workers initialized and ready");
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("🛑 Shutting down workers...");
  process.exit(0);
});

startWorker().catch(console.error);
