import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable image optimization domains for now
  images: {
    domains: [],
  },
  // Environment variable exposure
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // Transpile workspace packages — these use src/ exports that need Next.js
  // to process them through its own transpiler rather than resolving to
  // bare specifiers that Node.js can't handle during static generation.
  transpilePackages: [
    "@authorship-receipt/db",
    "@authorship-receipt/shared",
    "@authorship-receipt/analysis",
    "@authorship-receipt/config",
  ],
  // Mark @prisma/client as server-only to prevent it being bundled for the
  // client — it must only run in server contexts (API routes, Server Components).
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
