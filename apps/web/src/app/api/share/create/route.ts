import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createShareLink, getShareLinksForReceipt } from "@/lib/shareService";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { receiptId, expiresInDays } = await req.json();

  if (!receiptId) {
    return NextResponse.json({ error: "receiptId required" }, { status: 400 });
  }

  const result = await createShareLink(receiptId, user.id, expiresInDays);
  return NextResponse.json(result);
}

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const receiptId = searchParams.get("receiptId");

  if (!receiptId) {
    return NextResponse.json({ error: "receiptId required" }, { status: 400 });
  }

  const links = await getShareLinksForReceipt(receiptId, user.id);
  return NextResponse.json({ links });
}
