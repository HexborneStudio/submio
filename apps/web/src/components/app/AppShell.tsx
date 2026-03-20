"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface AppShellProps {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
  };
  children: React.ReactNode;
}

export default function AppShell({ user, children }: AppShellProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/dashboard" className="text-xl font-bold text-blue-600">
            Authorship Receipt
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/documents" className="text-sm hover:text-blue-600">
              Documents
            </Link>
            <Link href="/settings" className="text-sm hover:text-blue-600">
              Settings
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {user.name || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-red-600"
              >
                Sign out
              </button>
            </div>
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
