import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { createDocumentSchema } from "@authorship-receipt/shared";
import { prisma } from "@authorship-receipt/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ documentId: string }> }
) {
  try {
    const user = await requireUser();
    const { documentId } = await params;

    const document = await prisma.document.findFirst({
      where: { id: documentId, userId: user.id },
      include: {
        versions: {
          orderBy: { version: "desc" },
          include: {
            uploads: true,
          },
        },
      },
    });

    if (!document) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ document });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ documentId: string }> }
) {
  try {
    const user = await requireUser();
    const { documentId } = await params;
    const body = await req.json();
    const { title } = createDocumentSchema.partial().parse(body);

    const document = await prisma.document.findFirst({
      where: { id: documentId, userId: user.id },
    });

    if (!document) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.document.update({
      where: { id: documentId },
      data: { title },
    });

    return NextResponse.json({ document: updated });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message.includes("ZodError")) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
