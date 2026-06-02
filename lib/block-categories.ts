export interface RegistryFile {
  items: RegistryItem[];
}

export interface RegistryItem {
  name: string;
  title: string;
  type: string;
  description: string;
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
  {
    slug: "contact",
    title: "Contact",
    type: "block",
    description: "Contact form and information section",
  },
  {
    slug: "faqs",
    title: "FAQs",
    type: "block",
    description: "Frequently asked questions accordion",
  },
  {
    slug: "footer",
    title: "Footer",
    type: "block",
    description: "Site footer with links and info",
  },
  {
    slug: "carousel",
    title: "Carousel",
    type: "block",
    description: "Image carousel/slider component",
  },
  {
    slug: "pricing",
    title: "Pricing",
    type: "block",
    description: "Pricing plans and comparison",
  },
  {
    slug: "hero",
    title: "Hero",
    type: "block",
    description: "Hero banner with call to action",
  },
  {
    slug: "team",
    title: "Team",
    type: "block",
    description: "Team section with member previews",
  },
];

export function formatCategoryLabel(slug?: string) {
  if (!slug) return "Catégorie";
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
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

  const matchingItem = items.find((item) => categoryMatchesItem(normalized, item));
  if (!matchingItem) {
    return undefined;
  }

  return blockCategories.find((categoryItem) =>
    categoryMatchesItem(categoryItem.slug, matchingItem),
  );
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

export function countRegistryItemsForCategory(
  categorySlug: string,
  items: RegistryItem[],
) {
  return items.filter((item) => categoryMatchesItem(categorySlug, item)).length;
}
