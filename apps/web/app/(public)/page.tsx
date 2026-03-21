import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-lg font-bold">Paper Check</div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Sign in</Link>
            <Link href="/signup" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Know What Your Paper Looks Like Before You Submit
          </h1>
          <p className="text-xl text-gray-500 mb-8 leading-relaxed">
            Catch citation gaps, source signals, and formatting issues before your professor does.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/signup" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">
              Start a Free Paper Check
            </Link>
            <Link href="#how-it-works" className="px-6 py-3 border text-gray-700 font-medium rounded-md hover:bg-gray-50">
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-gray-50 border-t">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-3 gap-8">
            {[
              { step: "1", title: "Upload or Paste Your Paper", desc: "Submit your paper — as a file (.docx, .pdf) or pasted text." },
              { step: "2", title: "We Check It", desc: "We analyze citation patterns, source references, and formatting for potential issues." },
              { step: "3", title: "Get Your Report", desc: "Receive a detailed report — fix issues before you submit." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-16 border-t">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">What You Get</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              "Citation coverage analysis",
              "Source signal detection",
              "Formatting checks",
              "Plain-English explanations",
              "Detailed report you can share with your instructor",
              "PDF export for your records",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-green-500">✓</span>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Caution Section */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="text-3xl mb-3">⚠️</div>
          <h2 className="text-xl font-bold mb-3">Important: What This Is Not</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Paper Check is <strong>not</strong> a plagiarism checker, not a cheating detection tool,
            and does <strong>not</strong> make academic integrity judgments. It is a transparency tool
            that helps <strong>you</strong> catch issues before submission. Think of it as a
            pre-flight check for your paper — giving you a chance to fix problems first.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t">
        <div className="max-w-xl mx-auto text-center px-4">
          <h2 className="text-2xl font-bold mb-3">Start Checking — It&apos;s Free</h2>
          <p className="text-gray-500 mb-6">Upload your paper and see what issues you can fix before submission.</p>
          <Link href="/signup" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">
            Start Your First Paper Check
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between text-sm text-gray-400">
          <span>© 2026 Paper Check</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gray-600">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-600">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
