import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-lg font-bold">Authorship Receipt</div>
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
            Proof of How Your Document Was Written
          </h1>
          <p className="text-xl text-gray-500 mb-8 leading-relaxed">
            Authorship Receipt generates evidence-based transparency reports for academic documents.
            Show educators how your work was created — without making definitive claims.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/signup" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">
              Create Your First Receipt
            </Link>
            <Link href="/pricing" className="px-6 py-3 border text-gray-700 font-medium rounded-md hover:bg-gray-50">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50 border-t">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-3 gap-8">
            {[
              { step: "1", title: "Upload or Paste", desc: "Submit your document — as a file (.docx, .pdf) or pasted text." },
              { step: "2", title: "Analysis Runs", desc: "The system extracts text, detects citation patterns, and builds authorship signals." },
              { step: "3", title: "Get Your Receipt", desc: "A structured receipt documents what was found. Share it with educators." },
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

      {/* What is an Authorship Receipt */}
      <section className="py-16 border-t">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">What is an Authorship Receipt?</h2>
          <div className="space-y-6">
            <p className="text-gray-600">
              An <strong>Authorship Receipt</strong> is a document that records evidence about how
              an academic paper was created. It extracts and organizes signals from your document
              — citation patterns, structural indicators, and source references.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
              <p className="text-blue-900 text-sm font-medium mb-2">Evidence-Based, Not Definitive</p>
              <p className="text-blue-800 text-sm">
                The receipt surfaces <strong>indicators</strong> — it does not make judgments about
                misconduct or definitively declare a document &quot;clean&quot; or &quot;problematic.&quot;
                Think of it as a transparency instrument, not a verdict.
              </p>
            </div>
            <p className="text-gray-600">
              When you share a receipt with an educator, they see the same evidence you do.
              It opens a conversation about process — not a accusation.
            </p>
          </div>
        </div>
      </section>

      {/* Caution Section */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="text-3xl mb-3">⚠️</div>
          <h2 className="text-xl font-bold mb-3">Important: What This Is Not</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Authorship Receipt is <strong>not</strong> a plagiarism checker, not a cheating detection tool,
            and does <strong>not</strong> make academic integrity judgments. It is a transparency tool
            that supports honest academic practices. All findings are heuristic and should be reviewed
            in appropriate context by educators.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t">
        <div className="max-w-xl mx-auto text-center px-4">
          <h2 className="text-2xl font-bold mb-3">Ready to get started?</h2>
          <p className="text-gray-500 mb-6">Create your first receipt in minutes.</p>
          <Link href="/signup" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between text-sm text-gray-400">
          <span>© 2026 Authorship Receipt</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gray-600">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-600">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
