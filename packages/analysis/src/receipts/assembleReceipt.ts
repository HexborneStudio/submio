/**
 * Main receipt assembly — combines analysis result into a full receipt.
 */

import type { AnalysisResult } from "../types.js";
import type { ReceiptSummary } from "./buildReceiptSummary.js";
import type { ReceiptSection } from "./buildReceiptSections.js";
import { buildReceiptSummary } from "./buildReceiptSummary.js";
import { buildReceiptSections } from "./buildReceiptSections.js";

export interface AssembledReceipt {
  documentId: string;
  versionId: string;
  status: "success" | "partial" | "failed";
  generatedAt: string;
  summary: ReceiptSummary;
  sections: ReceiptSection[];
  disclaimer: string;
}

export function assembleReceipt(
  documentId: string,
  versionId: string,
  analysis: AnalysisResult | null
): AssembledReceipt {
  const summary = buildReceiptSummary(analysis);
  const sections = buildReceiptSections(analysis, summary);

  return {
    documentId,
    versionId,
    status: analysis?.status || "failed",
    generatedAt: new Date().toISOString(),
    summary,
    sections,
    disclaimer:
      "This authorship receipt provides evidence-based indicators of the document creation process. " +
      "It does not constitute a definitive judgment on authorship, originality, or academic integrity. " +
      "All findings should be reviewed in the appropriate academic context. " +
      "Citation and source detections are pattern-based and may include false positives or misses. " +
      "This tool is designed to support transparency and honest academic practices.",
  };
}
