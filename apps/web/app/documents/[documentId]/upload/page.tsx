"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function UploadPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.documentId as string;

  const [activeTab, setActiveTab] = useState<"upload" | "paste">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (activeTab === "upload" && file) {
      setIsUploading(true);
      // TODO: Implement file upload
      console.log("Uploading file:", file.name);
      setIsUploading(false);
      router.push(`/documents/${documentId}`);
    } else if (activeTab === "paste" && pastedText.trim()) {
      setIsUploading(true);
      // TODO: Implement paste submission
      console.log("Pasting text:", pastedText.substring(0, 100));
      setIsUploading(false);
      router.push(`/documents/${documentId}`);
    }
  };

  return (
    <main className="min-h-screen">
      <header className="border-b">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4">
          <a href={`/documents/${documentId}`} className="text-xl font-bold">← Back</a>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Add Content</h1>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "upload" ? "bg-primary text-primary-foreground" : "border"
            }`}
          >
            Upload File
          </button>
          <button
            onClick={() => setActiveTab("paste")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "paste" ? "bg-primary text-primary-foreground" : "border"
            }`}
          >
            Paste Text
          </button>
        </div>

        {activeTab === "upload" ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-12 text-center">
              <input
                type="file"
                id="file-upload"
                accept=".docx,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-4xl mb-4">📁</div>
                <p className="text-lg font-medium">
                  {file ? file.name : "Click to upload"}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Supports .docx and .pdf
                </p>
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste your document text here..."
              className="w-full h-64 px-4 py-3 border rounded-md resize-none"
            />
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isUploading || (activeTab === "upload" && !file) || (activeTab === "paste" && !pastedText.trim())}
          className="w-full mt-6 py-3 bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50"
        >
          {isUploading ? "Processing..." : "Submit for Analysis"}
        </button>
      </div>
    </main>
  );
}
