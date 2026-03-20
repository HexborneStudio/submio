import { getSupportOverview } from "@/lib/adminQueries";

export default async function SupportPage() {
  const support = await getSupportOverview() as {
    failedJobs: Array<{ id: string; status: string; error: string | null; attempts: number; updatedAt: Date; documentId: string; versionId: string }>;
    recentExports: Array<{ id: string; format: string; status: string; createdAt: Date; userId: string }>;
    recentSharedLinks: Array<{ id: string; status: string; createdAt: Date; receiptId: string }>;
    recentReviews: Array<{ id: string; reviewerName: string; status: string; createdAt: Date; receiptId: string; note: string }>;
    pendingJobs: number;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Support Dashboard</h1>

      <div className="grid grid-cols-2 gap-6">
        {/* Failed Jobs */}
        <section>
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            ⚠️ Failed Jobs ({support.failedJobs.length})
          </h2>
          <div className="bg-white rounded-lg border overflow-hidden">
            {support.failedJobs.length === 0 ? (
              <div className="p-4 text-center text-gray-400 text-sm">
                No failed jobs
              </div>
            ) : (
              <table className="w-full text-sm">
                <tbody>
                  {support.failedJobs.map((job) => (
                    <tr key={job.id} className="border-b last:border-0">
                      <td className="px-4 py-2">
                        <div className="font-mono text-xs">
                          {job.id.slice(0, 12)}...
                        </div>
                        <div className="text-red-600 text-xs truncate max-w-xs">
                          {job.error}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-gray-400 text-xs whitespace-nowrap">
                        {new Date(job.updatedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Recent Educator Reviews */}
        <section>
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            📝 Recent Educator Reviews ({support.recentReviews.length})
          </h2>
          <div className="bg-white rounded-lg border overflow-hidden">
            {support.recentReviews.length === 0 ? (
              <div className="p-4 text-center text-gray-400 text-sm">
                No reviews yet
              </div>
            ) : (
              <table className="w-full text-sm">
                <tbody>
                  {support.recentReviews.map((r) => (
                    <tr key={r.id} className="border-b last:border-0">
                      <td className="px-4 py-2">
                        <div className="font-medium">{r.reviewerName}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">
                          {r.note}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            r.status === "REVIEWED"
                              ? "bg-green-100 text-green-700"
                              : r.status === "NEEDS_FOLLOW_UP"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Pending Jobs */}
        <section>
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            ⏳ Pending Jobs ({support.pendingJobs})
          </h2>
          <div className="bg-white rounded-lg border p-4 text-center text-sm text-gray-400">
            {support.pendingJobs === 0
              ? "No pending jobs"
              : `${support.pendingJobs} jobs waiting to be processed`}
          </div>
        </section>

        {/* Recent Exports */}
        <section>
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            📤 Recent Exports ({support.recentExports.length})
          </h2>
          <div className="bg-white rounded-lg border overflow-hidden">
            {support.recentExports.length === 0 ? (
              <div className="p-4 text-center text-gray-400 text-sm">
                No recent exports
              </div>
            ) : (
              <table className="w-full text-sm">
                <tbody>
                  {support.recentExports.map((exp) => (
                    <tr key={exp.id} className="border-b last:border-0">
                      <td className="px-4 py-2">
                        <div className="font-mono text-xs">{exp.format}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(exp.createdAt).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            exp.status === "COMPLETED"
                              ? "bg-green-100 text-green-700"
                              : exp.status === "FAILED"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {exp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
