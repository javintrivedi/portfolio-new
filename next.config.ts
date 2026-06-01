import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compress responses with gzip — cuts transfer size ~70%
  compress: true,

  // Remove X-Powered-By header
  poweredByHeader: false,

  images: {
    // Allow GitHub OG images and Unsplash (used in FlowingMenu project items)
    remotePatterns: [
      { protocol: 'https', hostname: 'opengraph.githubassets.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },

  experimental: {
    // Optimize CSS (critters for critical CSS inlining)
    optimizeCss: true,
  },
};

export default nextConfig;
