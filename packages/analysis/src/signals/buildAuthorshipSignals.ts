/**
 * Build structured authorship signals from analysis components.
 */

import type { AuthorshipSignals, NormalizedText, CitationAnalysisResult } from "../types.js";

export interface BuildSignalsInput {
  versionId: string;
  ingestionType: "paste" | "file_upload";
  fileName?: string;
  fileType?: string;
  normalizedText: NormalizedText;
  citationAnalysis: CitationAnalysisResult;
  parsingWarnings: string[];
  parsingLibrary?: string;
  pagesExtracted?: number;
  bibliographySection?: string;
}

export function buildAuthorshipSignals(input: BuildSignalsInput): AuthorshipSignals {
  const {
    versionId,
    ingestionType,
    fileName,
    fileType,
    normalizedText,
    citationAnalysis,
    parsingWarnings,
    parsingLibrary,
    pagesExtracted,
    bibliographySection,
  } = input;

  // Estimate sections from text structure
  const sectionHeaders = detectSectionHeaders(normalizedText.normalized);

  // Build indicators
  const indicators: string[] = [];
  const notes: string[] = [];
  const processingWarnings: string[] = [];
  const warnings: string[] = [...parsingWarnings];

  if (ingestionType === "paste") {
    notes.push("Content was pasted directly — text content is immediately available for analysis");
  } else {
    notes.push("Content was uploaded as a file — text extracted via parsing library");
    if (parsingLibrary) {
      notes.push(`Parsed using: ${parsingLibrary}`);
    }
  }

  if (normalizedText.metrics.wordCount > 5000) {
    indicators.push("Substantial document length (>5000 words)");
  } else if (normalizedText.metrics.wordCount < 100) {
    indicators.push("Very short document — limited analysis possible");
    processingWarnings.push("Document is very short; authorship signals may be unreliable");
  }

  if (sectionHeaders.length > 3) {
    indicators.push("Document has clear structural organization (multiple sections)");
  }

  // Citation confidence
  let confidence: AuthorshipSignals["indicators"]["confidence"] = "low";
  if (citationAnalysis.totalCount > 0 && normalizedText.metrics.wordCount > 500) {
    confidence = "medium";
  }
  if (citationAnalysis.totalCount > 5 && citationAnalysis.bibliographyDetected) {
    confidence = "high";
  }

  // Direct quote count
  const directQuotes = citationAnalysis.citations.filter(
    (c) => c.type === "web" && c.metadata.url
  ).length;

  void versionId; // unused in this function but part of the input contract
  void bibliographySection;

  return {
    ingestion: {
      type: ingestionType,
      fileName,
      fileType,
    },
    text: normalizedText.metrics,
    parsing: {
      success: parsingWarnings.length === 0,
      library: parsingLibrary,
      pagesExtracted,
      warnings: parsingWarnings,
      notes:
        parsingWarnings.length > 0
          ? [`${parsingWarnings.length} parsing warning(s) noted — see warnings`]
          : [],
    },
    citations: citationAnalysis,
    sources: {
      count: citationAnalysis.uniqueSources,
      directQuotes,
      paraphrases: Math.floor(citationAnalysis.totalCount * 0.3), // rough estimate
      webSources: citationAnalysis.patterns.urlCount,
    },
    structural: {
      hasBibliography: citationAnalysis.bibliographyDetected,
      hasFootnotes: citationAnalysis.patterns.footnoteMarkers > 0,
      hasReferences: citationAnalysis.bibliographyDetected,
      estimatedSections: sectionHeaders,
    },
    indicators: {
      confidence,
      level: indicators,
      warnings,
      notes,
    },
    processing: {
      completedAt: new Date().toISOString(),
      version: "1.0",
      warnings: citationAnalysis.warnings,
    },
  };
}

function detectSectionHeaders(text: string): string[] {
  const headers: string[] = [];
  const lines = text.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    // Heuristic: section headers are usually short, don't end with punctuation, and are title-cased
    if (trimmed.length < 60 && !trimmed.match(/[.!?]$/) && trimmed.match(/^[A-Z]/)) {
      if (!headers.includes(trimmed)) {
        headers.push(trimmed);
      }
    }
  }

  return headers.slice(0, 10); // cap at 10
}
