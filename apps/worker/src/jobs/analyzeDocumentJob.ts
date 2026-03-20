/**
 * Analysis job processor — Phase 6: Real parsing + analysis.
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
import { analyzeDocumentVersion } from "@authorship-receipt/analysis";

export async function processAnalyzeDocumentJob(
  job: Job<AnalysisJobData>
): Promise<void> {
  const { jobId, documentId, versionId } = job.data;

  logger.info("Starting analysis job", { jobId, documentId, versionId });

  let jobRecord: { maxAttempts: number } | null = null;

  try {
    // Mark job as started
    await markJobStarted(jobId);
    await updateDocumentStatus(documentId, "PROCESSING");

    // Load job + version data from DB
    jobRecord = (await getJobForProcessing(jobId)) as { maxAttempts: number } | null;
    const jobData = await getJobForProcessing(jobId);

    if (!jobData) {
      throw new Error(`AnalysisJob ${jobId} not found in database`);
    }

    const version = jobData.version;

    logger.info("Job loaded", {
      jobId,
      documentId,
      versionId,
      hasContent: !!version.content,
      hasUpload: version.uploads.length > 0,
      fileType: version.fileType,
    });

    // Progress: 10%
    await updateJobProgress(jobId, 10);
    await job.updateProgress(10);

    // Determine ingestion type
    const hasText = !!version.content;
    const hasUpload = version.uploads.length > 0;

    let storedPath: string | null = null;
    let fileType: "pdf" | "docx" | "text" | undefined;
    let originalName: string | undefined;

    if (!hasText && hasUpload) {
      const upload = version.uploads[0];
      storedPath = upload.storedPath;
      originalName = upload.originalName;
      if (upload.mimeType.includes("pdf")) {
        fileType = "pdf";
      } else if (upload.mimeType.includes("wordprocessing")) {
        fileType = "docx";
      }
    }

    // Progress: 20%
    await updateJobProgress(jobId, 20);
    await job.updateProgress(20);

    // Run the real analysis pipeline
    const result = await analyzeDocumentVersion({
      versionId: version.id,
      content: version.content || undefined,
      storedPath: storedPath || undefined,
      fileType,
      originalName,
    });

    // Progress: 90%
    await updateJobProgress(jobId, 90);
    await job.updateProgress(90);

    if (result.status === "failed") {
      throw new Error(result.error || "Analysis returned failed status");
    }

    // Mark complete
    await markJobCompleted(jobId, result);
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
