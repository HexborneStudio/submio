import { prisma } from "@authorship-receipt/db";

export async function getAdminStats() {
  const [
    totalUsers,
    totalDocuments,
    totalReceipts,
    pendingJobs,
    failedJobs,
    recentReviews,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.document.count(),
    prisma.authorshipReceipt.count(),
    prisma.analysisJob.count({ where: { status: "PENDING" } }),
    prisma.analysisJob.count({ where: { status: "FAILED" } }),
    prisma.educatorReview.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
  ]);

  return {
    totalUsers,
    totalDocuments,
    totalReceipts,
    pendingJobs,
    failedJobs,
    recentReviews,
  };
}

export async function listUsers(params: {
  page?: number;
  search?: string;
}) {
  const page = params.page || 1;
  const take = 50;
  const skip = (page - 1) * take;

  const where = params.search
    ? {
        OR: [
          {
            email: { contains: params.search, mode: "insensitive" as const },
          },
          { name: { contains: params.search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      take,
      skip,
      orderBy: { createdAt: "desc" },
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: { select: { documents: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total, page, pages: Math.ceil(total / take) };
}

export async function listReceipts(params: {
  page?: number;
  search?: string;
}) {
  const page = params.page || 1;
  const take = 50;
  const skip = (page - 1) * take;

  const where = params.search
    ? {
        document: {
          title: { contains: params.search, mode: "insensitive" as const },
        },
      }
    : {};

  const [receipts, total] = await Promise.all([
    prisma.authorshipReceipt.findMany({
      take,
      skip,
      orderBy: { createdAt: "desc" },
      where,
      include: {
        document: {
          select: {
            id: true,
            title: true,
            user: { select: { email: true } },
          },
        },
      },
    }),
    prisma.authorshipReceipt.count({ where }),
  ]);

  return { receipts, total, page, pages: Math.ceil(total / take) };
}

export async function listJobs(params: { page?: number; status?: string }) {
  const page = params.page || 1;
  const take = 50;
  const skip = (page - 1) * take;

  const where = params.status ? { status: params.status as any } : {};

  const [jobs, total] = await Promise.all([
    prisma.analysisJob.findMany({
      take,
      skip,
      orderBy: { createdAt: "desc" },
      where,
      select: {
        id: true,
        status: true,
        progress: true,
        attempts: true,
        maxAttempts: true,
        error: true,
        createdAt: true,
        updatedAt: true,
        startedAt: true,
        completedAt: true,
        versionId: true,
        documentId: true,
      },
    }),
    prisma.analysisJob.count({ where }),
  ]);

  return { jobs, total, page, pages: Math.ceil(total / take) };
}

export async function listAuditLogs(params: {
  page?: number;
  eventType?: string;
}) {
  const page = params.page || 1;
  const take = 100;
  const skip = (page - 1) * take;

  const where = params.eventType ? { action: params.eventType } : {};

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      take,
      skip,
      orderBy: { createdAt: "desc" },
      where,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { logs, total, page, pages: Math.ceil(total / take) };
}

export async function getSupportOverview() {
  const [failedJobs, recentExports, recentSharedLinks, recentReviews, pendingJobs] =
    await Promise.all([
      prisma.analysisJob.findMany({
        where: { status: "FAILED" },
        orderBy: { updatedAt: "desc" },
        take: 10,
        select: {
          id: true,
          status: true,
          error: true,
          attempts: true,
          updatedAt: true,
          documentId: true,
          versionId: true,
        },
      }),
      prisma.export.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          format: true,
          status: true,
          createdAt: true,
          userId: true,
        },
      }),
      prisma.sharedLink.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          status: true,
          createdAt: true,
          receiptId: true,
        },
      }),
      prisma.educatorReview.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          reviewerName: true,
          status: true,
          createdAt: true,
          receiptId: true,
          note: true,
        },
      }),
      prisma.analysisJob.count({ where: { status: "PENDING" } }),
    ]);

  return {
    failedJobs,
    recentExports,
    recentSharedLinks,
    recentReviews,
    pendingJobs,
  };
}
