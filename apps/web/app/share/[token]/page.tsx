"use client";

import { useParams } from "next/navigation";

export default function SharePage() {
  const params = useParams();
  const token = params.token;

  return (
    <main className="min-h-screen">
      <header className="border-b">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4">
          <span className="text-xl font-bold">Authorship Receipt</span>
          <span className="text-sm text-muted-foreground">Educator Review</span>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Shared Receipt</h1>
          <p className="text-muted-foreground">
            Share Token: {token}
          </p>
        </div>

        <div className="space-y-6">
          <section className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Document Overview</h2>
            <p className="text-muted-foreground text-sm">
              Receipt data will appear here.
            </p>
          </section>

          <section className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Writing Timeline</h2>
            <p className="text-muted-foreground text-sm">
              Timeline evidence will appear here.
            </p>
          </section>

          <section className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Citations & Sources</h2>
            <p className="text-muted-foreground text-sm">
              Citation analysis will appear here.
            </p>
          </section>

          <section className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Educator Review</h2>
            <textarea
              placeholder="Add review notes..."
              className="w-full h-32 px-4 py-3 border rounded-md resize-none mb-4"
            />
            <div className="flex gap-4">
              <button className="flex-1 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90">
                Mark Reviewed
              </button>
              <button className="flex-1 py-2 border rounded-md hover:bg-secondary">
                Request More Info
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
