'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Overview", icon: "📊" },
  { href: "/users", label: "Users", icon: "👥" },
  { href: "/receipts", label: "Receipts", icon: "🧾" },
  { href: "/jobs", label: "Jobs", icon: "⚡" },
  { href: "/logs", label: "Logs", icon: "📋" },
  { href: "/support", label: "Support", icon: "🆘" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-gray-900 text-white flex flex-col">
      <div className="px-4 py-4 border-b border-gray-700">
        <div className="text-sm font-bold">Authorship Receipt</div>
        <div className="text-xs text-gray-400">Admin Console</div>
      </div>
      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 text-sm ${
                active
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-3 border-t border-gray-700">
        <form action="/api/admin/logout" method="POST">
          <button
            type="submit"
            className="text-xs text-gray-400 hover:text-white"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
