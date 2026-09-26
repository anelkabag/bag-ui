import type { MetadataRoute } from "next";

const baseUrl = "https://www.bagui.pro";

const publicRoutes = [
  { path: "", changeFrequency: "daily", priority: 1 },
  { path: "/analytics", changeFrequency: "weekly", priority: 0.6 },
  { path: "/blocks", changeFrequency: "weekly", priority: 0.9 },
  { path: "/changelog", changeFrequency: "monthly", priority: 0.6 },
  { path: "/components", changeFrequency: "weekly", priority: 0.9 },
  { path: "/docs", changeFrequency: "weekly", priority: 0.8 },
  { path: "/license", changeFrequency: "yearly", priority: 0.3 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.7 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/templates", changeFrequency: "weekly", priority: 0.8 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
] satisfies Array<{
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
}>;

// These slugs are the category IDs accepted by app/blocks/[id] and exposed
// by the marketing, app, and ecommerce sections on /blocks.
const blockSlugs = [
  "hero",
  "feature",
  "pricing",
  "testimonial",
  "cta",
  "faq",
  "navbar",
  "footer",
  "blog",
  "team",
  "stats",
  "contact",
  "gallery",
  "logos",
  "banner",
  "signup",
  "dashboard",
  "sidebar",
  "data-table",
  "chart-card",
  "settings",
  "user-profile",
  "onboarding",
  "todo-list",
  "product-list",
  "product-detail",
  "shopping-cart",
  "checkout",
  "reviews",
  "product-card",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = publicRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const blockRoutes: MetadataRoute.Sitemap = blockSlugs.map((slug) => ({
    url: `${baseUrl}/blocks/${slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...blockRoutes];
}