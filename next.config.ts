import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standard build so /api/chat (Ask the SI) works on Vercel; pages are static.
  reactStrictMode: true,
};

export default nextConfig;
