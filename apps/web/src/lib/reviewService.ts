/**
 * Educator review service.
 */

import { PrismaClient } from "@authorship-receipt/db";

const prisma = new PrismaClient();

export async function submitReview(data: {
  reviewerName: string;
  reviewerEmail?: string;
  status: "PENDING" | "REVIEWED" | "NEEDS_FOLLOW_UP" | "FLAGGED";
  note: string;
  receiptId: string;
  educatorId?: string;
  sharedLinkId?: string;
}) {
  return prisma.educatorReview.create({
    data: {
      reviewerName: data.reviewerName,
      reviewerEmail: data.reviewerEmail,
      status: data.status,
      note: data.note,
      receiptId: data.receiptId,
      educatorId: data.educatorId,
      sharedLinkId: data.sharedLinkId,
    },
  });
}

export async function getReviewsForReceipt(receiptId: string) {
  return prisma.educatorReview.findMany({
    where: { receiptId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      reviewerName: true,
      reviewerEmail: true,
      status: true,
      note: true,
      createdAt: true,
    },
  });
}
