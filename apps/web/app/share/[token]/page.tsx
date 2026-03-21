import { notFound } from "next/navigation";
import Link from "next/link";
import { validateShareToken } from "@/lib/shareService";
import { getReviewsForReceipt } from "@/lib/reviewService";
import { SubmitReviewForm } from "./SubmitReviewForm";

export const dynamic = "force-dynamic";

export default async function SharedReceiptPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const tokenResult = await validateShareToken(token);

  if (!tokenResult.valid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg border shadow-sm p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🔗</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            {tokenResult.reason === "revoked"
              ? "Link Disabled"
              : tokenResult.reason === "expired"
              ? "Link Expired"
              : "Invalid Link"}
          </h1>
          <p className="text-gray-500 text-sm">
            {tokenResult.reason === "revoked"
              ? "This share link has been disabled by the student."
              : tokenResult.reason === "expired"
              ? "This share link has expired."
              : "This link is invalid or has been removed."}
          </p>
        </div>
      </div>
    );
  }

  const { link } = tokenResult;
  if (!link) {
    return notFound();
  }
  const receipt = link.receipt;
  const receiptData = receipt.receiptData as {
    status: string;
    summary: {
      overallConfidence: string;
      summaryText: string;
      processingWarnings: string[];
    };
    disclaimer: string;
  };

  const reviews = await getReviewsForReceipt(receipt.id);

  const confidenceColors: Record<string, string> = {
    low: "bg-red-50 text-red-800 border-red-200",
    medium: "bg-yellow-50 text-yellow-800 border-yellow-200",
    high: "bg-green-50 text-green-800 border-green-200",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shared Header */}
      <div className="bg-white border-b px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Shared Report</div>
            <h1 className="text-lg font-bold text-gray-900">{receipt.document.title}</h1>
          </div>
          <div className="text-xs text-gray-400">
            Shared on {new Date(link.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Confidence Badge */}
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium border ${
              confidenceColors[receiptData?.summary?.overallConfidence || "low"]
            }`}
          >
            {receiptData?.summary?.overallConfidence ? receiptData.summary.overallConfidence.charAt(0).toUpperCase() + receiptData.summary.overallConfidence.slice(1) : "Unknown"} confidence
          </span>
          <span className="text-sm text-gray-500">
            Paper Check — shared for instructor review
          </span>
        </div>

        {/* Summary block */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="font-semibold text-blue-900 mb-2">Summary</h2>
          <p className="text-blue-800 text-sm">
            {receiptData?.summary?.summaryText || "Analysis completed. See details below."}
          </p>
        </div>

        {/* Existing Reviews */}
        {reviews.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h2 className="font-semibold text-purple-900 mb-3">Instructor Feedback</h2>
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-purple-100 last:border-0 pb-3 last:pb-0 mb-3 last:mb-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-purple-900">{review.reviewerName}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    review.status === "REVIEWED" ? "bg-green-100 text-green-700" :
                    review.status === "NEEDS_FOLLOW_UP" ? "bg-orange-100 text-orange-700" :
                    review.status === "FLAGGED" ? "bg-red-100 text-red-700" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {review.status.replace("_", " ")}
                  </span>
                </div>
                <p className="text-purple-800 text-sm">{review.note}</p>
                <p className="text-purple-400 text-xs mt-1">{new Date(review.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}

        {/* Review Form */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="font-semibold text-gray-900 mb-1">Submit Review</h2>
          <p className="text-gray-500 text-xs mb-4">
            As an instructor, you can review this report and leave feedback. The student can see your review.
          </p>
          <SubmitReviewForm receiptId={receipt.id} sharedLinkId={link.id} />
        </div>

        {/* Sections */}
        {receipt.receiptSections.map((section) => {
          const data = section.content as {
            key: string;
            title: string;
            summary: string;
            items: Array<{ label: string; value: string | number | boolean }>;
            warnings: string[];
            notes: string[];
          };

          return (
            <div key={section.id} className="bg-white border rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">{data.title}</h3>

              {data.key !== "confidence" && (
                <p className="text-gray-600 text-sm mb-4">{data.summary}</p>
              )}

              {data.key === "confidence" && (
                <div className="mb-4">
                  <p className="text-gray-600 text-sm mb-3">{data.summary}</p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                    <p className="text-yellow-800 text-sm font-medium mb-1">⚠️ A Note About This Report</p>
                    <p className="text-yellow-700 text-xs leading-relaxed">
                      This report shows patterns and indicators — it is not a verdict on the student&apos;s work
                      or academic integrity. It is a transparency tool to help understand what the paper
                      looks like from a citation and structure standpoint.
                    </p>
                  </div>
                </div>
              )}

              {data.items.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {data.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-500">{item.label}</span>
                      <span className="font-medium text-gray-900">
                        {typeof item.value === "boolean"
                          ? item.value ? "Yes" : "No"
                          : String(item.value)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {data.warnings.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded p-3 mb-4">
                  {data.warnings.map((w, i) => (
                    <p key={i} className="text-amber-800 text-xs">⚠️ {w}</p>
                  ))}
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

        {/* Disclaimer */}
        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            {receiptData?.disclaimer}
          </p>
        </div>

        {/* Footer */}
        <div className="text-xs text-gray-400 text-center">
          Receipt ID: {receipt.id} · Generated: {new Date(receipt.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
