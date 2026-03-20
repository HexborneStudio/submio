import { randomBytes } from "crypto";
import { MAGIC_LINK_TOKEN_EXPIRY_MINUTES } from "./config";
import { prisma } from "@authorship-receipt/db";

export function generateMagicLinkToken(): string {
  return randomBytes(32).toString("hex");
}

export async function createMagicLinkToken(email: string) {
  const token = generateMagicLinkToken();
  const expiresAt = new Date(Date.now() + MAGIC_LINK_TOKEN_EXPIRY_MINUTES * 60 * 1000);

  await prisma.magicLinkToken.create({
    data: { email: email.toLowerCase().trim(), token, expiresAt },
  });

  return token;
}

export async function verifyMagicLinkToken(token: string) {
  const record = await prisma.magicLinkToken.findUnique({ where: { token } });

  if (!record) return null;
  if (record.expiresAt < new Date()) return null;
  if (record.usedAt) return null;

  // Mark as used
  await prisma.magicLinkToken.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  });

  return record.email;
}
