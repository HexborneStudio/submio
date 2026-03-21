export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <header className="border-b">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4">
          <a href="/" className="text-xl font-bold">Paper Check</a>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using Paper Check, you agree to be bound by these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Use of Service</h2>
            <p className="text-muted-foreground">
              Paper Check is designed to help students identify issues before submission. 
              You agree to use the service only for its intended purpose and not to 
              misrepresent the outputs as definitive judgments.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Disclaimer</h2>
            <p className="text-muted-foreground">
              Our service provides evidence-based indicators, not definitive conclusions 
              about document authorship. Results should be reviewed in appropriate context.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Contact</h2>
            <p className="text-muted-foreground">
              For questions about these terms, contact us at legal@authorshipreceipt.com
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
