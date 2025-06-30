import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standard Next.js configuration for Vercel
  images: {
    unoptimized: false, // Enable image optimization on Vercel
  },
  
  // Enable server-side features for Vercel
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
