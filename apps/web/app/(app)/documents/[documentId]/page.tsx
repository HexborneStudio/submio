import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@authorship-receipt/db";

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;
  const user = await getCurrentUser();

  const document = await prisma.document.findFirst({
    where: { id: documentId, userId: user!.id },
    include: {
      versions: {
        orderBy: { version: "desc" },
        include: {
          uploads: true,
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
      },
    },
  });

  if (!document) {
    notFound();
  }

  const latestVersion = document.versions[0];
  const latestReceipt = latestVersion?.authorshipReceipt?.[0];
  const receiptData = latestReceipt?.receiptData as {
    status: string;
    summary: {
      overallConfidence: string;
      summaryText: string;
      processingWarnings: string[];
    };
    disclaimer: string;
  } | null;

  const statusColors: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-800",
    PROCESSING: "bg-yellow-100 text-yellow-800",
    READY: "bg-green-100 text-green-800",
    FAILED: "bg-red-100 text-red-800",
  };

  const confidenceColors: Record<string, string> = {
    low: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-green-100 text-green-800 border-green-200",
  };

  // Determine submission readiness based on confidence
  const getSubmissionStatus = () => {
    if (document.status === "PROCESSING") return { label: "Checking in Progress", color: "yellow" };
    if (document.status === "FAILED") return { label: "Check Failed", color: "red" };
    if (document.status !== "READY") return { label: "Not Ready", color: "gray" };
    
    const confidence = receiptData?.summary?.overallConfidence || "medium";
    if (confidence === "high") return { label: "Ready to Submit", color: "green" };
    if (confidence === "medium") return { label: "Needs Review", color: "yellow" };
    return { label: "Issues Found", color: "red" };
  };

  const submissionStatus = getSubmissionStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/documents"
            className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block"
          >
            ← Back to Papers
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{document.title}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span>Created {new Date(document.createdAt).toLocaleDateString()}</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                statusColors[document.status] || "bg-gray-100 text-gray-800"
              }`}
            >
              {document.status === "PROCESSING" ? "Checking" : document.status === "READY" ? "Ready" : document.status}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          {document.status === "READY" && (
            <Link
              href={`/documents/${document.id}/receipt`}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              View Detailed Report
            </Link>
          )}
          {document.status === "PROCESSING" && (
            <span className="px-4 py-2 bg-yellow-100 text-yellow-800 text-sm rounded-md">
              Checking...
            </span>
          )}
          <Link
            href={`/documents/${document.id}/upload`}
            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-50"
          >
            Upload New Version
          </Link>
        </div>
      </div>

      {/* Paper Check Result Summary - ONLY shown when ready */}
      {document.status === "READY" && receiptData && (
        <div className="bg-white border rounded-lg overflow-hidden">
          {/* Status Banner */}
          <div className={`px-6 py-4 border-b ${
            submissionStatus.color === "green" ? "bg-green-50 border-green-200" :
            submissionStatus.color === "yellow" ? "bg-yellow-50 border-yellow-200" :
            submissionStatus.color === "red" ? "bg-red-50 border-red-200" :
            "bg-gray-50 border-gray-200"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Paper Check Result</h2>
                <p className={`text-sm font-medium ${
                  submissionStatus.color === "green" ? "text-green-700" :
                  submissionStatus.color === "yellow" ? "text-yellow-700" :
                  submissionStatus.color === "red" ? "text-red-700" :
                  "text-gray-700"
                }`}>
                  {submissionStatus.label}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border ${
                  confidenceColors[receiptData?.summary?.overallConfidence || "medium"]
                }`}
              >
                {receiptData?.summary?.overallConfidence?.toUpperCase() || "UNKNOWN"} CONFIDENCE
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Summary Text */}
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Overall Summary</h3>
              <p className="text-gray-600 text-sm">
                {receiptData?.summary?.summaryText || "Analysis completed. See the detailed report for full findings."}
              </p>
            </div>

            {/* Issues and What's Good */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Issues to Review</h3>
                {receiptData?.summary?.processingWarnings && receiptData.summary.processingWarnings.length > 0 ? (
                  <ul className="text-sm text-gray-600 space-y-1">
                    {receiptData.summary.processingWarnings.map((warning, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-500">⚠️</span>
                        {warning}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-green-600 flex items-center gap-2">
                    <span>✓</span> No major issues detected
                  </p>
                )}
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">What&apos;s Good</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  {latestVersion?.content && (
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      Text content detected ({latestVersion.content.split(/\s+/).filter(Boolean).length.toLocaleString()} words)
                    </li>
                  )}
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    Document structure analyzed
                  </li>
                </ul>
              </div>
            </div>

            {/* Citation Coverage */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Citation Coverage</h3>
              {latestReceipt?.receiptSections?.find(s => {
                const data = s.content as { key?: string };
                return data.key === "citations";
              }) ? (
                <p className="text-sm text-gray-600">Citation analysis complete — see detailed report.</p>
              ) : (
                <p className="text-sm text-gray-600">No citation issues detected.</p>
              )}
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Next Steps</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                {receiptData?.summary?.processingWarnings && receiptData.summary.processingWarnings.length > 0 ? (
                  <>
                    <li>Review the issues flagged above and decide what to address</li>
                    <li>Check the detailed report for a full breakdown</li>
                    <li>Re-upload your paper after making changes to see updated results</li>
                  </>
                ) : (
                  <>
                    <li>Your paper looks solid — review the detailed report to confirm</li>
                    <li>Share the report with your instructor before or after submission if helpful</li>
                    <li>Download the PDF for your records</li>
                  </>
                )}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Link
                href={`/documents/${document.id}/receipt`}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                View Detailed Report
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Versions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Versions Checked ({document.versions.length})
        </h2>

        {document.versions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-dashed">
            <p className="text-gray-500 mb-4">No versions yet</p>
            <Link
              href={`/documents/${document.id}/upload`}
              className="text-blue-600 hover:underline text-sm"
            >
              Upload your first version
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {document.versions.map((version) => {
              const upload = version.uploads[0];
              const wordCount = version.content
                ? version.content.split(/\s+/).filter(Boolean).length
                : null;

              return (
                <div
                  key={version.id}
                  className="bg-white p-4 rounded-lg border"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          Version {version.version}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(version.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        {upload ? (
                          <>
                            <span>📄 {upload.originalName}</span>
                            <span>{(upload.size / 1024).toFixed(1)} KB</span>
                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                              {upload.mimeType.includes("pdf") ? "PDF" : "DOCX"}
                            </span>
                          </>
                        ) : version.content ? (
                          <span>📝 {wordCount?.toLocaleString()} words (pasted)</span>
                        ) : (
                          <span className="text-gray-400">Empty version</span>
                        )}
                      </div>
                    </div>

                    <div className="text-sm text-gray-400">
                      v{version.version}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Analysis status placeholder */}
      <div className="bg-gray-50 p-6 rounded-lg border border-dashed">
        <h3 className="font-medium text-gray-900 mb-2">📊 Analysis</h3>
        {document.status === "PROCESSING" ? (
          <div className="flex items-center gap-2 text-sm text-yellow-700">
            <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin" />
            Analysis in progress...
          </div>
        ) : document.status === "READY" ? (
          <p className="text-sm text-gray-600">
            Analysis complete.{" "}
            <Link
              href={`/documents/${document.id}/receipt`}
              className="text-blue-600 hover:underline"
            >
              View detailed report →
            </Link>
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            Analysis has not started yet. Once content is uploaded, analysis will run automatically.
          </p>
        )}
      </div>
    </div>
  );
}
