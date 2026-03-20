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

export const analysisQueue = new Queue<AnalysisJobData>("analysis");
export const exportQueue = new Queue<ExportJobData>("export");
