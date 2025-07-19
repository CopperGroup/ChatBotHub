import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  devIndicators: false,
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "frame-ancestors https://*.myshopify.com https://admin.shopify.com;",
        },
      ],
    },
  ],
};

export default nextConfig;

