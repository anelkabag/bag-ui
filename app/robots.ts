import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/account",
          "/auth/",
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
          "/fullscreen/",
        ],
      },
    ],
    sitemap: "https://www.bagui.pro/sitemap.xml",
  };
}