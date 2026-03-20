/**
 * Document Parsers
 */

export * from "./documentParser.js";
export * from "./textParser.js";
export * from "./docxParser.js";
export * from "./pdfParser.js";

import { TextParser } from "./textParser.js";
import { DocxParser } from "./docxParser.js";
import { PdfParser } from "./pdfParser.js";
import type { FileType, ParsedContent } from "@authorship-receipt/shared";

const parsers = [new TextParser(), new DocxParser(), new PdfParser()];

export async function parseDocument(
  content: Buffer | string,
  fileType: FileType
): Promise<ParsedContent> {
  const parser = parsers.find((p) => p.supports(fileType));
  
  if (!parser) {
    throw new Error(`No parser found for file type: ${fileType}`);
  }
  
  return parser.parse(content);
}
