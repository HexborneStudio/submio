/**
 * Build individual receipt sections from analysis output.
 */

import type { AnalysisResult } from "../types.js";
import type { ReceiptSummary } from "./buildReceiptSummary.js";

export interface ReceiptSection {
  key: string;
  title: string;
  summary: string;
  items: Array<{
    label: string;
    value: string | number | boolean;
  }>;
  warnings: string[];
  notes: string[];
}

export function buildReceiptSections(
  analysis: AnalysisResult | null,
  summary: ReceiptSummary
): ReceiptSection[] {
  if (!analysis || analysis.status === "failed") {
    return [
      {
        key: "error",
        title: "Processing Error",
        summary: "Analysis could not be completed.",
        items: [],
        warnings: analysis?.error ? [analysis.error] : ["No analysis result"],
        notes: ["Please re-upload the document or contact support."],
      },
    ];
  }

  const signals = analysis.signals;

  return [
    buildOverviewSection(analysis, summary),
    buildParsingSection(signals),
    buildTextMetricsSection(signals),
    buildCitationsSection(signals),
    buildSourcesSection(signals),
    buildStructuralSection(signals),
    buildConfidenceSection(signals, summary),
  ];
}

function buildOverviewSection(analysis: AnalysisResult, summary: ReceiptSummary): ReceiptSection {
  const items = [
    { label: "Check Status", value: analysis.status === "success" ? "Complete" : analysis.status },
    { label: "Content Type", value: analysis.signals.ingestion.type === "paste" ? "Pasted Text" : "File Upload" },
  ];

  if (analysis.signals.ingestion.type === "file_upload" && analysis.signals.ingestion.fileName) {
    items.push({ label: "Original File", value: analysis.signals.ingestion.fileName });
  }

  return {
    key: "overview",
    title: "Document Overview",
    summary: summary.summaryText,
    items,
    warnings: [],
    notes: [],
  };
}

function buildParsingSection(signals: AnalysisResult["signals"]): ReceiptSection {
  const items: Array<{ label: string; value: string | number | boolean }> = [
    { label: "Extraction Status", value: signals.parsing.success ? "Success" : "Issues detected" },
  ];

  // Only show file-specific fields when a file was uploaded
  if (signals.ingestion.type === "file_upload" && signals.parsing.pagesExtracted) {
    items.splice(1, 0, { label: "Pages", value: signals.parsing.pagesExtracted });
  }

  return {
    key: "parsing",
    title: "Parsing Summary",
    summary: signals.parsing.success
      ? "Document text was extracted successfully."
      : "Document parsing completed with warnings.",
    items,
    warnings: signals.parsing.warnings,
    notes: signals.parsing.notes,
  };
}

function buildTextMetricsSection(signals: AnalysisResult["signals"]): ReceiptSection {
  return {
    key: "text-metrics",
    title: "Text Metrics",
    summary: `${signals.text.wordCount.toLocaleString()} words extracted from the document.`,
    items: [
      { label: "Word Count", value: signals.text.wordCount.toLocaleString() },
      { label: "Sentences", value: signals.text.sentenceCount.toLocaleString() },
    ],
    warnings: [],
    notes: [],
  };
}

function buildCitationsSection(signals: AnalysisResult["signals"]): ReceiptSection {
  const hasCitations = signals.citations.totalCount > 0;

  return {
    key: "citations",
    title: "Citation & Source Indicators",
    summary: hasCitations
      ? `${signals.citations.totalCount} citation indicator(s) detected.`
      : "No citation indicators detected in this document.",
    items: [
      { label: "Citations Found", value: signals.citations.totalCount },
      { label: "Bibliography", value: signals.citations.bibliographyDetected ? "Yes" : "No" },
      { label: "Web Links", value: signals.citations.patterns.urlCount },
    ],
    warnings: signals.citations.warnings,
    notes: [
      "Citation indicators are pattern-based detections only.",
      "This is NOT a guarantee of proper citation or source accuracy.",
      "Detected patterns should be reviewed in context by an educator.",
    ],
  };
}

function buildSourcesSection(signals: AnalysisResult["signals"]): ReceiptSection {
  return {
    key: "sources",
    title: "Source Patterns",
    summary: `${signals.sources.count} source reference(s) identified from citation patterns.`,
    items: [
      { label: "Unique Sources", value: signals.sources.count },
      { label: "Direct Quotes (est.)", value: signals.sources.directQuotes },
      { label: "Web Sources", value: signals.sources.webSources },
      { label: "Estimated Paraphrases", value: signals.sources.paraphrases },
    ],
    warnings: [],
    notes: [
      "Source counts are estimates based on detected citation patterns.",
      "Some citations may represent the same source referenced differently.",
    ],
  };
}

function buildStructuralSection(signals: AnalysisResult["signals"]): ReceiptSection {
  const items = [
    { label: "References Section", value: signals.structural.hasReferences ? "Yes" : "No" },
    { label: "Footnotes", value: signals.structural.hasFootnotes ? "Yes" : "No" },
  ];

  const warnings = signals.structural.estimatedSections.length === 0
    ? ["Document may not follow a standard academic structure."]
    : [];

  return {
    key: "structural",
    title: "Structural Notes",
    summary: signals.structural.hasReferences
      ? "Document appears to follow academic structure with a references section."
      : "Document structure could not be fully determined.",
    items,
    warnings,
    notes: [],
  };
}

function buildConfidenceSection(signals: AnalysisResult["signals"], summary: ReceiptSummary): ReceiptSection {
  const confidenceLabel = {
    low: "Low — Limited indicators available",
    medium: "Medium — Some indicators detected",
    high: "High — Multiple indicators confirmed",
  };

  const warnings: string[] = [];
  if (signals.text.wordCount < 100) {
    warnings.push("Document is very short; authorship signals may be unreliable");
  }

  return {
    key: "confidence",
    title: "Confidence & Caution",
    summary: `Analysis confidence: ${confidenceLabel[summary.overallConfidence]}.`,
    items: [
      { label: "Confidence Level", value: summary.overallConfidence.charAt(0).toUpperCase() + summary.overallConfidence.slice(1) },
      { label: "Confidence Explanation", value: confidenceLabel[summary.overallConfidence] },
    ],
    warnings,
    notes: [
      "⚠️ This receipt provides EVIDENCE-BASED INDICATORS only.",
      "⚠️ It does NOT constitute a definitive judgment on authorship.",
      "⚠️ All findings should be reviewed in appropriate academic context.",
      "⚠️ Citation detection is pattern-based and may produce false positives or miss citations.",
    ],
  };
}

function buildProcessingSection(signals: AnalysisResult["signals"], analysis: AnalysisResult): ReceiptSection {
  return {
    key: "processing",
    title: "Processing Metadata",
    summary: "Technical details about how this receipt was generated.",
    items: [
      { label: "Analysis Version", value: signals.processing.version },
      { label: "Processed At", value: new Date(signals.processing.completedAt).toLocaleString() },
      { label: "Version ID", value: analysis.versionId },
    ],
    warnings: [],
    notes: [
      `Raw text length: ${analysis.rawTextLength?.toLocaleString() || 0} characters.`,
    ],
  };
}
