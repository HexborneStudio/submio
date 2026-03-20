import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = ["/dashboard", "/documents", "/settings"];
const PUBLIC_PATHS = ["/login", "/signup", "/auth"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if path requires auth
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

  // Check for session cookie
  const sessionCookie = req.cookies.get("ar_session");

  if (isProtected && !sessionCookie) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from public auth pages
  if (sessionCookie && PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/documents/:path*",
    "/settings/:path*",
    "/login",
    "/signup",
  ],
};
