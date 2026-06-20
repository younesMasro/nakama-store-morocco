/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "admin.nakamastore.ma",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "nakamastore.ma",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/images/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
