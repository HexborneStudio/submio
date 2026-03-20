export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <header className="border-b">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4">
          <a href="/" className="text-xl font-bold">Authorship Receipt</a>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="text-muted-foreground">
              We collect information you provide directly, including documents you upload, 
              text you paste, and account information when you create an account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p className="text-muted-foreground">
              We use the information to analyze writing process evidence, generate authorship 
              receipts, and provide our transparency services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate security measures to protect your documents and 
              personal information from unauthorized access.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Contact</h2>
            <p className="text-muted-foreground">
              For privacy-related questions, contact us at privacy@authorshipreceipt.com
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
