import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io"
      }
    ]
  }
  // No rewrites needed - nginx handles /api/v1/* routing to backend
  // Next.js API routes in /app/api/* are handled by Next.js server
  // Enable standalone output for Docker
};

export default nextConfig;
