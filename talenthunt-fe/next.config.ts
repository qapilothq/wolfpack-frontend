import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    // If you're using remote images, add their domains here
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Configure this based on your image domains
      },
    ],
  },
};

export default nextConfig;
