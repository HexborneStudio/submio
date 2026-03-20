import { NextRequest, NextResponse } from "next/server";
import { verifyMagicLinkToken } from "@/lib/auth";
import { createSessionToken, getSessionCookieOptions } from "@/lib/auth";
import { prisma } from "@authorship-receipt/db";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=missing_token", req.url));
  }

  const email = await verifyMagicLinkToken(token);

  if (!email) {
    return NextResponse.redirect(new URL("/login?error=invalid_token", req.url));
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.redirect(new URL("/login?error=user_not_found", req.url));
  }

  // Create session token
  const sessionToken = await createSessionToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const cookieOptions = getSessionCookieOptions();

  const response = NextResponse.redirect(new URL("/dashboard", req.url));
  response.cookies.set(cookieOptions.name, sessionToken, {
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
    maxAge: cookieOptions.maxAge,
    path: cookieOptions.path,
  });

  return response;
}
