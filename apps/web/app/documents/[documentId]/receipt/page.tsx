"use client";

import { useParams } from "next/navigation";

export default function ReceiptPage() {
  const params = useParams();
  const documentId = params.documentId;

  return (
    <main className="min-h-screen">
      <header className="border-b">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4">
          <a href={`/documents/${documentId}`} className="text-xl font-bold">← Back</a>
          <div className="flex gap-4">
            <button className="px-4 py-2 border rounded-md hover:bg-secondary">
              Share Link
            </button>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90">
              Export PDF
            </button>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Authorship Receipt</h1>
          <p className="text-muted-foreground">
            Document ID: {documentId}
          </p>
          <p className="text-sm text-muted-foreground">
            Generated: {new Date().toLocaleString()}
          </p>
        </div>

        <div className="space-y-6">
          <section className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Document Overview</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Status:</span>
                <span className="ml-2 font-medium">Processing</span>
              </div>
              <div>
                <span className="text-muted-foreground">Version:</span>
                <span className="ml-2 font-medium">v1</span>
              </div>
            </div>
          </section>

          <section className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Writing Timeline</h2>
            <p className="text-muted-foreground text-sm">
              Timeline analysis will appear here after processing.
            </p>
          </section>

          <section className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Citation Summary</h2>
            <p className="text-muted-foreground text-sm">
              Citation analysis will appear here after processing.
            </p>
          </section>

          <section className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Originality Indicators</h2>
            <p className="text-muted-foreground text-sm">
              Originality analysis will appear here after processing.
            </p>
          </section>

          <section className="p-6 border rounded-lg bg-yellow-50">
            <h2 className="text-xl font-semibold mb-4 text-yellow-800">⚠️ Important Notice</h2>
            <p className="text-sm text-yellow-700">
              This report provides evidence-based indicators of the writing process. 
              It does not constitute a definitive judgment on authorship. 
              All findings should be reviewed in context.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
