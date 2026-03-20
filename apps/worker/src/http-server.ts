/**
 * Simple HTTP server for worker-to-web communication.
 * Uses native Node.js http module — no Express needed.
 */

import { createServer, IncomingMessage, ServerResponse } from "http";

const router = new Map<string, (req: IncomingMessage, res: ServerResponse) => Promise<void>>();

export function jsonResponse(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

function notFound(res: ServerResponse): void {
  jsonResponse(res, 404, { error: "Not found" });
}

function parseBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try { resolve(JSON.parse(body)); }
      catch { reject(new Error("Invalid JSON")); }
    });
    req.on("error", reject);
  });
}

export function registerRoute(
  method: string,
  path: string,
  handler: (data: Record<string, unknown>, req: IncomingMessage, res: ServerResponse) => Promise<void>
): void {
  router.set(`${method}:${path}`, async (req, res) => {
    try {
      const body = method !== "GET" ? await parseBody(req) : {};
      await handler(body, req, res);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Internal error";
      jsonResponse(res, 500, { error: msg });
    }
  });
}

export function handleRoute(req: IncomingMessage, res: ServerResponse): void {
  const url = new URL(req.url || "/", "http://localhost");
  const key = `${req.method}:${url.pathname}`;
  const handler = router.get(key);

  if (!handler) {
    return notFound(res);
  }

  // CORS headers for local dev
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  handler(req, res);
}

export function startHttpServer(port: number, onReady?: () => void): void {
  const server = createServer(handleRoute);
  server.listen(port, () => {
    onReady?.();
  });
}
