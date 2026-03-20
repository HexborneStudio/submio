/**
 * POST /api/documents/[documentId]/enqueue
 *
 * Called after creating a document version to enqueue analysis.
 * Returns immediately — worker processes async.
 */

import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@authorship-receipt/db";

const WORKER_URL = process.env.WORKER_URL || "http://localhost:3001";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ documentId: string }> }
) {
  try {
    const user = await requireUser();
    const { documentId } = await params;

    // Verify ownership
    const document = await prisma.document.findFirst({
      where: { id: documentId, userId: user.id },
    });

    if (!document) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Get latest version
    const latestVersion = await prisma.documentVersion.findFirst({
      where: { documentId },
      orderBy: { version: "desc" },
    });

    if (!latestVersion) {
      return NextResponse.json({ error: "No version found" }, { status: 400 });
    }

    // Create AnalysisJob record
    const job = await prisma.analysisJob.create({
      data: {
        documentId,
        versionId: latestVersion.id,
        status: "PENDING",
        progress: 0,
      },
    });

    // Enqueue via worker HTTP endpoint
    try {
      const workerRes = await fetch(`${WORKER_URL}/enqueue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job.id,
          documentId,
          versionId: latestVersion.id,
        }),
      });

      if (!workerRes.ok) {
        // Queue might be down — update job to FAILED but don't block user
        await prisma.analysisJob.update({
          where: { id: job.id },
          data: { status: "FAILED", error: "Failed to enqueue — worker unavailable" },
        });

        return NextResponse.json({
          jobId: job.id,
          status: "queued_failed",
          warning: "Analysis queue unavailable — job marked as failed"
        }, { status: 202 });
      }
    } catch (fetchError) {
      // Worker not reachable — mark as failed but don't block
      await prisma.analysisJob.update({
        where: { id: job.id },
        data: { status: "FAILED", error: "Worker unavailable" },
      });

      return NextResponse.json({
        jobId: job.id,
        status: "queued_failed",
        warning: "Analysis worker not reachable — job marked as failed"
      }, { status: 202 });
    }

    return NextResponse.json({
      jobId: job.id,
      status: "queued",
      versionId: latestVersion.id,
    });

  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Enqueue error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
