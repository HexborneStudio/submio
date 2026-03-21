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
  return {
    key: "overview",
    title: "Document Overview",
    summary: summary.summaryText,
    items: [
      { label: "Processing Status", value: analysis.status },
      { label: "Text Extracted", value: summary.textExtracted ? "Yes" : "No" },
      { label: "Word Count", value: analysis.signals.text.wordCount },
      { label: "Ingestion Method", value: analysis.signals.ingestion.type === "paste" ? "Pasted Text" : "File Upload" },
      { label: "Original File", value: analysis.signals.ingestion.fileName || "N/A" },
    ],
    warnings: [],
    notes: [
      "This receipt was generated automatically based on document analysis.",
    ],
  };
}

function buildParsingSection(signals: AnalysisResult["signals"]): ReceiptSection {
  return {
    key: "parsing",
    title: "Parsing Summary",
    summary: signals.parsing.success
      ? "Document text was extracted successfully."
      : "Document parsing completed with warnings.",
    items: [
      { label: "Parsing Success", value: signals.parsing.success ? "Yes" : "No" },
      { label: "Parser Library", value: signals.parsing.library || "N/A" },
      { label: "Pages Extracted", value: signals.parsing.pagesExtracted || "N/A" },
      { label: "Character Count", value: signals.text.characterCount },
    ],
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
      { label: "Character Count", value: signals.text.characterCount.toLocaleString() },
      { label: "Paragraphs", value: signals.text.paragraphCount.toLocaleString() },
      { label: "Sentences", value: signals.text.sentenceCount.toLocaleString() },
      { label: "Lines", value: signals.text.lineCount.toLocaleString() },
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
      { label: "Total Citations Found", value: signals.citations.totalCount },
      { label: "Unique Sources", value: signals.citations.uniqueSources },
      { label: "URLs Detected", value: signals.citations.patterns.urlCount },
      { label: "DOIs Detected", value: signals.citations.patterns.doiCount },
      { label: "Author-Year Citations", value: signals.citations.patterns.parentheticalCitations },
      { label: "Bracket Citations", value: signals.citations.patterns.bracketCitations },
      { label: "Bibliography Detected", value: signals.citations.bibliographyDetected ? "Yes" : "No" },
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
    title: "Source Reference Indicators",
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
  return {
    key: "structural",
    title: "Structural Notes",
    summary: signals.structural.hasReferences
      ? "Document appears to follow academic structure with a references section."
      : "Document structure could not be fully determined.",
    items: [
      { label: "Bibliography/References", value: signals.structural.hasBibliography ? "Detected" : "Not Detected" },
      { label: "Footnotes", value: signals.structural.hasFootnotes ? "Detected" : "Not Detected" },
      { label: "Section Count (Est.)", value: signals.structural.estimatedSections.length },
    ],
    warnings: signals.structural.estimatedSections.length === 0
      ? ["Document may not follow a standard academic structure."]
      : [],
    notes: signals.structural.estimatedSections.length > 0
      ? [`Detected section headers: ${signals.structural.estimatedSections.slice(0, 5).join(", ")}`]
      : [],
  };
}

function buildConfidenceSection(signals: AnalysisResult["signals"], summary: ReceiptSummary): ReceiptSection {
  const confidenceLabel = {
    low: "Low — Limited indicators available",
    medium: "Medium — Some indicators detected",
    high: "High — Multiple indicators confirmed",
  };

  return {
    key: "confidence",
    title: "Confidence & Caution",
    summary: `Analysis confidence: ${confidenceLabel[summary.overallConfidence]}.`,
    items: [
      { label: "Confidence Level", value: summary.overallConfidence.charAt(0).toUpperCase() + summary.overallConfidence.slice(1) },
      { label: "Confidence Explanation", value: confidenceLabel[summary.overallConfidence] },
    ],
    warnings: signals.indicators.warnings,
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
