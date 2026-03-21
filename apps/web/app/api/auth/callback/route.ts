import { NextRequest, NextResponse } from "next/server";
import { verifyMagicLinkToken, createSessionToken, getSessionCookieOptions } from "@/lib/auth";
import { prisma } from "@authorship-receipt/db";

async function processToken(token: string) {
  const email = await verifyMagicLinkToken(token);
  if (!email) return null;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const sessionToken = await createSessionToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return { sessionToken, redirectTo: "/dashboard" };
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/login?error=missing_token", req.url));
  }

  const result = await processToken(token);
  if (!result) {
    return NextResponse.redirect(new URL("/login?error=invalid_token", req.url));
  }

  const cookieOptions = getSessionCookieOptions();
  const response = NextResponse.redirect(new URL(result.redirectTo, req.url));
  response.cookies.set(cookieOptions.name, result.sessionToken, {
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
    maxAge: cookieOptions.maxAge,
    path: cookieOptions.path,
  });

  return response;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const token = body.token;

  if (!token) {
    return NextResponse.json({ error: "missing_token" }, { status: 400 });
  }

  const result = await processToken(token);
  if (!result) {
    return NextResponse.json({ error: "invalid_token" }, { status: 401 });
  }

  const cookieOptions = getSessionCookieOptions();

  const response = NextResponse.json({ success: true });
  response.cookies.set(cookieOptions.name, result.sessionToken, {
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
    maxAge: cookieOptions.maxAge,
    path: cookieOptions.path,
  });

  return response;
}
