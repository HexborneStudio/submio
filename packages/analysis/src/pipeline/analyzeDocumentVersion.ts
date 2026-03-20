/**
 * Main analysis pipeline — orchestrates parsing, normalization, and signal building.
 */

import { readFile } from "fs/promises";
import type { AnalysisResult, AuthorshipSignals } from "../types.js";
import { parseDocument } from "../../parsers/index.js";
import { normalizeText } from "../normalizers/normalizeText.js";
import { extractCitations } from "../citations/extractCitations.js";
import { buildAuthorshipSignals } from "../signals/buildAuthorshipSignals.js";

export interface AnalyzeDocumentInput {
  versionId: string;
  content?: string | null; // For paste
  storedPath?: string | null; // For uploads
  fileType?: "pdf" | "docx" | "text";
  originalName?: string;
}

export async function analyzeDocumentVersion(
  input: AnalyzeDocumentInput
): Promise<AnalysisResult> {
  const { versionId, content, storedPath, fileType, originalName } = input;
  const parsingWarnings: string[] = [];

  try {
    // ---- Step 1: Parse document ----
    let rawText: string;
    let parseLibrary: string | undefined;

    if (content !== undefined && content !== null) {
      // Paste flow — use text directly
      rawText = content;
      parseLibrary = "direct";
    } else if (storedPath) {
      // File upload flow — load from storage
      try {
        const buffer = await readFile(storedPath);
        const mimeType = getMimeType(storedPath);
        const type = fileType || (mimeType.includes("pdf") ? "pdf" : "docx");

        const parsed = await parseDocument(buffer, type);
        rawText = parsed.text;
        parseLibrary = parsed.library || type;

        if (parsed.warnings) {
          parsingWarnings.push(...parsed.warnings);
        }
      } catch (err) {
        return {
          documentId: "",
          versionId,
          status: "failed",
          signals: buildEmptySignals(versionId, "paste"),
          error: `Failed to read or parse file: ${err instanceof Error ? err.message : "Unknown error"}`,
        };
      }
    } else {
      return {
        documentId: "",
        versionId,
        status: "failed",
        signals: buildEmptySignals(versionId, "paste"),
        error: "No content or file path provided",
      };
    }

    if (!rawText || rawText.trim().length === 0) {
      return {
        documentId: "",
        versionId,
        status: "failed",
        signals: buildEmptySignals(versionId, content ? "paste" : "file_upload"),
        error: "No text could be extracted from the provided content",
      };
    }

    // ---- Step 2: Normalize text ----
    const normalized = normalizeText(rawText);

    // ---- Step 3: Extract citations ----
    const citationAnalysis = extractCitations(normalized.normalized);

    // ---- Step 4: Build signals ----
    const signals = buildAuthorshipSignals({
      versionId,
      ingestionType: content !== undefined && content !== null ? "paste" : "file_upload",
      fileName: originalName,
      fileType,
      normalizedText: normalized,
      citationAnalysis,
      parsingWarnings,
      parsingLibrary: parseLibrary,
    });

    return {
      documentId: "",
      versionId,
      status: "success",
      signals,
      rawTextLength: rawText.length,
    };
  } catch (err) {
    return {
      documentId: "",
      versionId,
      status: "failed",
      signals: buildEmptySignals(versionId, content ? "paste" : "file_upload"),
      error: `Analysis failed: ${err instanceof Error ? err.message : "Unknown error"}`,
    };
  }
}

function getMimeType(path: string): string {
  if (path.endsWith(".pdf")) return "application/pdf";
  if (path.endsWith(".docx"))
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  return "application/octet-stream";
}

function buildEmptySignals(versionId: string, type: "paste" | "file_upload"): AuthorshipSignals {
  return {
    ingestion: { type },
    text: { wordCount: 0, characterCount: 0, paragraphCount: 0, sentenceCount: 0, lineCount: 0 },
    parsing: { success: false, warnings: ["No content available"], notes: [] },
    citations: {
      citations: [],
      totalCount: 0,
      uniqueSources: 0,
      bibliographyDetected: false,
      patterns: {
        bracketCitations: 0,
        parentheticalCitations: 0,
        numericYearCitations: 0,
        urlCount: 0,
        doiCount: 0,
        footnoteMarkers: 0,
      },
      indicators: [],
      warnings: ["Analysis could not be completed"],
    },
    sources: { count: 0, directQuotes: 0, paraphrases: 0, webSources: 0 },
    structural: {
      hasBibliography: false,
      hasFootnotes: false,
      hasReferences: false,
      estimatedSections: [],
    },
    indicators: {
      confidence: "low",
      level: [],
      warnings: ["Analysis was empty or failed"],
      notes: [],
    },
    processing: {
      completedAt: new Date().toISOString(),
      version: "1.0",
      warnings: ["Signals could not be generated"],
    },
  };
}
