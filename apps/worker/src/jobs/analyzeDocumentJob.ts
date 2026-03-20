/**
 * Analysis job processor — Phase 7: Analysis + Receipt Generation.
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
import { persistReceipt } from "../services/receiptService.js";
import { analyzeDocumentVersion, assembleReceipt } from "@authorship-receipt/analysis";

export async function processAnalyzeDocumentJob(
  job: Job<AnalysisJobData>
): Promise<void> {
  const { jobId, documentId, versionId } = job.data;

  logger.info("Starting analysis + receipt job", { jobId, documentId, versionId });

  let jobRecord: { maxAttempts: number } | null = null;

  try {
    // Mark job as started
    await markJobStarted(jobId);
    await updateDocumentStatus(documentId, "PROCESSING");

    // Load job + version data
    const jobData = await getJobForProcessing(jobId);
    if (!jobData) {
      throw new Error(`AnalysisJob ${jobId} not found in database`);
    }
    jobRecord = jobData as { maxAttempts: number };

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

    // ---- PHASE 6: Run analysis ----
    const analysisResult = await analyzeDocumentVersion({
      versionId: version.id,
      content: version.content || undefined,
      storedPath: storedPath || undefined,
      fileType,
      originalName,
    });

    // Progress: 70%
    await updateJobProgress(jobId, 70);
    await job.updateProgress(70);

    if (analysisResult.status === "failed") {
      throw new Error(analysisResult.error || "Analysis returned failed status");
    }

    // ---- PHASE 7: Assemble receipt ----
    const receipt = assembleReceipt(documentId, version.id, analysisResult);

    // Progress: 85%
    await updateJobProgress(jobId, 85);
    await job.updateProgress(85);

    // ---- Persist receipt ----
    const receiptId = await persistReceipt(documentId, version.id, receipt);

    logger.info("Receipt persisted", { jobId, receiptId });

    // Progress: 95%
    await updateJobProgress(jobId, 95);
    await job.updateProgress(95);

    // Mark complete
    await markJobCompleted(jobId, { analysis: analysisResult, receiptId });
    await updateDocumentStatus(documentId, "READY");

    logger.info("Job completed with receipt", { jobId, documentId, versionId, receiptId });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const attempts = await incrementJobAttempts(jobId);

    logger.error("Job failed", error, { jobId, documentId, versionId, attempts });

    if (attempts >= (jobRecord?.maxAttempts || 3)) {
      await markJobFailed(jobId, errorMessage);
      await updateDocumentStatus(documentId, "FAILED");
    }

    throw error; // Re-throw for BullMQ retry
  }
}
