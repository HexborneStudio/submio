import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { generateReceiptPdf, saveExportedPdf } from "@/lib/pdf/exportReceiptPdf";
import { prisma } from "@authorship-receipt/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ receiptId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { receiptId } = await params;

  // Verify ownership
  const receipt = await prisma.authorshipReceipt.findUnique({
    where: { id: receiptId },
    include: { document: true },
  });

  if (!receipt) {
    return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
  }

  if (receipt.document.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // Generate PDF
    const pdfBuffer = await generateReceiptPdf(receiptId);

    // Save + record
    const { exportId } = await saveExportedPdf(receiptId, pdfBuffer, user.id);

    // Return PDF as downloadable response
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="authorship-receipt-${receiptId.slice(-8)}.pdf"`,
        "Content-Length": String(pdfBuffer.byteLength),
      },
    });
  } catch (err) {
    console.error("PDF export failed:", err);
    return NextResponse.json(
      { error: "Export failed", detail: err instanceof Error ? err.message : "Unknown" },
      { status: 500 }
    );
  }
}
