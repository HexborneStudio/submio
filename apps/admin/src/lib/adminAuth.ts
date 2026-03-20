/**
 * Admin authentication gate — MVP using shared secret.
 * In production, replace with proper RBAC/SSO.
 */

import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const ADMIN_COOKIE = "ar_admin_session";
const ADMIN_SECRET = process.env.ADMIN_SECRET || "dev-admin-secret-change-me";

export async function getAdminSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE);

  if (!session?.value) return null;

  // Simple session: the cookie value is the admin secret (MVP only)
  // In production, use proper JWT or server-side session
  if (session.value !== ADMIN_SECRET) return null;

  return { authenticated: true };
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export function isValidAdminToken(token: string): boolean {
  return token === ADMIN_SECRET;
}
