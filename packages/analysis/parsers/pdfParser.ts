/**
 * PDF Parser — uses pdf-parse.
 */

import { BaseParser, type ParsedDocument } from "./documentParser.js";
import type { FileType } from "@authorship-receipt/shared";
import pdfParse from "pdf-parse";

export class PdfParser extends BaseParser {
  supports(fileType: FileType): boolean {
    return fileType === "pdf";
  }

  async parse(
    content: Buffer | string
  ): Promise<ParsedDocument & { library: string; warnings: string[] }> {
    const warnings: string[] = [];

    try {
      const buffer = typeof content === "string" ? Buffer.from(content) : content;
      const data = await pdfParse(buffer);

      const text = data.text || "";

      if (!text || text.trim().length === 0) {
        warnings.push("PDF parsed but extracted text appears empty — may be a scanned/image-only PDF");
      }

      if (data.numpages && data.numpages > 1) {
        warnings.push(`Multi-page PDF: ${data.numpages} pages`);
      }

      return {
        text: text.replace(/\x00/g, ""), // Remove null bytes
        metadata: {
          wordCount: this.countWords(text),
          characterCount: text.length,
          paragraphCount: this.countParagraphs(text),
          lineCount: this.countLines(text),
          pageCount: data.numpages,
          fileType: "pdf",
        },
        library: "pdf-parse",
        warnings,
      };
    } catch (err) {
      throw new Error(`PDF parsing failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  }
}
