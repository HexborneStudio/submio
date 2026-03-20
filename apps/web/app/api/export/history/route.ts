import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@authorship-receipt/db";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const exports = await prisma.export.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      receiptId: true,
      format: true,
      status: true,
      fileSize: true,
      createdAt: true,
      completedAt: true,
    },
  });

  return NextResponse.json({ exports });
}
