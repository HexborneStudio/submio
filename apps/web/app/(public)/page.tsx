export default function HomePage() {
  return (
    <main className="min-h-screen">
      <header className="border-b">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="text-xl font-bold">Authorship Receipt</div>
          <div className="flex gap-6">
            <a href="/pricing" className="hover:text-primary">Pricing</a>
            <a href="/login" className="hover:text-primary">Login</a>
            <a href="/signup" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90">
              Get Started
            </a>
          </div>
        </nav>
      </header>

      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Prove How Your Document Was Written
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          A writing-process transparency platform that helps students demonstrate authorship 
          and helps educators review evidence.
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/signup" className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:opacity-90">
            Get Started Free
          </a>
          <a href="/pricing" className="px-6 py-3 border rounded-md hover:bg-secondary">
            View Pricing
          </a>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 border rounded-lg">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-xl font-semibold mb-2">Upload or Write</h3>
            <p className="text-muted-foreground">
              Submit your document or paste your text. We analyze the writing process evidence.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Get Evidence</h3>
            <p className="text-muted-foreground">
              Receive a detailed authorship receipt with timeline, citations, and indicators.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <div className="text-4xl mb-4">📤</div>
            <h3 className="text-xl font-semibold mb-2">Share with Educators</h3>
            <p className="text-muted-foreground">
              Export as PDF or share a link. Educators can review the evidence.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 flex justify-between text-sm text-muted-foreground">
          <span>© 2026 Authorship Receipt</span>
          <div className="flex gap-4">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
