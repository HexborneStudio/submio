/**
 * Text normalization utilities.
 */

import type { NormalizedText } from "../types.js";

/**
 * Normalize extracted text to a consistent format.
 */
export function normalizeText(raw: string): NormalizedText {
  // Trim
  let normalized = raw.trim();

  // Replace various unicode spaces with regular space
  normalized = normalized.replace(/[\u00A0\u2000-\u200B\u202F\u205F\u3000]/g, " ");

  // Replace tabs with spaces
  normalized = normalized.replace(/\t/g, " ");

  // Collapse multiple spaces into one
  normalized = normalized.replace(/ +/g, " ");

  // Standardize line endings
  normalized = normalized.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Collapse multiple blank lines (more than 2 newlines) to 2
  normalized = normalized.replace(/\n{3,}/g, "\n\n");

  // Compute metrics
  const wordCount = countWords(normalized);
  const characterCount = normalized.length;
  const paragraphCount = countParagraphs(normalized);
  const sentenceCount = countSentences(normalized);
  const lineCount = normalized.split("\n").length;

  return {
    raw: raw.trim(),
    normalized: normalized.trim(),
    metrics: {
      wordCount,
      characterCount,
      paragraphCount,
      sentenceCount,
      lineCount,
    },
  };
}

function countWords(text: string): number {
  return text.split(/\s+/).filter((w) => w.length > 0).length;
}

function countParagraphs(text: string): number {
  return text.split(/\n\n+/).filter((p) => p.trim().length > 0).length;
}

function countSentences(text: string): number {
  // Count sentence-ending punctuation
  const matches = text.match(/[.!?]+(?:\s|$)/g);
  return matches ? matches.length : 0;
}
