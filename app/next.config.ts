import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for custom server.ts
  experimental: {},
  // Allow cross-origin requests from socket
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, PATCH, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, x-admin-key" },
        ],
      },
    ];
  },
};

export default nextConfig;
