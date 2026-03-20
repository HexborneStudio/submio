export default function PricingPage() {
  return (
    <main className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4">Pricing</h1>
        <p className="text-center text-muted-foreground mb-12">
          Simple, transparent pricing for students and educators.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="p-8 border rounded-lg">
            <h2 className="text-2xl font-bold mb-2">Free</h2>
            <p className="text-4xl font-bold mb-6">$0</p>
            <ul className="space-y-3 mb-8">
              <li>✓ 3 documents per month</li>
              <li>✓ Basic authorship receipt</li>
              <li>✓ Share links</li>
              <li>✓ PDF export (limited)</li>
            </ul>
            <a href="/signup" className="block text-center py-3 border rounded-md hover:bg-secondary">
              Get Started
            </a>
          </div>
          
          <div className="p-8 border-2 border-primary rounded-lg">
            <h2 className="text-2xl font-bold mb-2">Pro Student</h2>
            <p className="text-4xl font-bold mb-6">$9<span className="text-lg font-normal">/mo</span></p>
            <ul className="space-y-3 mb-8">
              <li>✓ Unlimited documents</li>
              <li>✓ Full authorship receipt</li>
              <li>✓ Unlimited share links</li>
              <li>✓ Unlimited PDF exports</li>
              <li>✓ Priority processing</li>
            </ul>
            <a href="/signup" className="block text-center py-3 bg-primary text-primary-foreground rounded-md hover:opacity-90">
              Get Started
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
