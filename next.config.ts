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
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "bagui.vercel.app",
      },
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "www.amazon.com",
      },
      {
        protocol: "https",
        hostname: "www.apple.com",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
      },
      {
        protocol: "https",
        hostname: "www.microsoft.com",
      },
    ],
  },
};

export default nextConfig;