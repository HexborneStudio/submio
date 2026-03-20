"use client";

export default function SettingsPage() {
  return (
    <main className="min-h-screen">
      <header className="border-b">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4">
          <a href="/dashboard" className="text-xl font-bold">← Back to Dashboard</a>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="space-y-6">
          <section className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Account</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  defaultValue="user@example.com"
                  className="w-full px-4 py-2 border rounded-md"
                  disabled
                />
              </div>
            </div>
          </section>

          <section className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Email notifications</span>
                <input type="checkbox" className="w-5 h-5" defaultChecked />
              </div>
            </div>
          </section>

          <button className="w-full py-3 bg-destructive text-destructive-foreground rounded-md hover:opacity-90">
            Delete Account
          </button>
        </div>
      </div>
    </main>
  );
}
