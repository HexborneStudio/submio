import type { Metadata } from "next";
import "./globals.css";
import { AdminSidebar } from "@/components/AdminSidebar";
import { getAdminSession } from "@/lib/adminAuth";

export const metadata: Metadata = {
  title: "Admin — Authorship Receipt",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session = null;
  try {
    session = await getAdminSession();
  } catch {
    session = null;
  }

  if (!session) {
    return (
      <html lang="en">
        <body className="min-h-screen bg-gray-100">{children}</body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen bg-gray-100">
          <AdminSidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
