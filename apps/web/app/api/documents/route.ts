import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { createDocumentSchema } from "@authorship-receipt/shared";
import { prisma } from "@authorship-receipt/db";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const { title, description } = createDocumentSchema.parse(body);

    const document = await prisma.document.create({
      data: {
        userId: user.id,
        title,
        status: "DRAFT",
      },
    });

    // Track document creation (analytics scaffold)
    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics] document_created", { documentId: document.id });
    }

    return NextResponse.json({ document }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message.includes("ZodError")) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    console.error("Create document error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.document.count({ where: { userId: user.id } }),
    ]);

    return NextResponse.json({
      items: documents,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
