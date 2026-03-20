import { NextRequest, NextResponse } from "next/server";
import { isValidAdminToken } from "@/lib/adminAuth";
import { cookies } from "next/headers";

const ADMIN_COOKIE = "ar_admin_session";

export async function POST(req: NextRequest) {
  const { secret } = await req.json();

  if (!isValidAdminToken(secret)) {
    return NextResponse.json({ error: "Invalid" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 hours
    path: "/",
  });

  return NextResponse.json({ success: true });
}
