/**
 * Document Parser Interface
 */

import type { FileType } from "@authorship-receipt/shared";

export interface ParsedDocument {
  text: string;
  metadata: {
    wordCount: number;
    characterCount: number;
    paragraphCount: number;
    lineCount: number;
    pageCount?: number;
    fileType: FileType;
    originalName?: string;
  };
}

export interface DocumentParser {
  /**
   * Parse a document and extract text content
   */
  parse(content: Buffer | string): Promise<ParsedDocument & { library: string; warnings: string[] }>;

  /**
   * Check if this parser supports the given file type
   */
  supports(fileType: FileType): boolean;
}

/**
 * Base class for document parsers with common functionality
 */
export abstract class BaseParser implements DocumentParser {
  abstract parse(content: Buffer | string): Promise<ParsedDocument & { library: string; warnings: string[] }>;
  abstract supports(fileType: FileType): boolean;

  protected countWords(text: string): number {
    return text.split(/\s+/).filter((word) => word.length > 0).length;
  }

  protected countParagraphs(text: string): number {
    return text.split(/\n\n+/).filter((p) => p.trim().length > 0).length;
  }

  protected countLines(text: string): number {
    return text.split(/\n/).length;
  }
}
