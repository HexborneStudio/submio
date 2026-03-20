/**
 * Shared Constants
 */

export const APP_NAME = "Authorship Receipt";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// File upload limits
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [".docx", ".pdf"];

// Receipt limits
export const RECEIPT_SHARE_LINK_EXPIRY_DAYS = 30;
export const RECEIPT_EXPORT_EXPIRY_DAYS = 7;

// Plan limits
export const FREE_PLAN_LIMITS = {
  documentsPerMonth: 3,
  pdfExports: 3,
  shareLinks: 3,
};

export const PRO_PLAN_LIMITS = {
  documentsPerMonth: -1, // unlimited
  pdfExports: -1,
  shareLinks: -1,
};

// Analysis
export const ANALYSIS_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

// Queue names
export const QUEUE_NAMES = {
  ANALYSIS: "analysis",
  EXPORT: "export",
} as const;

// Receipt sections
export const RECEIPT_SECTIONS = [
  "overview",
  "timeline",
  "authorship",
  "citations",
  "sources",
  "originality",
  "studentDisclosure",
  "educatorReview",
  "verification",
] as const;

export type ReceiptSectionType = (typeof RECEIPT_SECTIONS)[number];
