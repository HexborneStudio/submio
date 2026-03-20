/**
 * Shared Types for Authorship Receipt
 */

// User types
export type UserRole = "STUDENT" | "EDUCATOR" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Document types
export type DocumentStatus = "DRAFT" | "PROCESSING" | "READY" | "FAILED";
export type UploadType = "FILE_UPLOAD" | "PASTE";

/** File type for document parsing — distinct from UploadType which is for storage. */
export type FileType = "pdf" | "docx" | "text";

export interface Document {
  id: string;
  userId: string;
  title: string;
  status: DocumentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  content: string | null;
  fileType: UploadType | null;
  createdAt: Date;
}

export interface DocumentUpload {
  id: string;
  versionId: string;
  originalName: string;
  storedPath: string;
  mimeType: string;
  size: number;
  fileType: UploadType;
  createdAt: Date;
}

// Analysis types
export type JobStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface AnalysisJob {
  id: string;
  documentId: string;
  versionId: string;
  status: JobStatus;
  progress: number;
  result: unknown | null;
  error: string | null;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Receipt types
export interface ReceiptMetadata {
  receiptId: string;
  documentId: string;
  versionId: string;
  generatedAt: string;
}

export interface AuthorshipIndicators {
  typingVsPastingRatio: number | null;
  estimatedTypingTime: string | null;
  revisionPatterns: unknown[];
  writingSessionCount: number | null;
  averageSessionDuration: string | null;
  indicatorConfidence: "low" | "medium" | "high";
  notes: string[];
}

export interface Citation {
  id: string;
  type: "web" | "book" | "journal" | "other";
  raw: string;
  metadata: {
    title?: string;
    authors?: string[];
    year?: string;
    url?: string;
  };
}

export interface CitationAnalysis {
  citations: Citation[];
  citationCount: number;
  referencedSources: string[];
  potentialIssues: string[];
}

// Share types
export type ShareLinkStatus = "ACTIVE" | "REVOKED" | "EXPIRED";

export interface SharedLink {
  id: string;
  receiptId: string;
  token: string;
  status: ShareLinkStatus;
  expiresAt: Date | null;
  createdAt: Date;
  lastAccessedAt: Date | null;
}

// Review types
export type ReviewStatus = "PENDING" | "REVIEWED" | "FLAGGED";

export interface EducatorReview {
  id: string;
  receiptId: string;
  educatorId: string | null;
  educatorEmail: string | null;
  status: ReviewStatus;
  notes: string | null;
  reviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
