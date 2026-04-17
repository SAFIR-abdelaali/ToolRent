/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: [
      'dummy-cloud-storage.com',
      's3.amazonaws.com',
      'amazonaws.com',
      'localhost',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_AUTH_API_URL: process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:8000',
    NEXT_PUBLIC_TOOLS_API_URL: process.env.NEXT_PUBLIC_TOOLS_API_URL || 'http://localhost:8001',
  },
};

module.exports = nextConfig;
