/**
 * Share link service — create, validate, revoke tokens.
 */

import { randomBytes } from "crypto";
import { PrismaClient } from "@authorship-receipt/db";

const prisma = new PrismaClient();

const TOKEN_BYTES = 32; // 256 bits of entropy

export async function createShareLink(
  receiptId: string,
  userId: string,
  expiresInDays?: number // optional, null = never expires
): Promise<{ token: string; url: string; expiresAt: Date | null }> {
  const token = randomBytes(TOKEN_BYTES).toString("base64url");
  const expiresAt = expiresInDays
    ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
    : null;

  await prisma.sharedLink.create({
    data: {
      token,
      receiptId,
      createdById: userId,
      expiresAt,
      status: "ACTIVE",
    },
  });

  const url = `/share/${token}`;

  return { token, url, expiresAt };
}

export async function validateShareToken(token: string) {
  // Don't leak timing — always run a query
  const link = await prisma.sharedLink.findUnique({
    where: { token },
    include: {
      receipt: {
        include: {
          receiptSections: { orderBy: { sortOrder: "asc" } },
          document: { select: { id: true, title: true, userId: true } },
        },
      },
    },
  });

  if (!link) return { valid: false, reason: "not_found" as const };
  if (link.status === "REVOKED") return { valid: false, reason: "revoked" as const };
  if (link.status === "EXPIRED" || (link.expiresAt && link.expiresAt < new Date())) {
    // Update status to EXPIRED if not already
    if (link.status !== "EXPIRED") {
      await prisma.sharedLink.update({
        where: { id: link.id },
        data: { status: "EXPIRED" },
      });
    }
    return { valid: false, reason: "expired" as const };
  }

  return { valid: true, link };
}

export async function revokeShareLink(token: string, userId: string) {
  const link = await prisma.sharedLink.findUnique({ where: { token } });

  if (!link) return { success: false, reason: "not_found" as const };
  if (link.createdById !== userId) return { success: false, reason: "forbidden" as const };
  if (link.status === "REVOKED") return { success: true, alreadyRevoked: true };

  await prisma.sharedLink.update({
    where: { id: link.id },
    data: { status: "REVOKED", revokedAt: new Date() },
  });

  return { success: true };
}

export async function getShareLinksForReceipt(receiptId: string, userId: string) {
  return prisma.sharedLink.findMany({
    where: { receiptId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      token: true,
      status: true,
      expiresAt: true,
      createdAt: true,
      revokedAt: true,
    },
  });
}
