// lib/block-categories.ts

export interface RegistryFile {
  items: RegistryItem[];
}

export type AccessTier = "free" | "pro";

export interface AccessInfo {
  tier: AccessTier;
}

export interface RegistryItem {
  name: string;
  title: string;
  type: string;
  description: string;
  access?: AccessInfo;
  dependencies?: string[];
  files: { path: string; type: string; target?: string }[];
}

export interface BlockCategory {
  slug: string;
  title: string;
  type: string;
  description: string;
}

export const blockCategories: BlockCategory[] = [
  // ── Marketing ──────────────────────────────────────────────────────────────
  { slug: "hero",        title: "Hero",        type: "block", description: "Hero banner with call to action" },
  { slug: "feature",     title: "Feature",     type: "block", description: "Highlight your product features with icon grids and text layouts." },
  { slug: "pricing",     title: "Pricing",     type: "block", description: "Pricing plans and comparison" },
  { slug: "testimonial", title: "Testimonial", type: "block", description: "Customer testimonials with avatars, star ratings and quotes." },
  { slug: "cta",         title: "CTA",         type: "block", description: "Call-to-action banners designed to convert visitors into users." },
  { slug: "faq",         title: "FAQ",         type: "block", description: "Frequently asked questions accordion" },
  { slug: "navbar",      title: "Navbar",      type: "block", description: "Responsive navigation bars with logo, links and action buttons." },
  { slug: "footer",      title: "Footer",      type: "block", description: "Site Footer with links and info" },
  { slug: "blog",        title: "Blog",        type: "block", description: "Blog listing sections with post cards, dates and author info." },
  { slug: "team",        title: "Team",        type: "block", description: "Team section with member previews" },
  { slug: "stats",       title: "Stats",       type: "block", description: "Key metric displays with counters, labels and sparklines." },
  { slug: "contact",     title: "Contact",     type: "block", description: "Contact form and information section" },
  { slug: "gallery",     title: "Gallery",     type: "block", description: "Image gallery layouts with masonry, grid and lightbox styles." },
  { slug: "logos",       title: "Logos",       type: "block", description: "Logo marquee and grid sections to show off trusted brands." },
  { slug: "banner",      title: "Banner",      type: "block", description: "Announcement banners for promotions, alerts and updates." },
  { slug: "signup",      title: "SignUp",     type: "block", description: "Sign-up and SignUp forms with email, password and social auth." },
  // ── App ────────────────────────────────────────────────────────────────────
  { slug: "dashboard",    title: "Dashboard",    type: "block", description: "Admin dashboards with sidebar, stat cards and data charts." },
  { slug: "sidebar",      title: "Sidebar",      type: "block", description: "Collapsible sidebars with nav items, icons and nested menus." },
  { slug: "data-table",   title: "Data Table",   type: "block", description: "Sortable, filterable data tables with pagination and actions." },
  { slug: "chart-card",   title: "Chart Card",   type: "block", description: "Dashboard chart cards with bar, line and area visualizations." },
  { slug: "settings",     title: "Settings",     type: "block", description: "Settings pages with form sections, toggles and save actions." },
  { slug: "user-profile", title: "User Profile", type: "block", description: "User profile pages with avatar, bio, stats and activity feed." },
  // ── Ecommerce ──────────────────────────────────────────────────────────────
  { slug: "product-list",   title: "Product List",   type: "block", description: "Product grid and list layouts with images, prices and add-to-cart." },
  { slug: "product-detail", title: "Product Detail", type: "block", description: "Product detail pages with image gallery, description and options." },
  { slug: "shopping-cart",  title: "Shopping Cart",  type: "block", description: "Cart sidebars and pages with item list, totals and checkout CTA." },
  { slug: "checkout",       title: "Checkout",       type: "block", description: "Checkout forms with address, payment and order summary panels." },
  { slug: "reviews",        title: "Reviews",        type: "block", description: "Product review sections with star ratings, comments and photos." },
  { slug: "product-card",   title: "Product Card",   type: "block", description: "Reusable product cards with image, name, price and action button." },
  // ── Legacy (backward compat) ───────────────────────────────────────────────
  { slug: "faqs",     title: "FAQs",     type: "block", description: "Frequently asked questions accordion" },
  { slug: "carousel", title: "Carousel", type: "block", description: "Image carousel/slider component" },
];

// ─── Helpers — identiques à l'original, aucun export supprimé ────────────────

export function formatCategoryLabel(slug?: string) {
  if (!slug) return "Catégorie";
  return slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function categoryMatchesItem(categorySlug: string, item: RegistryItem) {
  const normalized = categorySlug.toLowerCase();
  const itemName = item.name.toLowerCase();

  if (itemName === normalized) return true;
  if (itemName.replace(/-section$/, "") === normalized) return true;
  if (itemName.replace(/-/g, "") === normalized) return true;

  return item.files.some((file) => {
    const path = file.path.toLowerCase();
    return (
        path.includes(`/${normalized}`) ||
        path.includes(`-${normalized}`) ||
        path.includes(`${normalized}.tsx`) ||
        path.includes(`${normalized}.ts`)
    );
  });
}

export function getCategoryForSlug(
    categorySlug: string,
    items: RegistryItem[],
) {
  const normalized = categorySlug.toLowerCase();
  const directCategory = blockCategories.find(
      (categoryItem) => categoryItem.slug === normalized,
  );

  if (directCategory) {
    return directCategory;
  }

  const matchingItem = items.find((item) =>
      categoryMatchesItem(normalized, item),
  );
  if (!matchingItem) {
    return undefined;
  }

  return blockCategories.find((categoryItem) =>
      categoryMatchesItem(categoryItem.slug, matchingItem),
  );
}

export function countRegistryItemsForCategory(
    categorySlug: string,
    items: RegistryItem[],
) {
  return items.filter((item) => categoryMatchesItem(categorySlug, item)).length;
}