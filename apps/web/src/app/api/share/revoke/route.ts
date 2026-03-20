import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { revokeShareLink } from "@/lib/shareService";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { token } = await req.json();
  if (!token) return NextResponse.json({ error: "token required" }, { status: 400 });

  const result = await revokeShareLink(token, user.id);
  if (!result.success) {
    return NextResponse.json({ error: result.reason }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
