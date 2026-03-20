/**
 * Receipt persistence — creates AuthorshipReceipt + ReceiptSection records.
 */

import { PrismaClient, Prisma } from "@prisma/client";
import type { AssembledReceipt, ReceiptSection } from "@authorship-receipt/analysis";

const prisma = new PrismaClient();

export async function persistReceipt(
  documentId: string,
  versionId: string,
  receipt: AssembledReceipt
): Promise<string> {
  // Create the receipt
  const authorshipReceipt = await prisma.authorshipReceipt.create({
    data: {
      documentId,
      versionId,
      receiptData: receipt as unknown as Prisma.InputJsonValue,
      status: receipt.status === "failed" ? "EXPIRED" : "AVAILABLE",
    },
  });

  // Create sections in order
  const sectionOrder = [
    "overview",
    "parsing",
    "text-metrics",
    "citations",
    "sources",
    "structural",
    "confidence",
    "processing",
  ];

  const sectionMap = new Map<string, ReceiptSection>();
  for (const section of receipt.sections) {
    sectionMap.set(section.key, section);
  }

  // Create sections in order
  for (let i = 0; i < sectionOrder.length; i++) {
    const key = sectionOrder[i];
    const section = sectionMap.get(key);

    if (section) {
      await prisma.receiptSection.create({
        data: {
          receiptId: authorshipReceipt.id,
          type: section.key,
          title: section.title,
          content: section as unknown as Prisma.InputJsonValue,
          sortOrder: i,
        },
      });
    }
  }

  return authorshipReceipt.id;
}

export async function getReceiptForVersion(versionId: string) {
  return prisma.authorshipReceipt.findFirst({
    where: { versionId },
    include: {
      receiptSections: {
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getLatestReceiptForDocument(documentId: string) {
  return prisma.authorshipReceipt.findFirst({
    where: { documentId },
    include: {
      receiptSections: {
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
