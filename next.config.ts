import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Set base path for GitHub Pages subdirectory deployment
  basePath: '/kulhudhufushidive.mv',
  
  // Set asset prefix to match base path
  assetPrefix: '/kulhudhufushidive.mv',
  
  // Ensure trailing slash for GitHub Pages
  trailingSlash: true,
  
  // Disable server-side features for static export
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
