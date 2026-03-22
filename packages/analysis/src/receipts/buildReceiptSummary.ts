/**
 * Build the top-level receipt summary.
 */

import type { AnalysisResult } from "../types.js";

export interface ReceiptSummary {
  status: "success" | "partial" | "failed";
  documentProcessed: boolean;
  textExtracted: boolean;
  citationsDetected: boolean;
  bibliographyFound: boolean;
  overallConfidence: "low" | "medium" | "high";
  summaryText: string;
  processingWarnings: string[];
}

export function buildReceiptSummary(analysis: AnalysisResult | null): ReceiptSummary {
  if (!analysis || analysis.status === "failed") {
    return {
      status: "failed",
      documentProcessed: false,
      textExtracted: false,
      citationsDetected: false,
      bibliographyFound: false,
      overallConfidence: "low",
      summaryText: "Analysis could not be completed. Receipt cannot be generated.",
      processingWarnings: analysis?.error ? [analysis.error] : ["No analysis result available"],
    };
  }

  const signals = analysis.signals;
  const hasCitations = signals.citations.totalCount > 0;
  const hasBibliography = signals.citations.bibliographyDetected;
  const hasWarnings = signals.processing.warnings.length > 0 || signals.parsing.warnings.length > 0;

  let summaryText = "Document processed successfully.";

  if (hasCitations) {
    summaryText += ` ${signals.citations.totalCount} citation indicator(s) detected.`;
  } else {
    summaryText += " No citation indicators detected.";
  }

  if (hasBibliography) {
    summaryText += " A bibliography or references section was identified.";
  }

  if (hasWarnings) {
    summaryText += " Some warnings were generated during processing — see details below.";
  }

  return {
    status: analysis.status,
    documentProcessed: true,
    textExtracted: signals.text.wordCount > 0,
    citationsDetected: hasCitations,
    bibliographyFound: hasBibliography,
    overallConfidence: signals.indicators.confidence,
    summaryText,
    // Filter out citation-specific warnings that appear in their own sections
    // Don't duplicate — citation warnings shown in Citation section, "very short" in Confidence
    processingWarnings: signals.processing.warnings.filter(
      (w) =>
        !signals.indicators.warnings.includes(w) &&
        !w.toLowerCase().includes("citation") &&
        !w.toLowerCase().includes("very short")
    ),
  };
}
