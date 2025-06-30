import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Set base path if deploying to a subdirectory (optional)
  // basePath: '/kulhudhufushidive',
  
  // Ensure trailing slash for GitHub Pages
  trailingSlash: true,
  
  // Disable server-side features for static export
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
