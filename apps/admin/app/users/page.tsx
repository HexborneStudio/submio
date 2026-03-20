import { listUsers } from "@/lib/adminQueries";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const { page: pageStr, search } = await searchParams;
  const page = parseInt(pageStr || "1");
  const { users, total, pages } = await listUsers({ page, search }) as {
    users: Array<{
      id: string;
      email: string;
      name: string | null;
      role: string;
      createdAt: Date;
      _count: { documents: number };
    }>;
    total: number;
    page: number;
    pages: number;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
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
          placeholder="Search by email or name..."
          className="px-3 py-2 border rounded w-64 text-sm"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded"
        >
          Search
        </button>
        {search && (
          <a href="/users" className="px-4 py-2 border text-sm rounded hover:bg-gray-50">
            Clear
          </a>
        )}
      </form>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Email
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Name
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Role
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Documents
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Joined
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-8 text-gray-400"
                >
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.name || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">{user._count.documents}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex gap-2 mt-4">
          {page > 1 && (
            <a
              href={`?page=${page - 1}${search ? `&search=${search}` : ""}`}
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
              href={`?page=${page + 1}${search ? `&search=${search}` : ""}`}
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
