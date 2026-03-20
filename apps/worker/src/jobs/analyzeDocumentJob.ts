/**
 * Analysis job processor — the main workhorse for document analysis.
 *
 * This is a PLACEHOLDER implementation for Phase 5.
 * Phase 6 will replace the placeholderProcessing call with real parsing + analysis.
 */

import { Job } from "bullmq";
import { AnalysisJobData } from "../queues/analysisQueue.js";
import { logger } from "../utils/logger.js";
import {
  markJobStarted,
  markJobCompleted,
  markJobFailed,
  incrementJobAttempts,
  updateJobProgress,
  updateDocumentStatus,
  getJobForProcessing,
} from "../services/jobLifecycleService.js";

export async function processAnalyzeDocumentJob(
  job: Job<AnalysisJobData>
): Promise<void> {
  const { jobId, documentId, versionId } = job.data;

  logger.info("Starting analysis job", { jobId, documentId, versionId });

  // Load job record for retry limit access in catch block
  let jobRecord: { maxAttempts: number } | null = null;

  try {
    // Mark job as started
    await markJobStarted(jobId);
    await updateDocumentStatus(documentId, "PROCESSING");

    // Load job + version data from DB
    jobRecord = await getJobForProcessing(jobId);

    if (!jobRecord) {
      throw new Error(`AnalysisJob ${jobId} not found in database`);
    }

    const version = jobRecord.version;

    logger.info("Job loaded", {
      jobId,
      documentId,
      versionId,
      hasContent: !!version.content,
      hasUpload: version.uploads.length > 0,
      fileType: version.fileType,
    });

    // ============================================================
    // PLACEHOLDER PROCESSING — Phase 6 will replace this
    // ============================================================

    const analysisResult = await placeholderProcessing(job, jobId, version);

    // ============================================================
    // END PLACEHOLDER
    // ============================================================

    // Mark complete
    await markJobCompleted(jobId, analysisResult);
    await updateDocumentStatus(documentId, "READY");

    logger.info("Job completed", { jobId, documentId, versionId });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const attempts = await incrementJobAttempts(jobId);

    logger.error("Job failed", error, { jobId, documentId, versionId, attempts });

    // If we've exhausted retries, mark as permanently failed
    if (attempts >= (jobRecord?.maxAttempts || 3)) {
      await markJobFailed(jobId, errorMessage);
      await updateDocumentStatus(documentId, "FAILED");
    }

    // Re-throw so BullMQ can handle retry
    throw error;
  }
}

// Placeholder processing — simulates work with realistic progress updates
async function placeholderProcessing(
  job: Job<AnalysisJobData>,
  jobId: string,
  version: NonNullable<Awaited<ReturnType<typeof getJobForProcessing>>>["version"]
): Promise<Record<string, unknown>> {
  const { documentId, versionId } = job.data;

  // Step 1: Loading (20%)
  await updateJobProgress(jobId, 20);
  await job.updateProgress(20);
  logger.debug("Step 1/4: Loading document", { jobId });
  await sleep(300);

  // Step 2: Parsing (40%)
  await updateJobProgress(jobId, 40);
  await job.updateProgress(40);
  logger.debug("Step 2/4: Parsing content", { jobId });

  // Detect what we have
  const hasText = !!version.content;
  const hasUpload = version.uploads.length > 0;

  if (hasText) {
    logger.debug("Processing pasted text", { jobId, charCount: version.content.length });
  } else if (hasUpload) {
    const upload = version.uploads[0];
    logger.debug("Processing uploaded file", { jobId, file: upload.originalName, type: upload.mimeType });
  } else {
    logger.warn("Version has neither content nor upload", { jobId, versionId });
  }

  await sleep(500);

  // Step 3: Analyzing (70%)
  await updateJobProgress(jobId, 70);
  await job.updateProgress(70);
  logger.debug("Step 3/4: Analyzing writing process", { jobId });
  await sleep(300);

  // Step 4: Assembling (90%)
  await updateJobProgress(jobId, 90);
  await job.updateProgress(90);
  logger.debug("Step 4/4: Assembling receipt data", { jobId });
  await sleep(200);

  // Return placeholder result — Phase 6 will replace this with real analysis
  return {
    documentId,
    versionId,
    status: "placeholder",
    placeholder: true,
    note: "Real analysis will be implemented in Phase 6",
    parsedAt: new Date().toISOString(),
    contentLength: version.content?.length || 0,
    hasFile: version.uploads.length > 0,
    fileName: version.uploads[0]?.originalName || null,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
