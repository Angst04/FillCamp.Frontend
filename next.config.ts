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
  },
  async redirects() {
    return [
      {
        source: '/order/:orderId/success',
        destination: 'https://t.me/FirstSlattBot?startapp=order_:orderId',
        permanent: false,
      },
    ]
  },
};

export default nextConfig;
