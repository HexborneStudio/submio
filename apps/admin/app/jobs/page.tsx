import { listJobs } from "@/lib/adminQueries";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const { page: pageStr, status } = await searchParams;
  const page = parseInt(pageStr || "1");
  const { jobs, total, pages } = await listJobs({ page, status }) as {
    jobs: Array<{
      id: string;
      status: string;
      progress: number;
      attempts: number;
      maxAttempts: number;
      error: string | null;
      createdAt: Date;
      updatedAt: Date;
    }>;
    total: number;
    page: number;
    pages: number;
  };

  const statusColors: Record<string, string> = {
    PENDING: "bg-gray-100 text-gray-600",
    PROCESSING: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-green-100 text-green-700",
    FAILED: "bg-red-100 text-red-700",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Analysis Jobs</h1>
        <span className="text-gray-500 text-sm">
          {total.toLocaleString()} total
        </span>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 mb-4">
        {["", "PENDING", "PROCESSING", "COMPLETED", "FAILED"].map((s) => (
          <a
            key={s || "all"}
            href={s ? `?status=${s}` : "/jobs"}
            className={`px-3 py-1 border rounded text-sm ${
              status === s || (!status && s === "")
                ? "bg-gray-900 text-white border-gray-900"
                : ""
            }`}
          >
            {s || "All"}
          </a>
        ))}
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                ID
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Status
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Progress
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Attempts
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Error
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Updated
              </th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-8 text-gray-400"
                >
                  No jobs found
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr
                  key={job.id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-mono text-xs">
                    {job.id.slice(0, 12)}...
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        statusColors[job.status] || ""
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{job.progress}%</td>
                  <td className="px-4 py-3">
                    {job.attempts}/{job.maxAttempts}
                  </td>
                  <td className="px-4 py-3 text-red-600 text-xs max-w-xs truncate">
                    {job.error || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(job.updatedAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex gap-2 mt-4">
          {page > 1 && (
            <a
              href={`?page=${page - 1}${status ? `&status=${status}` : ""}`}
              className="px-3 py-1 border rounded text-sm"
            >
              Previous
            </a>
          )}
          <span className="px-3 py-1 text-sm text-gray-500">
            Page {page} of {pages}
          </span>
          {page < pages && (
            <a
              href={`?page=${page + 1}${status ? `&status=${status}` : ""}`}
              className="px-3 py-1 border rounded text-sm"
            >
              Next
            </a>
          )}
        </div>
      )}
    </div>
  );
}
