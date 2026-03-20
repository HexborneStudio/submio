/**
 * DOCX Parser — uses mammoth.
 */

import { BaseParser, type ParsedDocument } from "./documentParser.js";
import type { FileType } from "@authorship-receipt/shared";
import mammoth from "mammoth";

export class DocxParser extends BaseParser {
  supports(fileType: FileType): boolean {
    return fileType === "docx";
  }

  async parse(
    content: Buffer | string
  ): Promise<ParsedDocument & { library: string; warnings: string[] }> {
    const warnings: string[] = [];

    try {
      const buffer = typeof content === "string" ? Buffer.from(content) : content;
      const result = await mammoth.extractRawText({ buffer });

      const text = result.value || "";

      if (result.messages && result.messages.length > 0) {
        for (const msg of result.messages) {
          if (msg.type === "error") {
            warnings.push(`Parse warning: ${msg.message}`);
          }
        }
      }

      if (!text || text.trim().length === 0) {
        warnings.push("DOCX parsed but extracted text is empty");
      }

      return {
        text,
        metadata: {
          wordCount: this.countWords(text),
          characterCount: text.length,
          paragraphCount: this.countParagraphs(text),
          lineCount: this.countLines(text),
          fileType: "docx",
        },
        library: "mammoth",
        warnings,
      };
    } catch (err) {
      throw new Error(`DOCX parsing failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  }
}
