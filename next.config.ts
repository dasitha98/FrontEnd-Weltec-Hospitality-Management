import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,  // Enable React Strict Mode for catching potential issues
  swcMinify: true,        // Enable SWC minification for faster build
  output: "standalone",   // Generate a standalone output for easy deployment
  images: {
    domains: ['example.com'],  // Specify allowed image domains
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,  // Public environment variables
  },
};

export default nextConfig;
