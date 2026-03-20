import { listAuditLogs } from "@/lib/adminQueries";

export default async function LogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; eventType?: string }>;
}) {
  const { page: pageStr, eventType } = await searchParams;
  const page = parseInt(pageStr || "1");
  const { logs, total, pages } = await listAuditLogs({ page, eventType }) as {
    logs: Array<{
      id: string;
      action: string;
      entity: string | null;
      entityId: string | null;
      ipAddress: string | null;
      createdAt: Date;
      metadata: Record<string, unknown> | null;
    }>;
    total: number;
    page: number;
    pages: number;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <span className="text-gray-500 text-sm">
          {total.toLocaleString()} total
        </span>
      </div>

      {logs.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center text-gray-400">
          No audit logs yet. Audit logging coverage is currently limited.
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-white rounded-lg border px-4 py-3 text-sm"
            >
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono">
                  {log.action}
                </span>
                <span className="text-gray-400 text-xs">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
                {log.entity && (
                  <span className="text-gray-400 text-xs">
                    {log.entity}:{log.entityId?.slice(0, 8)}
                  </span>
                )}
              </div>
              {log.ipAddress && (
                <div className="text-gray-500 text-xs mt-1">
                  IP: {log.ipAddress}
                </div>
              )}
              {log.metadata && typeof log.metadata === "object" && (
                <pre className="text-xs text-gray-400 mt-1 bg-gray-50 p-2 rounded overflow-auto max-h-32">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="flex gap-2 mt-4">
          {page > 1 && (
            <a
              href={`?page=${page - 1}`}
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
              href={`?page=${page + 1}`}
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
