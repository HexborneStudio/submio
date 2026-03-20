/**
 * Typing vs Pasting Analysis Heuristics
 */

export interface TypingIndicators {
  estimatedTypingTime: string | null;
  typingPastingRatio: number | null;
  confidence: "low" | "medium" | "high";
  notes: string[];
}

/**
 * Analyzes text patterns to estimate typing vs pasting
 * 
 * Placeholder implementation - actual analysis would look at:
 * - Uniformity of character timing
 * - Pattern repetition detection
 * - Edit pattern analysis
 */
export function analyzeTypingPatterns(text: string): TypingIndicators {
  const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;
  
  // Placeholder: return null indicators
  return {
    estimatedTypingTime: null,
    typingPastingRatio: null,
    confidence: "low",
    notes: [
      "Typing analysis not yet implemented",
      "Would analyze character timing patterns if available",
    ],
  };
}

/**
 * Estimate typing time based on average typing speed
 */
export function estimateTypingTime(wordCount: number, wpm: number = 40): string {
  if (wordCount <= 0) return "0 minutes";
  
  const minutes = wordCount / wpm;
  
  if (minutes < 1) {
    return `${Math.round(minutes * 60)} seconds`;
  } else if (minutes < 60) {
    return `${Math.round(minutes)} minutes`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return `${hours} hour${hours > 1 ? "s" : ""} ${remainingMinutes} minutes`;
  }
}
