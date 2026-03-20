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
};

export default nextConfig;
