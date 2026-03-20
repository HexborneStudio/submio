/**
 * Citation extraction heuristics — MVP version.
 *
 * This is heuristic-only. It detects patterns but does NOT
 * definitively identify citations or their accuracy.
 */

import type { CitationAnalysisResult, ExtractedCitation } from "../types.js";

/**
 * Extract citation patterns from normalized text.
 */
export function extractCitations(text: string): CitationAnalysisResult {
  const citations: ExtractedCitation[] = [];
  const patterns = {
    bracketCitations: 0,
    parentheticalCitations: 0,
    numericYearCitations: 0,
    urlCount: 0,
    doiCount: 0,
    footnoteMarkers: 0,
  };

  // ---- Detect URLs ----
  const urlRegex = /https?:\/\/[^\s<>"{}|\\^`[\]]+/gi;
  let match;
  while ((match = urlRegex.exec(text)) !== null) {
    patterns.urlCount++;
    citations.push({
      id: `url_${citations.length + 1}`,
      type: "web",
      raw: match[0],
      metadata: { url: match[0] },
      position: { startIndex: match.index, endIndex: match.index + match[0].length },
    });
  }

  // ---- Detect DOIs ----
  const doiRegex = /10\.\d{4,}\/[^\s<>"{}|\\^`[\]]+/gi;
  while ((match = doiRegex.exec(text)) !== null) {
    patterns.doiCount++;
    citations.push({
      id: `doi_${citations.length + 1}`,
      type: "journal",
      raw: match[0],
      metadata: { doi: match[0] },
      position: { startIndex: match.index, endIndex: match.index + match[0].length },
    });
  }

  // ---- Detect bracket citations [1], [2,3], [Smith2024] ----
  const bracketRegex = /\[([^\]]+)\]/g;
  while ((match = bracketRegex.exec(text)) !== null) {
    const content = match[1].trim();
    // Skip if it looks like a file name or code
    if (content.match(/^\d+([,\s\d]+)?$/)) {
      patterns.bracketCitations++;
    } else if (content.match(/^[A-Z][a-z]+(?:[A-Z][a-z]+)*\s*\d{4}/)) {
      // Likely author-year reference like [Smith2024] or [Smith et al. 2024]
      patterns.parentheticalCitations++;
    }
    // Could be a proper citation — add as other
    if (content.length > 0 && content.length < 200) {
      citations.push({
        id: `bracket_${citations.length + 1}`,
        type: guessCitationType(content),
        raw: match[0],
        metadata: parseBracketCitation(content),
        position: { startIndex: match.index, endIndex: match.index + match[0].length },
      });
    }
  }

  // ---- Detect parenthetical citations (Author, Year) ----
  const parentheticalRegex =
    /\(([A-Z][a-z]+(?:\s+(?:et\s+al\.?|and|&)\s+[A-Z][a-z]+)?,?\s*\d{4}[a-z]?(?:\s*[,\s]\s*(?:p\.?|pp\.?)\s*\d+(?:-\d+)?)?)\)/g;
  while ((match = parentheticalRegex.exec(text)) !== null) {
    patterns.parentheticalCitations++;
    citations.push({
      id: `paren_${citations.length + 1}`,
      type: guessCitationType(match[1]),
      raw: match[0],
      metadata: parseAuthorYearCitation(match[1]),
      position: { startIndex: match.index, endIndex: match.index + match[0].length },
    });
  }

  // ---- Detect numeric year patterns (2024), (1999) standalone ----
  const yearOnlyRegex = /\(\d{4}[a-z]?\)/g;
  while ((match = yearOnlyRegex.exec(text)) !== null) {
    patterns.numericYearCitations++;
  }

  // ---- Detect footnote markers ----
  const footnoteRegex = /\^[\d]+|^\d+\.\s|\[\d+\]/gm;
  while ((match = footnoteRegex.exec(text)) !== null) {
    patterns.footnoteMarkers++;
  }

  // ---- Detect bibliography/reference section ----
  const bibPatterns = [
    /(?:^|\n)(?:references?|bibliography|works\s*cited|sources?)\s*[\n:]/im,
    /(?:^|\n)(?:works?\s*cited|bibliography)\s*[\n]/im,
  ];
  let bibliographyDetected = false;
  let bibliographySectionText = "";

  for (const pat of bibPatterns) {
    const bibMatch = text.match(pat);
    if (bibMatch) {
      bibliographyDetected = true;
      const startIdx = bibMatch.index!;
      // Grab a chunk of text after the bibliography header
      bibliographySectionText = text.slice(startIdx, startIdx + 2000);
      break;
    }
  }

  // ---- Build indicators and warnings ----
  const indicators: string[] = [];
  const warnings: string[] = [];

  if (bibliographyDetected) {
    indicators.push("Bibliography or references section detected");
  }
  if (patterns.urlCount > 5) {
    indicators.push(`Multiple web sources detected (${patterns.urlCount} URLs)`);
  }
  if (patterns.doiCount > 0) {
    indicators.push(`Academic sources detected (${patterns.doiCount} DOIs)`);
  }
  if (patterns.bracketCitations > 0) {
    indicators.push(`Numeric bracket citations detected (${patterns.bracketCitations})`);
  }
  if (patterns.parentheticalCitations > 0) {
    indicators.push(`Author-year citations detected (${patterns.parentheticalCitations})`);
  }
  if (patterns.footnoteMarkers > 10) {
    indicators.push("High number of footnote markers — academic document likely");
  }

  if (citations.length === 0 && text.length > 500) {
    warnings.push("No citation patterns detected in a document of substantial length");
  }
  if (bibliographyDetected && citations.length < 3) {
    warnings.push(
      "Bibliography detected but few structured citations extracted — citations may use an unsupported format"
    );
  }

  return {
    citations,
    totalCount: citations.length,
    uniqueSources: new Set(citations.map((c) => c.raw.slice(0, 50))).size,
    bibliographyDetected,
    bibliographySectionText: bibliographySectionText || undefined,
    patterns,
    indicators,
    warnings,
  };
}

function guessCitationType(content: string): ExtractedCitation["type"] {
  if (content.match(/10\.\d{4,}/)) return "journal";
  if (content.match(/https?:\/\//)) return "web";
  if (content.match(/press|publisher|book/i)) return "book";
  return "other";
}

function parseBracketCitation(content: string): ExtractedCitation["metadata"] {
  const yearMatch = content.match(/\d{4}/);
  const authors = content.split(/[,\d]/)[0]?.trim() || undefined;
  return {
    year: yearMatch?.[0],
    authors: authors ? [authors] : undefined,
  };
}

function parseAuthorYearCitation(content: string): ExtractedCitation["metadata"] {
  const yearMatch = content.match(/(\d{4}[a-z]?)/);
  const authorMatch = content.match(/^([^(]+)/);
  return {
    year: yearMatch?.[1],
    authors: authorMatch?.[1]?.trim().split(/,\s*/).filter(Boolean) || undefined,
  };
}
