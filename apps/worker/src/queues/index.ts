/**
 * Queue definitions for background jobs
 */

import { Queue } from "bullmq";

export interface AnalysisJobData {
  documentId: string;
  versionId: string;
  content: string;
  fileType: "docx" | "pdf" | "text";
}

export interface ExportJobData {
  receiptId: string;
  format: "pdf";
  userId: string;
}

// Re-export the analysis queue from the dedicated module
export { getAnalysisQueue, enqueueAnalysisJob, closeAnalysisQueue, type AnalysisJobData as QueuedAnalysisJobData } from "./analysisQueue.js";

export const analysisQueue = new Queue<AnalysisJobData>("analysis");
export const exportQueue = new Queue<ExportJobData>("export");
