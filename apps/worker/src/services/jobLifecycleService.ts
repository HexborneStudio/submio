/**
 * Job lifecycle management — updates AnalysisJob record in the database.
 */

import { PrismaClient, AnalysisJobStatus } from "@prisma/client";

const prisma = new PrismaClient();

export interface JobUpdate {
  status?: AnalysisJobStatus;
  progress?: number;
  result?: object;
  error?: string;
}

export async function createAnalysisJob(
  documentId: string,
  versionId: string
): Promise<string> {
  const job = await prisma.analysisJob.create({
    data: {
      documentId,
      versionId,
      status: "PENDING",
      progress: 0,
    },
  });

  return job.id;
}

export async function updateJob(
  jobId: string,
  update: JobUpdate
): Promise<void> {
  const data: Parameters<typeof prisma.analysisJob.update>[0]["data"] = { ...update };

  if (update.status === "PROCESSING" && !update.progress) {
    data.startedAt = new Date();
  }

  if (update.status === "COMPLETED" || update.status === "FAILED") {
    data.completedAt = new Date();
    data.progress = update.status === "COMPLETED" ? 100 : update.progress;
  }

  await prisma.analysisJob.update({
    where: { id: jobId },
    data,
  });
}

export async function incrementJobAttempts(jobId: string): Promise<number> {
  const job = await prisma.analysisJob.update({
    where: { id: jobId },
    data: { attempts: { increment: 1 } },
    select: { attempts: true },
  });
  return job.attempts;
}

export async function markJobStarted(jobId: string): Promise<void> {
  await updateJob(jobId, { status: "PROCESSING", progress: 0 });
}

export async function markJobCompleted(
  jobId: string,
  result: unknown
): Promise<void> {
  await updateJob(jobId, {
    status: "COMPLETED",
    progress: 100,
    result: result as object,
  });
}

export async function markJobFailed(
  jobId: string,
  error: string
): Promise<void> {
  await updateJob(jobId, { status: "FAILED", error });
}

export async function updateJobProgress(
  jobId: string,
  progress: number,
  result?: object
): Promise<void> {
  await updateJob(jobId, {
    status: "PROCESSING",
    progress,
    result,
  });
}

export async function updateDocumentStatus(
  documentId: string,
  status: "PROCESSING" | "READY" | "FAILED"
): Promise<void> {
  await prisma.document.update({
    where: { id: documentId },
    data: { status },
  });
}

export async function getJobForProcessing(jobId: string) {
  return prisma.analysisJob.findUnique({
    where: { id: jobId },
    include: {
      version: {
        include: { uploads: true },
      },
    },
  });
}
