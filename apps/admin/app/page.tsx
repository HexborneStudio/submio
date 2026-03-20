import { getAdminStats } from "@/lib/adminQueries";
import Link from "next/link";

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      href: "/users",
    },
    {
      label: "Total Documents",
      value: stats.totalDocuments,
      href: "/users",
    },
    {
      label: "Total Receipts",
      value: stats.totalReceipts,
      href: "/receipts",
    },
    {
      label: "Pending Jobs",
      value: stats.pendingJobs,
      href: "/jobs?status=PENDING",
      highlight: stats.pendingJobs > 0,
    },
    {
      label: "Failed Jobs",
      value: stats.failedJobs,
      href: "/jobs?status=FAILED",
      highlight: stats.failedJobs > 0,
    },
    {
      label: "Reviews (7d)",
      value: stats.recentReviews,
      href: "/support",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Overview</h1>
      <div className="grid grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`bg-white rounded-lg border p-6 hover:border-gray-400 transition-colors ${
              card.highlight ? "border-red-300 bg-red-50" : ""
            }`}
          >
            <div className="text-3xl font-bold mb-1">
              {card.value.toLocaleString()}
            </div>
            <div className="text-gray-500 text-sm">{card.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
