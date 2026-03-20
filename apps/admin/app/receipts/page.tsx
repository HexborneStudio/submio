import { listReceipts } from "@/lib/adminQueries";

export default async function ReceiptsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const { page: pageStr, search } = await searchParams;
  const page = parseInt(pageStr || "1");
  const { receipts, total, pages } = await listReceipts({ page, search }) as {
    receipts: Array<{
      id: string;
      status: string;
      createdAt: Date;
      document: { id: string; title: string; user: { email: string } };
    }>;
    total: number;
    page: number;
    pages: number;
  };

  const statusColors: Record<string, string> = {
    AVAILABLE: "bg-green-100 text-green-700",
    GENERATING: "bg-yellow-100 text-yellow-700",
    EXPIRED: "bg-gray-100 text-gray-600",
    REVOKED: "bg-red-100 text-red-700",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Receipts</h1>
        <span className="text-gray-500 text-sm">
          {total.toLocaleString()} total
        </span>
      </div>

      {/* Search */}
      <form className="mb-4 flex gap-2">
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Search by document title..."
          className="px-3 py-2 border rounded w-64 text-sm"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded"
        >
          Search
        </button>
        {search && (
          <a
            href="/receipts"
            className="px-4 py-2 border text-sm rounded hover:bg-gray-50"
          >
            Clear
          </a>
        )}
      </form>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Document
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Owner
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Status
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Generated
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                ID
              </th>
            </tr>
          </thead>
          <tbody>
            {receipts.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-8 text-gray-400"
                >
                  No receipts found
                </td>
              </tr>
            ) : (
              receipts.map((r) => (
                <tr
                  key={r.id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium">{r.document.title}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {r.document.user.email}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        statusColors[r.status] || "bg-gray-100"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                    {r.id.slice(0, 8)}...
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
