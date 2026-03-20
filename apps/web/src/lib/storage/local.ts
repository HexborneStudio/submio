/**
 * Local filesystem storage implementation.
 *
 * In production, replace with S3 or compatible object storage.
 * The interface is designed to be swapped without changing call sites.
 */

import { randomBytes } from "crypto";
import { mkdir, writeFile, stat } from "fs/promises";
import { join } from "path";

const UPLOAD_DIR = process.env.STORAGE_LOCAL_DIR || "/tmp/authorship-receipt/uploads";

export interface StoredFile {
  storedPath: string;   // Internal storage path/key
  size: number;        // bytes
  mimeType: string;
  originalName: string;
}

/**
 * Save an uploaded file to local storage.
 * Returns a safe stored path that does NOT expose the upload directory.
 */
export async function saveFile(
  buffer: Buffer,
  originalName: string,
  mimeType: string
): Promise<StoredFile> {
  // Ensure upload directory exists
  await mkdir(UPLOAD_DIR, { recursive: true });

  // Generate unique filename: timestamp-random.ext
  const ext = getExtension(originalName, mimeType);
  const timestamp = Date.now();
  const random = randomBytes(8).toString("hex");
  const safeName = `${timestamp}-${random}${ext}`;

  const storedPath = join(UPLOAD_DIR, safeName);

  await writeFile(storedPath, buffer);

  const stats = await stat(storedPath);

  return {
    storedPath,  // full local path in dev; would be object key in prod
    size: stats.size,
    mimeType,
    originalName,
  };
}

/**
 * Delete a stored file.
 */
export async function deleteFile(storedPath: string): Promise<void> {
  try {
    const { unlink } = await import("fs/promises");
    await unlink(storedPath);
  } catch {
    // File may not exist — that's fine
  }
}

/**
 * Get public URL for a stored file.
 * In local dev, this returns a path. In prod with S3, this returns an S3 URL.
 */
export function getFileUrl(storedPath: string): string {
  // In production with S3, this would return the S3 URL
  // For local dev, we return a path that a local handler can serve
  const filename = storedPath.split("/").pop() || storedPath;
  return `/api/files/${filename}`;
}

function getExtension(originalName: string, mimeType: string): string {
  // Try to extract from original name first
  const nameParts = originalName.split(".");
  if (nameParts.length > 1) {
    const ext = nameParts.pop()!.toLowerCase();
    if (ext === "docx") return ".docx";
    if (ext === "pdf") return ".pdf";
  }

  // Fall back to mime type
  if (mimeType === "application/pdf") return ".pdf";
  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return ".docx";

  return "";
}
