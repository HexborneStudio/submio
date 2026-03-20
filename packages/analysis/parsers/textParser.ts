/**
 * Plain Text Parser
 */

import { BaseParser, type ParsedContent } from "./documentParser.js";
import type { FileType } from "@authorship-receipt/shared";

export class TextParser extends BaseParser {
  supports(fileType: FileType): boolean {
    return fileType === "text";
  }

  async parse(content: Buffer | string): Promise<ParsedContent> {
    const text = typeof content === "string" ? content : content.toString("utf-8");

    return {
      text,
      metadata: {
        wordCount: this.countWords(text),
        characterCount: text.length,
        paragraphCount: this.countParagraphs(text),
        lineCount: this.countLines(text),
        fileType: "text",
      },
    };
  }
}
