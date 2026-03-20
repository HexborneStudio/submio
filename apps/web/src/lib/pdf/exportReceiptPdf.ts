/**
 * PDF export service — generates receipt PDF using @react-pdf/renderer.
 */

import { renderToBuffer } from "@react-pdf/renderer";
import { PdfReceiptDocument } from "@/components/receipt/PdfReceiptDocument";
import { prisma } from "@authorship-receipt/db";
import { saveFile } from "@/lib/storage";

export async function generateReceiptPdf(receiptId: string): Promise<Buffer> {
  const receipt = await prisma.authorshipReceipt.findUnique({
    where: { id: receiptId },
    include: {
      receiptSections: { orderBy: { sortOrder: "asc" } },
      document: true,
    },
  });

  if (!receipt) {
    throw new Error(`Receipt ${receiptId} not found`);
  }

  const exportedAt = new Date().toLocaleString();

  const buffer = await renderToBuffer(
    PdfReceiptDocument({ receipt: receipt as never, exportedAt })
  );

  return buffer;
}

export async function saveExportedPdf(
  receiptId: string,
  pdfBuffer: Buffer,
  userId: string
): Promise<{ storedPath: string; exportId: string }> {
  const filename = `receipt-${receiptId}-${Date.now()}.pdf`;

  const stored = await saveFile(pdfBuffer, filename, "application/pdf");

  const exportRecord = await prisma.export.create({
    data: {
      receiptId,
      userId,
      format: "pdf",
      status: "COMPLETED",
      filePath: stored.storedPath,
      fileSize: stored.size,
    },
  });

  return { storedPath: stored.storedPath, exportId: exportRecord.id };
}
