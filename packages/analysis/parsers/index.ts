/**
 * Document Parsers — unified interface.
 */

export * from "./documentParser.js";
export * from "./textParser.js";
export * from "./docxParser.js";
export * from "./pdfParser.js";

import { TextParser } from "./textParser.js";
import { DocxParser } from "./docxParser.js";
import { PdfParser } from "./pdfParser.js";
import type { FileType } from "@authorship-receipt/shared";
import type { ParsedDocument } from "./documentParser.js";

export interface ParseResult extends ParsedDocument {
  library?: string;
  warnings?: string[];
}

const parsers = [new TextParser(), new DocxParser(), new PdfParser()];

export async function parseDocument(
  content: Buffer | string,
  fileType: FileType
): Promise<ParseResult> {
  const parser = parsers.find((p) => p.supports(fileType));

  if (!parser) {
    throw new Error(`No parser found for file type: ${fileType}`);
  }

  return parser.parse(content) as Promise<ParseResult>;
}
