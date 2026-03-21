import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold">Paper Check</Link>
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Sign in</Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-center mb-3">Straightforward Pricing</h1>
        <p className="text-gray-500 text-center mb-12">Start free. Upgrade when you need more features.</p>

        {/* Free Tier */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
          <div className="p-6 border-b">
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-bold">Free</h2>
              <div className="text-3xl font-bold">$0</div>
            </div>
            <p className="text-gray-500 text-sm mt-1">Forever free — no credit card required</p>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              {[
                "Up to 5 paper checks per month",
                "Full citation and source analysis",
                "Submission readiness summary",
                "Detailed report view",
                "PDF export of your report",
                "Share report with your instructor",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span className="text-gray-600">{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="mt-6 block w-full text-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
            >
              Start Free
            </Link>
          </div>
        </div>

        {/* Pro Tier */}
        <div className="bg-white rounded-lg border-2 border-blue-200 overflow-hidden mb-6 relative">
          <div className="absolute -top-3 left-4 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
            Recommended
          </div>
          <div className="p-6 border-b">
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-bold">Pro</h2>
              <div className="text-3xl font-bold">$9<span className="text-base font-normal text-gray-500">/month</span></div>
            </div>
            <p className="text-gray-500 text-sm mt-1">For students who need more</p>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              {[
                "Unlimited paper checks",
                "Faster results",
                "Deeper citation analysis",
                "Full history of past checks",
                "Multiple instructor shares",
                "Email support",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span className="text-gray-600">{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="mt-6 block w-full text-center px-4 py-2 border border-blue-600 text-blue-600 font-medium rounded-md hover:bg-blue-50"
            >
              Join Waitlist
            </Link>
          </div>
        </div>

        {/* Features comparison */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold mb-4">What every check includes:</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              "Reads your paper (PDF or DOCX)",
              "Finds all citations and references",
              "Checks your bibliography",
              "Word count and section breakdown",
              "Analyzes paper structure",
              "Flags source patterns to review",
              "Shows your submission confidence",
              "Generates a shareable report link",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-green-500">✓</span>
                {f}
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-gray-400 text-sm mt-8">
          Questions? <Link href="/login" className="text-blue-600 hover:underline">Get in touch</Link>
        </p>
      </div>
    </div>
  );
}
