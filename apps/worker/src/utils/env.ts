/**
 * Environment variable helpers for the worker.
 */

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config = {
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    url: process.env.REDIS_URL,
  },
  queue: {
    name: process.env.ANALYSIS_QUEUE_NAME || "authorship-analysis",
    concurrency: parseInt(process.env.WORKER_CONCURRENCY || "3", 10),
  },
  job: {
    maxAttempts: parseInt(process.env.JOB_MAX_ATTEMPTS || "3", 10),
  },
  app: {
    port: parseInt(process.env.WORKER_PORT || "3001", 10),
    env: process.env.NODE_ENV || "development",
  },
};
