import type { NextConfig } from "next";
import { withPostHogConfig } from "@posthog/nextjs-config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const fa6Icons = path.join(root, "lib/icons/fa6.ts");
const tablerIcons = path.join(root, "lib/icons/tabler.ts");

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.7"],
  // The published barrels are a single 1.7 MB / 3.6 MB file. These shims
  // export only the icons the app imports, so dev compiles skip the rest.
  turbopack: {
    resolveAlias: {
      "react-icons/fa6": "./lib/icons/fa6.ts",
      "@tabler/icons-react": "./lib/icons/tabler.ts",
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "react-icons/fa6": fa6Icons,
      "@tabler/icons-react": tablerIcons,
    };
    return config;
  },

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
        hostname: "bagui.pro",
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

const posthogApiKey = process.env.POSTHOG_API_KEY;
const posthogProjectId = process.env.POSTHOG_PROJECT_ID;
const posthogIngestHost =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

export default posthogApiKey && posthogProjectId
  ? withPostHogConfig(nextConfig, {
      personalApiKey: posthogApiKey,
      projectId: posthogProjectId,
      host: posthogIngestHost.replace(".i.posthog.com", ".posthog.com"),
      sourcemaps: {
        enabled: true,
        releaseName: "bag-ui",
        deleteAfterUpload: true,
      },
    })
  : nextConfig;