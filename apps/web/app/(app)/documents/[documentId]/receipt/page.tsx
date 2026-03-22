import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@authorship-receipt/db";
import { ShareSection } from "./ShareSection";
import { ExportPdfButton } from "./ExportPdfButton";
import { CollapsibleSection } from "./CollapsibleSection";
import { trackEvent } from "@/lib/analytics";

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;
  const user = await getCurrentUser();

  // Get document with latest receipt
  const document = await prisma.document.findFirst({
    where: { id: documentId, userId: user!.id },
    include: {
      authorshipReceipt: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: {
          receiptSections: {
            orderBy: { sortOrder: "asc" },
          },
        },
      },
    },
  });

  if (!document) {
    notFound();
  }

  const receipt = document.authorshipReceipt[0];

  // Track receipt view (analytics scaffold)
  if (receipt) {
    trackEvent("receipt_viewed", { receiptId: receipt.id });
  }

  if (!receipt) {
    // No receipt yet
    return (
      <div className="space-y-6">
        <div>
          <Link
            href="/documents"
            className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block"
          >
            ← Back to Papers
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Detailed Report</h1>
        </div>

        <div className="bg-gray-50 border border-dashed rounded-lg p-12 text-center">
          <div className="text-4xl mb-4">📋</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            No Check Results Yet
          </h2>
          <p className="text-gray-500 mb-4">
            Check back once your paper is done analyzing — results will appear here automatically.
          </p>
          <Link
            href={`/documents/${documentId}`}
            className="text-blue-600 hover:underline text-sm"
          >
            View Paper →
          </Link>
        </div>
      </div>
    );
  }

  const receiptData = receipt.receiptData as {
    status: string;
    summary: {
      overallConfidence: string;
      summaryText: string;
      processingWarnings: string[];
    };
    disclaimer: string;
  };

  const confidenceColors: Record<string, string> = {
    low: "bg-red-50 text-red-800 border-red-200",
    medium: "bg-yellow-50 text-yellow-800 border-yellow-200",
    high: "bg-green-50 text-green-800 border-green-200",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href={`/documents/${documentId}`}
          className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block"
          >
          ← Back to Check Result
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Detailed Report
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {document.title}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              This is a detailed breakdown. For a summary, go back to your check result.
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium border ${
              confidenceColors[receiptData?.summary?.overallConfidence || "low"]
            }`}
          >
            {receiptData?.summary?.overallConfidence ? receiptData.summary.overallConfidence.charAt(0).toUpperCase() + receiptData.summary.overallConfidence.slice(1) : "Unknown"} confidence
          </span>
        </div>
      </div>

      {/* Summary block */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="font-semibold text-blue-900 mb-2">Summary</h2>
        <p className="text-blue-800 text-sm">
          {receiptData?.summary?.summaryText ||
            "Analysis completed. See details below."}
        </p>
        {receiptData?.summary?.processingWarnings?.length > 0 && (
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-xs text-blue-700">
              ⚠️ {receiptData.summary.processingWarnings.join(" ")}
            </p>
          </div>
        )}
      </div>

      {/* Priority sections: Citation + Confidence */}
      {receipt.receiptSections
        .filter((s) => ["citations", "confidence"].includes((s.content as any).key))
        .map((section) => {
          const data = section.content as {
            key: string; title: string; summary: string;
            items: Array<{ label: string; value: string | number | boolean }>;
            warnings: string[]; notes: string[];
          };
          return (
            <div key={section.id} className="bg-white border rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">{data.title}</h3>
              {data.key === "confidence" ? (
                <div className="mb-4">
                  <p className="text-gray-600 text-sm mb-3">{data.summary}</p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                    <p className="text-yellow-800 text-sm font-medium mb-1">⚠️ A Note About This Report</p>
                    <p className="text-yellow-700 text-xs leading-relaxed">
                      This report shows patterns and indicators — it is not a verdict on your work or academic integrity. It is a transparency tool to help you understand what your paper looks like from a citation and structure standpoint.
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 text-sm mb-4">{data.summary}</p>
              )}
              {data.items.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {data.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-500">{item.label}</span>
                      <span className="font-medium text-gray-900">
                        {typeof item.value === "boolean" ? item.value ? "Yes" : "No" : String(item.value)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {data.warnings.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded p-3 mb-4">
                  {data.warnings.map((w, i) => <p key={i} className="text-amber-800 text-xs">⚠️ {w}</p>)}
                </div>
              )}
              {data.notes.length > 0 && data.key !== "confidence" && (
                <div className="text-xs text-gray-400 space-y-1">
                  {data.notes.map((n, i) => <p key={i}>{n}</p>)}
                </div>
              )}
            </div>
          );
        })}

      {/* Technical Details — collapsed by default */}
      {receipt.receiptSections.filter((s) => !["citations", "confidence"].includes((s.content as any).key)).length > 0 && (
        <CollapsibleSection title="Technical Details" defaultOpen={false}>
          {receipt.receiptSections
            .filter((s) => !["citations", "confidence"].includes((s.content as any).key))
            .map((section) => {
              const data = section.content as {
                key: string; title: string; summary: string;
                items: Array<{ label: string; value: string | number | boolean }>;
                warnings: string[];
              };
              return (
                <div key={section.id} className="mb-3 last:mb-0">
                  <p className="text-gray-400 text-xs mb-1.5">{data.title}</p>
                  {data.items.length > 0 && (
                    <div className="grid grid-cols-2 gap-1.5 mb-1.5">
                      {data.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-xs">
                          <span className="text-gray-400">{item.label}</span>
                          <span className="text-gray-700">
                            {typeof item.value === "boolean" ? item.value ? "Yes" : "No" : String(item.value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {data.warnings.length > 0 && (
                    <div className="bg-amber-50 border border-amber-100 rounded px-2 py-1">
                      {data.warnings.map((w, i) => <p key={i} className="text-amber-700 text-xs">⚠️ {w}</p>)}
                    </div>
                  )}
                </div>
              );
            })}
        </CollapsibleSection>
      )}

      {/* Share with Instructor */}
      <ShareSection receiptId={receipt.id} />

      {/* Export PDF */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Export Report</h3>
        <p className="text-gray-500 text-sm mb-4">
          Download a PDF copy of your detailed report — keep it for your records or share it with your instructor.
        </p>
        <ExportPdfButton receiptId={receipt.id} />
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <p className="text-xs text-gray-500 leading-relaxed">
          This report provides evidence-based indicators to support honest academic practices. It is not a verdict — always review findings in context with your instructor.
        </p>
      </div>
    </div>
  );
}
