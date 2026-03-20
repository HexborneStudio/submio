/**
 * Shared Validation Schemas using Zod
 */

import { z } from "zod";

// User schemas
export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(255).optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(255).optional(),
});

// Document schemas
export const createDocumentSchema = z.object({
  title: z.string().min(1).max(500),
});

export const updateDocumentSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  status: z.enum(["DRAFT", "PROCESSING", "READY", "FAILED"]).optional(),
});

// Document version schemas
export const createVersionSchema = z.object({
  content: z.string().optional(),
  fileType: z.enum(["docx", "pdf", "text"]).optional(),
});

export const uploadFileSchema = z.object({
  documentId: z.string().cuid(),
  fileType: z.enum(["docx", "pdf"]),
});

// Share link schemas
export const createShareLinkSchema = z.object({
  receiptId: z.string().cuid(),
  expiresInDays: z.number().int().positive().optional(),
});

export const reviewReceiptSchema = z.object({
  receiptId: z.string().cuid(),
  status: z.enum(["PENDING", "REVIEWED", "FLAGGED"]),
  notes: z.string().max(5000).optional(),
});

// Pagination
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

// ID param
export const idParamSchema = z.object({
  id: z.string().cuid(),
});

// Type exports
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
export type CreateVersionInput = z.infer<typeof createVersionSchema>;
export type UploadFileInput = z.infer<typeof uploadFileSchema>;
export type CreateShareLinkInput = z.infer<typeof createShareLinkSchema>;
export type ReviewReceiptInput = z.infer<typeof reviewReceiptSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
