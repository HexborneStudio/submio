import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_COOKIE = "ar_admin_session";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"));
}
