import { NextRequest, NextResponse } from "next/server";
import { validateShareToken } from "@/lib/shareService";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const result = await validateShareToken(token);

  if (!result.valid) {
    return NextResponse.json({ error: result.reason }, { status: 404 });
  }

  return NextResponse.json({ receipt: result.link.receipt, linkId: result.link.id });
}
