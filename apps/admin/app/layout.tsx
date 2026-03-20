import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin - Authorship Receipt",
  description: "Internal admin dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        <div className="flex">
          <aside className="w-64 border-r min-h-screen p-4">
            <div className="font-bold mb-8">Admin Dashboard</div>
            <nav className="space-y-2">
              <Link href="/admin" className="block px-4 py-2 rounded-md hover:bg-secondary">
                Overview
              </Link>
              <Link href="/admin/users" className="block px-4 py-2 rounded-md hover:bg-secondary">
                Users
              </Link>
              <Link href="/admin/receipts" className="block px-4 py-2 rounded-md hover:bg-secondary">
                Receipts
              </Link>
              <Link href="/admin/jobs" className="block px-4 py-2 rounded-md hover:bg-secondary">
                Jobs
              </Link>
              <Link href="/admin/logs" className="block px-4 py-2 rounded-md hover:bg-secondary">
                Logs
              </Link>
              <Link href="/admin/support" className="block px-4 py-2 rounded-md hover:bg-secondary">
                Support
              </Link>
            </nav>
          </aside>
          <main className="flex-1 p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
