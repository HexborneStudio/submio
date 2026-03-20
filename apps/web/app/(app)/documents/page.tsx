import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@authorship-receipt/db";

export default async function DocumentsPage() {
  const user = await getCurrentUser();
  
  const documents = await prisma.document.findMany({
    where: { userId: user!.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
        <a
          href="/documents/new"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
        >
          New Document
        </a>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-dashed">
          <div className="text-4xl mb-4">📄</div>
          <p className="text-gray-500 mb-4">No documents yet</p>
          <p className="text-sm text-gray-400 mb-6">
            Upload a document or paste your text to get started
          </p>
          <a
            href="/documents/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            Create your first document
          </a>
        </div>
      ) : (
        <div className="grid gap-4">
          {documents.map((doc) => (
            <Link
              key={doc.id}
              href={`/documents/${doc.id}`}
              className="block bg-white p-6 rounded-lg border hover:border-blue-300 hover:shadow-sm transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Created {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    doc.status === "READY"
                      ? "bg-green-100 text-green-800"
                      : doc.status === "PROCESSING"
                      ? "bg-yellow-100 text-yellow-800"
                      : doc.status === "FAILED"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {doc.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
