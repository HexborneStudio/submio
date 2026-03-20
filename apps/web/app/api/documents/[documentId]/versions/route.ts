import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { pasteContentSchema, ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from "@authorship-receipt/shared";
import { prisma } from "@authorship-receipt/db";
import { saveFile } from "@/lib/storage";

// For multipart file uploads
export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ documentId: string }> }
) {
  try {
    const user = await requireUser();
    const { documentId } = await params;

    // Verify document ownership
    const document = await prisma.document.findFirst({
      where: { id: documentId, userId: user.id },
    });

    if (!document) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      // ============ FILE UPLOAD PATH ============
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      // Validate MIME type
      if (!ALLOWED_MIME_TYPES.includes(file.type as typeof ALLOWED_MIME_TYPES[number])) {
        return NextResponse.json(
          { error: `File type not allowed. Supported: .docx, .pdf` },
          { status: 400 }
        );
      }

      // Validate size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File too large. Maximum size: 10MB` },
          { status: 400 }
        );
      }

      // Get next version number
      const lastVersion = await prisma.documentVersion.findFirst({
        where: { documentId },
        orderBy: { version: "desc" },
      });
      const nextVersion = (lastVersion?.version || 0) + 1;

      // Save file to storage
      const buffer = Buffer.from(await file.arrayBuffer());
      const stored = await saveFile(buffer, file.name, file.type);

      // Create version and upload records in a transaction
      const version = await prisma.$transaction(async (tx) => {
        const v = await tx.documentVersion.create({
          data: {
            documentId,
            version: nextVersion,
            fileType: "FILE_UPLOAD",
          },
        });

        await tx.documentUpload.create({
          data: {
            versionId: v.id,
            originalName: stored.originalName,
            storedPath: stored.storedPath,
            mimeType: stored.mimeType,
            size: stored.size,
            fileType: "FILE_UPLOAD",
          },
        });

        await tx.document.update({
          where: { id: documentId },
          data: { status: "PROCESSING" },
        });

        return v;
      });

      return NextResponse.json(
        { version, documentId, mode: "upload" },
        { status: 201 }
      );

    } else {
      // ============ PASTE TEXT PATH ============
      const body = await req.json();
      const { title, content } = pasteContentSchema.parse(body);

      // Get next version number
      const lastVersion = await prisma.documentVersion.findFirst({
        where: { documentId },
        orderBy: { version: "desc" },
      });
      const nextVersion = (lastVersion?.version || 0) + 1;

      // Create version with pasted content
      const version = await prisma.$transaction(async (tx) => {
        const v = await tx.documentVersion.create({
          data: {
            documentId,
            version: nextVersion,
            content,
            fileType: "PASTE",
          },
        });

        await tx.document.update({
          where: { id: documentId },
          data: {
            title: title || document.title,
            status: "PROCESSING",
          },
        });

        return v;
      });

      return NextResponse.json(
        { version, documentId, mode: "paste" },
        { status: 201 }
      );
    }

  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message.includes("ZodError")) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    console.error("Create version error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
