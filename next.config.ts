import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.7"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.anelka.life",
      },
      {
        protocol: "https",
        hostname: "logo.clearbit.com",
      },
    ],
  },
};

export default nextConfig;