import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@authorship-receipt/db";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function DocumentsPage() {
  const user = await getCurrentUser();
  
  const documents = await prisma.document.findMany({
    where: { userId: user!.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Your Papers</h1>
        <a
          href="/documents/new"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
        >
          Start New Check
        </a>
      </div>

      {documents.length === 0 ? (
        <div className="bg-white rounded-lg border">
          <EmptyState
            icon="📄"
            title="No paper checks yet"
            description="Start your first check to see what your paper looks like before submission."
            action={{ label: "Start Paper Check", href: "/documents/new" }}
          />
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
                    Checked {new Date(doc.createdAt).toLocaleDateString()}
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
                  {doc.status === "PROCESSING" ? "Checking" : doc.status === "READY" ? "Ready" : doc.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
