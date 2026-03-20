/**
 * Structured logger for the worker.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  jobId?: string;
  documentId?: string;
  versionId?: string;
  [key: string]: unknown;
}

class Logger {
  private format(level: LogLevel, message: string, ctx?: LogContext): string {
    const timestamp = new Date().toISOString();
    const ctxStr = ctx ? ` ${JSON.stringify(ctx)}` : "";
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${ctxStr}`;
  }

  debug(message: string, ctx?: LogContext): void {
    if (this.isDev()) console.debug(this.format("debug", message, ctx));
  }

  info(message: string, ctx?: LogContext): void {
    console.info(this.format("info", message, ctx));
  }

  warn(message: string, ctx?: LogContext): void {
    console.warn(this.format("warn", message, ctx));
  }

  error(message: string, error?: unknown, ctx?: LogContext): void {
    const errorMsg = error instanceof Error ? error.message : String(error);
    const fullCtx = error ? { ...ctx, error: errorMsg } : ctx;
    console.error(this.format("error", message, fullCtx));
  }

  private isDev(): boolean {
    return process.env.NODE_ENV !== "production";
  }
}

export const logger = new Logger();
