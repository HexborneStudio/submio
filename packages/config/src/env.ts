/**
 * Environment validation — fails fast on startup if required vars are missing.
 */

import { z } from "zod";

const envSchema = z.object({
  // Required in all environments
  DATABASE_URL: z.string().url().or(z.string().min(1)),
  AUTH_SECRET: z.string().min(32),

  // Redis — either full URL or host+port
  REDIS_URL: z.string().optional(),
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.string().optional(),

  // Admin
  ADMIN_SECRET: z.string().min(8),

  // Storage
  STORAGE_LOCAL_DIR: z.string().optional().default("./storage"),

  // Worker
  WORKER_URL: z.string().optional().default("http://localhost:3001"),

  // App
  NODE_ENV: z.enum(["development", "test", "production"]).optional().default("development"),

  // Analytics
  NEXT_PUBLIC_ANALYTICS_ENABLED: z.string().optional().default("false"),
});

export function validateEnv(): void {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.issues.map(
      (i) => `  - ${i.path.join(".")}: ${i.message}`
    );
    console.error("❌ Environment validation failed:\n" + errors.join("\n"));
    console.error("\nFix these issues before starting the application.");
    process.exit(1);
  }
}

export type Env = z.infer<typeof envSchema>;
