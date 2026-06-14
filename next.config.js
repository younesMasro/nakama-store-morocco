/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

module.exports = nextConfig;
