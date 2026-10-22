export type Tier = "free" | "pro";

export interface RegistryItemFile {
  path: string;
  type: string;
  target?: string;
}

export interface RegistryItem {
  name: string;
  type: string;
  title: string;
  description: string;
  files: RegistryItemFile[];
  dependencies?: string[];
  access?: { tier: Tier };
  tags?: string[];
  version?: string;
  docsUrl?: string;
  image?: string;
  category?: string;
}

export interface RegistryData {
  name: string;
  homepage?: string;
  author?: string;
  items: RegistryItem[];
}

/** A registry item once normalized: category, tags and tier are always set. */
export interface Component extends RegistryItem {
  category: string;
  tags: string[];
  tier: Tier;
}

export interface NormalizedRegistry {
  name: string;
  homepage: string;
  components: Component[];
}

export interface CategoryNode {
  kind: "category";
  category: string;
  label: string;
  count: number;
}

export interface ComponentNode {
  kind: "component";
  /** Category (or "favorites") the node is displayed under. Keeps tree ids unique. */
  parent: string;
  component: Component;
  isFavorite: boolean;
}

export type TreeNode = CategoryNode | ComponentNode;

export const FAVORITES_CATEGORY = "favorites";
