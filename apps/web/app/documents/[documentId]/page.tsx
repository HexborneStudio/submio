"use client";

import { useParams } from "next/navigation";

export default function DocumentDetailPage() {
  const params = useParams();
  const documentId = params.documentId;

  return (
    <main className="min-h-screen">
      <header className="border-b">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4">
          <a href="/dashboard" className="text-xl font-bold">← Back to Dashboard</a>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Document</h1>
          <div className="flex gap-4">
            <a
              href={`/documents/${documentId}/upload`}
              className="px-4 py-2 border rounded-md hover:bg-secondary"
            >
              Upload
            </a>
            <a
              href={`/documents/${documentId}/receipt`}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
            >
              View Receipt
            </a>
          </div>
        </div>

        <div className="p-8 border rounded-lg text-center">
          <p className="text-muted-foreground">
            Document ID: {documentId}
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Upload content to generate your authorship receipt.
          </p>
        </div>
      </div>
    </main>
  );
}
