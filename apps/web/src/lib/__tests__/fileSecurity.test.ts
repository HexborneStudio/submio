import { describe, it, expect } from "vitest";
import { validateFile, safeFilename, isPathTraversal } from "../storage/fileSecurity";

describe("validateFile", () => {
  it("accepts valid PDF", () => {
    const result = validateFile("test.pdf", "application/pdf", 1024);
    expect(result.valid).toBe(true);
  });

  it("accepts valid DOCX", () => {
    const result = validateFile(
      "test.docx",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      2048
    );
    expect(result.valid).toBe(true);
  });

  it("accepts valid TXT", () => {
    const result = validateFile("test.txt", "text/plain", 512);
    expect(result.valid).toBe(true);
  });

  it("rejects oversized files", () => {
    const result = validateFile("test.pdf", "application/pdf", 20 * 1024 * 1024);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("too large");
  });

  it("rejects empty files", () => {
    const result = validateFile("test.pdf", "application/pdf", 0);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("empty");
  });

  it("rejects wrong MIME for extension", () => {
    const result = validateFile("test.pdf", "text/plain", 1024);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("content does not match");
  });

  it("rejects disallowed extensions", () => {
    const result = validateFile("test.exe", "application/octet-stream", 1024);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("not allowed");
  });
});

describe("safeFilename", () => {
  it("removes path components", () => {
    expect(safeFilename("/path/to/file.pdf")).toBe("file.pdf");
    expect(safeFilename("../../../etc/passwd")).toBe("....etcpasswd");
  });

  it("replaces spaces and special chars", () => {
    expect(safeFilename("my file (1).pdf")).toBe("my_file__1_.pdf");
  });
});

describe("isPathTraversal", () => {
  it("detects path traversal attempts", () => {
    expect(isPathTraversal("../etc/passwd")).toBe(true);
    expect(isPathTraversal("C:\\Windows\\System32")).toBe(true);
    expect(isPathTraversal("valid_filename.pdf")).toBe(false);
  });
});
