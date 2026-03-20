/**
 * File security utilities — validates uploads and prevents path traversal.
 */

import path from "path";

// Allowed MIME types
export const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/msword", // .doc (legacy)
  "text/plain",
]);

// Allowed extensions
export const ALLOWED_EXTENSIONS = new Set([".pdf", ".docx", ".doc", ".txt"]);

// Max file size: 10MB
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFile(
  filename: string,
  mimeType: string,
  size: number
): FileValidationResult {
  // Check size
  if (size > MAX_FILE_SIZE) {
    return { valid: false, error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.` };
  }

  if (size === 0) {
    return { valid: false, error: "File is empty." };
  }

  // Check extension
  const ext = path.extname(filename).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return { valid: false, error: `File type not allowed. Allowed: ${[...ALLOWED_EXTENSIONS].join(", ")}` };
  }

  // Check MIME type matches extension
  const mimeExtMap: Record<string, string[]> = {
    ".pdf": ["application/pdf"],
    ".docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    ".doc": ["application/msword"],
    ".txt": ["text/plain"],
  };

  const expectedMimes = mimeExtMap[ext] || [];
  if (!expectedMimes.includes(mimeType)) {
    return { valid: false, error: "File content does not match extension." };
  }

  return { valid: true };
}

export function safeFilename(originalName: string): string {
  // Remove path components
  const basename = path.basename(originalName);
  // Replace dangerous chars
  return basename.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export function isPathTraversal(filename: string): boolean {
  return filename.includes("..") || path.isAbsolute(filename);
}
