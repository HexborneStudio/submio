/**
 * Shared types for the analysis package.
 */

// Renamed to avoid conflict with parsers/documentParser.ts
export interface AnalyzedDocument {
  text: string;
  metadata: {
    wordCount: number;
    characterCount: number;
    paragraphCount: number;
    pageCount?: number;
    fileType: "pdf" | "docx" | "text";
    originalName?: string;
  };
}

export interface NormalizedText {
  raw: string;
  normalized: string;
  metrics: {
    wordCount: number;
    characterCount: number;
    paragraphCount: number;
    sentenceCount: number;
    lineCount: number;
  };
}

export interface ExtractedCitation {
  id: string;
  type: "web" | "book" | "journal" | "other";
  raw: string;
  metadata: {
    title?: string;
    authors?: string[];
    year?: string;
    url?: string;
    doi?: string;
  };
  position: {
    startIndex: number;
    endIndex: number;
  };
}

export interface CitationAnalysisResult {
  citations: ExtractedCitation[];
  totalCount: number;
  uniqueSources: number;
  bibliographyDetected: boolean;
  bibliographySectionText?: string;
  patterns: {
    bracketCitations: number; // [1], [2,3]
    parentheticalCitations: number; // (Smith, 2024)
    numericYearCitations: number; // (2024)
    urlCount: number;
    doiCount: number;
    footnoteMarkers: number;
  };
  indicators: string[]; // e.g. "Likely has bibliography section"
  warnings: string[]; // e.g. "Could not parse citation details"
}

export interface SourceReference {
  id: string;
  citationId?: string;
  type: "direct_quote" | "paraphrase" | "citation" | "web_source";
  text: string;
  position: {
    startIndex: number;
    endIndex: number;
  };
}

export interface AuthorshipSignals {
  ingestion: {
    type: "paste" | "file_upload";
    fileName?: string;
    fileType?: string;
  };
  text: {
    wordCount: number;
    characterCount: number;
    paragraphCount: number;
    sentenceCount: number;
    lineCount: number;
  };
  parsing: {
    success: boolean;
    library?: string;
    pagesExtracted?: number;
    warnings: string[];
    notes: string[];
  };
  citations: CitationAnalysisResult;
  sources: {
    count: number;
    directQuotes: number;
    paraphrases: number;
    webSources: number;
  };
  structural: {
    hasBibliography: boolean;
    hasFootnotes: boolean;
    hasReferences: boolean;
    estimatedSections: string[];
  };
  indicators: {
    confidence: "low" | "medium" | "high";
    level: string[];
    warnings: string[];
    notes: string[];
  };
  processing: {
    completedAt: string;
    version: string;
    warnings: string[];
  };
}

export interface AnalysisResult {
  documentId: string;
  versionId: string;
  status: "success" | "partial" | "failed";
  signals: AuthorshipSignals;
  error?: string;
  rawTextLength?: number;
}
