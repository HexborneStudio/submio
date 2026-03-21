import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@authorship-receipt/db";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  
  const documents = await prisma.document.findMany({
    where: { userId: user!.id },
    orderBy: { updatedAt: "desc" },
    take: 5,
  });

  const stats = {
    total: await prisma.document.count({ where: { userId: user!.id } }),
    processing: await prisma.document.count({ where: { userId: user!.id, status: "PROCESSING" } }),
    ready: await prisma.document.count({ where: { userId: user!.id, status: "READY" } }),
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Your Papers</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {user!.name || user!.email}
        </p>
      </div>

      {/* Onboarding banner for new users */}
      {documents.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
          <div className="flex items-start gap-3">
            <span className="text-2xl">👋</span>
            <div>
              <h2 className="font-semibold text-blue-900 mb-1">Welcome to Paper Check</h2>
              <p className="text-blue-800 text-sm mb-3">
                Upload or paste your first paper to check for citation gaps, source signals,
                and formatting issues — before you submit to your instructor.
              </p>
              <a
                href="/documents/new"
                className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                Start Your First Paper Check
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-500 mt-1">Total Papers</div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="text-3xl font-bold text-yellow-600">{stats.processing}</div>
          <div className="text-sm text-gray-500 mt-1">Checking</div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="text-3xl font-bold text-green-600">{stats.ready}</div>
          <div className="text-sm text-gray-500 mt-1">Ready</div>
        </div>
      </div>

      {/* Recent Papers */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Checks</h2>
          <a href="/documents" className="text-sm text-blue-600 hover:underline">
            View all
          </a>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-dashed">
            <p className="text-gray-500 mb-4">No papers checked yet</p>
            <a
              href="/documents/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              Start Your First Paper Check
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-lg border overflow-hidden">
            {documents.map((doc) => (
              <a
                key={doc.id}
                href={`/documents/${doc.id}`}
                className="flex items-center justify-between px-6 py-4 border-b last:border-b-0 hover:bg-gray-50"
              >
                <div>
                  <div className="font-medium text-gray-900">{doc.title}</div>
                  <div className="text-sm text-gray-500">
                    Checked {new Date(doc.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    doc.status === "READY"
                      ? "bg-green-100 text-green-800"
                      : doc.status === "PROCESSING"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {doc.status === "PROCESSING" ? "Checking" : doc.status === "READY" ? "Ready" : doc.status}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
