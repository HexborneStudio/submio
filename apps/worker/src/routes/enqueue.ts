/**
 * Worker HTTP routes — enqueue endpoint.
 */

import { registerRoute, jsonResponse } from "../http-server.js";
import { enqueueAnalysisJob, type AnalysisJobData } from "../queues/analysisQueue.js";
import { logger } from "../utils/logger.js";

registerRoute("GET", "/health", async (_data, _req, res) => {
  jsonResponse(res, 200, { status: "ok", timestamp: new Date().toISOString() });
});

registerRoute("POST", "/enqueue", async (data, _req, res) => {
  const { jobId, documentId, versionId } = data as Partial<AnalysisJobData>;

  if (!jobId || !documentId || !versionId) {
    return jsonResponse(res, 400, { error: "Missing required fields: jobId, documentId, versionId" });
  }

  try {
    await enqueueAnalysisJob({ jobId, documentId, versionId });
    logger.info("Job enqueued via HTTP", { jobId, documentId, versionId });
    return jsonResponse(res, 202, { accepted: true, jobId });
  } catch (err) {
    logger.error("Failed to enqueue job", err);
    return jsonResponse(res, 500, { error: "Failed to enqueue job" });
  }
});
