/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },

  // Force a unique build ID for every deployment (cache busting)
  generateBuildId: async () => {
    // Use timestamp + random string for better cache busting
    // This ensures every build has a unique ID
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `build-${timestamp}-${random}`;
  },

  // Cache-control headers for better cache management
  // IMPORTANT: More specific patterns must come FIRST (Next.js evaluates in order)
  async headers() {
    return [
      {
        // Next.js static assets with content hashes - can be cached forever
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Static files with extensions in public folder - cache with versioning
        source: "/:path*\\.(svg|jpg|jpeg|png|gif|ico|webp|woff|woff2|ttf|eot)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Public assets folder - long cache
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, must-revalidate",
          },
        ],
      },
      {
        // API routes - no cache
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, max-age=0",
          },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
      {
        // HTML pages - aggressive no-cache to ensure fresh content
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
          { 
            key: "X-Content-Type-Options", 
            value: "nosniff" 
          },
        ],
      },
    ];
  },

  // Enable SWC minification for better performance
  swcMinify: true,

  // Compress responses
  compress: true,

  // Production source maps can be disabled for security
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;