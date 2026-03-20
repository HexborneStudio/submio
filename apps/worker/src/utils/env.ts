/**
 * Environment variable validation for the worker — fails fast on startup.
 */

import { z } from "zod";

const workerEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().optional(),
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.string().optional(),
  ADMIN_SECRET: z.string().min(8),
  STORAGE_LOCAL_DIR: z.string().optional().default("./storage"),
  WORKER_URL: z.string().optional().default("http://localhost:3001"),
  NODE_ENV: z.enum(["development", "test", "production"]).optional().default("development"),
});

export function validateEnv(): void {
  const result = workerEnvSchema.safeParse(process.env);
  if (!result.success) {
    const errors = result.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`);
    console.error("❌ Worker environment validation failed:\n" + errors.join("\n"));
    console.error("\nFix these issues before starting the worker.");
    process.exit(1);
  }
}

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

// Validate env at startup
validateEnv();

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
