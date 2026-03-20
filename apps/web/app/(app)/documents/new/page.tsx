"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewDocumentPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"choose" | "upload" | "paste">("choose");
  const [title, setTitle] = useState("");
  const [pastedContent, setPastedContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1. Create document
      const docRes = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() || "Untitled Document" }),
      });

      if (!docRes.ok) {
        const data = await docRes.json();
        throw new Error(data.error || "Failed to create document");
      }

      const { document } = await docRes.json();

      // 2. Create version
      if (mode === "paste") {
        const verRes = await fetch(`/api/documents/${document.id}/versions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim() || "Untitled Document",
            content: pastedContent,
          }),
        });

        if (!verRes.ok) {
          const data = await verRes.json();
          throw new Error(data.error || "Failed to save content");
        }
      } else if (mode === "upload" && file) {
        const formData = new FormData();
        formData.append("file", file);

        const verRes = await fetch(`/api/documents/${document.id}/versions`, {
          method: "POST",
          body: formData,
        });

        if (!verRes.ok) {
          const data = await verRes.json();
          throw new Error(data.error || "Failed to upload file");
        }
      }

      router.push(`/documents/${document.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">New Document</h1>
        <p className="text-gray-600 mt-1">Create a new document to analyze</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Mode selector */}
      {mode === "choose" && (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setMode("paste")}
            className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition text-left"
          >
            <div className="text-3xl mb-3">📝</div>
            <div className="font-semibold text-gray-900">Paste Text</div>
            <div className="text-sm text-gray-500 mt-1">
              Paste your document text directly
            </div>
          </button>

          <button
            onClick={() => setMode("upload")}
            className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition text-left"
          >
            <div className="text-3xl mb-3">📁</div>
            <div className="font-semibold text-gray-900">Upload File</div>
            <div className="text-sm text-gray-500 mt-1">
              Upload a .docx or .pdf file
            </div>
          </button>
        </div>
      )}

      {/* Paste form */}
      {mode === "paste" && (
        <form onSubmit={handleCreateDoc} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Research Paper"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Content
            </label>
            <textarea
              value={pastedContent}
              onChange={(e) => setPastedContent(e.target.value)}
              placeholder="Paste your document text here..."
              rows={20}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {pastedContent.split(/\s+/).filter(Boolean).length} words
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading || !pastedContent.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {isLoading ? "Creating..." : "Create Document"}
            </button>
            <button
              type="button"
              onClick={() => setMode("choose")}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Back
            </button>
          </div>
        </form>
      )}

      {/* Upload form */}
      {mode === "upload" && (
        <form onSubmit={handleCreateDoc} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Research Paper"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <input
              type="file"
              id="file-upload"
              accept=".docx,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="text-4xl mb-3">
                {file ? "📄" : "📁"}
              </div>
              {file ? (
                <div className="font-medium text-gray-900">{file.name}</div>
              ) : (
                <>
                  <div className="font-medium text-gray-900">
                    Click to upload
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Supports .docx and .pdf (max 10MB)
                  </div>
                </>
              )}
            </label>
            {file && (
              <div className="text-sm text-gray-500 mt-2">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading || !file}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {isLoading ? "Uploading..." : "Upload & Create"}
            </button>
            <button
              type="button"
              onClick={() => setMode("choose")}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Back
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
