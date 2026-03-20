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
        },
      },
    },
  });

  if (!document) {
    notFound();
  }

  const statusColors: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-800",
    PROCESSING: "bg-yellow-100 text-yellow-800",
    READY: "bg-green-100 text-green-800",
    FAILED: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/documents"
            className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block"
          >
            ← Back to Documents
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{document.title}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span>Created {new Date(document.createdAt).toLocaleDateString()}</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                statusColors[document.status] || "bg-gray-100 text-gray-800"
              }`}
            >
              {document.status}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          {document.status === "READY" && (
            <Link
              href={`/documents/${document.id}/receipt`}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              View Receipt
            </Link>
          )}
          <Link
            href={`/documents/${document.id}/upload`}
            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-50"
          >
            Add Version
          </Link>
        </div>
      </div>

      {/* Versions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Versions ({document.versions.length})
        </h2>

        {document.versions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-dashed">
            <p className="text-gray-500 mb-4">No versions yet</p>
            <Link
              href={`/documents/${document.id}/upload`}
              className="text-blue-600 hover:underline text-sm"
            >
              Add the first version
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
              View receipt →
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
