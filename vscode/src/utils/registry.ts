import type {
  Component,
  NormalizedRegistry,
  RegistryData,
  RegistryItem,
  Tier,
} from "../types";

export const DEFAULT_HOMEPAGE = "https://bagui.pro";

const CATEGORY_ORDER = [
  "marketing",
  "dashboard",
  "authentication",
  "forms",
  "buttons",
  "cards",
  "navigation",
  "templates",
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  marketing: "Marketing",
  dashboard: "Dashboard",
  authentication: "Authentication",
  forms: "Forms",
  buttons: "Buttons",
  cards: "Cards",
  navigation: "Navigation",
  templates: "Templates",
  favorites: "Favorites",
};

/** First matching rule wins. Used only when an item has no explicit category. */
const CATEGORY_RULES: ReadonlyArray<readonly [RegExp, string]> = [
  [/template/, "templates"],
  [/dashboard|chat-app|analytics/, "dashboard"],
  [/login|register|signin|signup|auth|password/, "authentication"],
  [/contact|form|input/, "forms"],
  [/button/, "buttons"],
  [/navbar|sidebar|footer|menu|nav/, "navigation"],
  [/card/, "cards"],
  [/hero|cta|faq|pricing|feature|testimonial|team/, "marketing"],
];

export function inferCategory(item: Pick<RegistryItem, "name" | "title">): string {
  const haystack = `${item.name} ${item.title}`.toLowerCase();
  for (const [pattern, category] of CATEGORY_RULES) {
    if (pattern.test(haystack)) {
      return category;
    }
  }
  return "marketing";
}

export function categoryLabel(category: string): string {
  const known = CATEGORY_LABELS[category.toLowerCase()];
  if (known) {
    return known;
  }
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export function compareCategories(a: string, b: string): number {
  const rank = (value: string): number => {
    const index = (CATEGORY_ORDER as readonly string[]).indexOf(value);
    return index === -1 ? CATEGORY_ORDER.length : index;
  };
  return rank(a) - rank(b) || a.localeCompare(b);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function asStringArray(value: unknown): string[] | undefined {
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === "string")
    : undefined;
}

function asTier(value: unknown): Tier {
  return isRecord(value) && value["tier"] === "pro" ? "pro" : "free";
}

/** Slugs end up in a terminal command: only allow safe characters. */
export function isSafeSlug(slug: string): boolean {
  return /^[a-z0-9][a-z0-9._-]*$/i.test(slug);
}

function parseItem(value: unknown): Component | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const name = asString(value["name"]);
  if (!name || !isSafeSlug(name)) {
    return undefined;
  }

  const type = asString(value["type"]) ?? "registry:block";
  const title = asString(value["title"]) ?? name;
  const tier = asTier(value["access"]);
  const files = Array.isArray(value["files"])
    ? value["files"].filter(isRecord).flatMap((file) => {
        const path = asString(file["path"]);
        return path
          ? [{ path, type: asString(file["type"]) ?? type, target: asString(file["target"]) }]
          : [];
      })
    : [];

  const item: RegistryItem = {
    name,
    type,
    title,
    description: asString(value["description"]) ?? "",
    files,
    dependencies: asStringArray(value["dependencies"]),
    access: { tier },
    tags: asStringArray(value["tags"]),
    version: asString(value["version"]),
    docsUrl: asString(value["docsUrl"]),
    image: asString(value["image"]),
    category: asString(value["category"]),
  };

  const category = (item.category ?? inferCategory(item)).toLowerCase();
  const tags = item.tags ?? [type.replace("registry:", ""), tier];

  return { ...item, category, tags, tier };
}

/** Validates unknown JSON and turns it into a normalized registry. Throws on invalid input. */
export function parseRegistry(json: unknown): NormalizedRegistry {
  if (!isRecord(json) || !Array.isArray(json["items"])) {
    throw new Error("Invalid registry: expected an object with an \"items\" array.");
  }

  const components = json["items"].flatMap((entry) => {
    const parsed = parseItem(entry);
    return parsed ? [parsed] : [];
  });

  if (components.length === 0 && json["items"].length > 0) {
    throw new Error("Invalid registry: no valid component found.");
  }

  return {
    name: asString(json["name"]) ?? "BagUI",
    homepage: (asString(json["homepage"]) ?? DEFAULT_HOMEPAGE).replace(/\/+$/, ""),
    components,
  };
}

export function toRegistryData(registry: NormalizedRegistry): RegistryData {
  return { name: registry.name, homepage: registry.homepage, items: registry.components };
}
