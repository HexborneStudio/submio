"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(searchParams.get("error") || "");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [debugLink, setDebugLink] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    setDebugLink("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setSuccess(data.message);
      
      if (data.debugLink) {
        setDebugLink(data.debugLink);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
          {error === "invalid_token" && "This magic link has expired or already been used. Please request a new one."}
          {error === "missing_token" && "No token provided."}
          {error === "user_not_found" && "User not found."}
          {!["invalid_token", "missing_token", "user_not_found"].includes(error) && error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
          {success}
        </div>
      )}

      {debugLink && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm">
          <p className="font-medium text-yellow-800 mb-1">🔗 Dev Mode — Click the link:</p>
          <a href={debugLink} className="text-blue-600 underline break-all">
            {debugLink}
          </a>
        </div>
      )}

      {!success && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {isLoading ? "Sending..." : "Send Magic Link"}
          </button>
        </form>
      )}

      {success && (
        <div className="text-center text-sm text-gray-600">
          <p>Didn't receive it? Check your spam folder or try again.</p>
        </div>
      )}
    </>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Authorship Receipt
          </Link>
          <h1 className="text-2xl font-bold mt-6">Sign in to your account</h1>
          <p className="text-gray-600 mt-2">
            We'll send you a magic link to your email
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border">
          <Suspense fallback={<div className="text-center text-gray-500">Loading...</div>}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="text-center mt-6 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
