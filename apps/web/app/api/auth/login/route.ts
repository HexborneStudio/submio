import { NextRequest, NextResponse } from "next/server";
import { authSchema } from "@/lib/auth";
import { createMagicLinkToken } from "@/lib/auth";
import { prisma } from "@authorship-receipt/db";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = authSchema.parse(body);

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: { email, role: "STUDENT" },
      });
    }

    // Create magic link token
    const token = await createMagicLinkToken(email);

    // Build magic link URL
    const magicLinkUrl = `${APP_URL}/auth/callback?token=${token}`;

    // TODO: Send actual email in production
    // For now, log to console (MVP placeholder)
    console.log(`\n🔗 Magic link for ${email}:`);
    console.log(magicLinkUrl);
    console.log(`\n(This will be emailed in production)\n`);

    return NextResponse.json({
      success: true,
      message: "Check your email for the magic link",
      // In dev, include the link directly
      ...(process.env.NODE_ENV === "development" && { debugLink: magicLinkUrl }),
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("ZodError")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    console.error("Login error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
