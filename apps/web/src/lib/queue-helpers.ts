/**
 * Queue helpers for the web app.
 * Encapsulates job creation + enqueue logic.
 */

import { prisma } from "@authorship-receipt/db";

const WORKER_URL = process.env.WORKER_URL || "http://localhost:3001";

export async function createAndEnqueueJob(
  documentId: string,
  versionId: string
): Promise<string> {
  // Create job record
  const job = await prisma.analysisJob.create({
    data: {
      documentId,
      versionId,
      status: "PENDING",
      progress: 0,
    },
  });

  // Attempt to enqueue
  try {
    const res = await fetch(`${WORKER_URL}/enqueue`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobId: job.id,
        documentId,
        versionId,
      }),
    });

    if (!res.ok) {
      // Mark as failed but don't throw
      await prisma.analysisJob.update({
        where: { id: job.id },
        data: { status: "FAILED", error: `Enqueue failed: ${res.status}` },
      });
    }
  } catch (err) {
    // Worker unreachable — mark as failed
    await prisma.analysisJob.update({
      where: { id: job.id },
      data: { status: "FAILED", error: "Worker unreachable" },
    });
  }

  return job.id;
}
