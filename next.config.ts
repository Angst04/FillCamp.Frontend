import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
};

export default nextConfig;
