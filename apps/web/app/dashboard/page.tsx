"use client";

import { useState, useEffect } from "react";

interface Document {
  id: string;
  title: string;
  status: "draft" | "processing" | "ready";
  createdAt: string;
}

export default function DashboardPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch user's documents
    setIsLoading(false);
  }, []);

  return (
    <main className="min-h-screen">
      <header className="border-b">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4">
          <a href="/" className="text-xl font-bold">Authorship Receipt</a>
          <div className="flex items-center gap-4">
            <a href="/settings" className="hover:text-primary">Settings</a>
            <span className="text-sm text-muted-foreground">user@example.com</span>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Documents</h1>
          <a href="/documents/new" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90">
            New Document
          </a>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">No documents yet</p>
            <a href="/documents/new" className="text-primary hover:underline">
              Create your first document
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <a
                key={doc.id}
                href={`/documents/${doc.id}`}
                className="block p-6 border rounded-lg hover:bg-secondary transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{doc.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Created {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      doc.status === "ready"
                        ? "bg-green-100 text-green-800"
                        : doc.status === "processing"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
