export interface RegistryItemFile {
  path: string;
  type: string;
  target?: string;
}

export interface RegistryAccess {
  tier: "free" | "pro";
}

export interface RegistryItem {
  name: string;
  type: string;
  title: string;
  description: string;
  files: RegistryItemFile[];
  dependencies?: string[];
  access?: RegistryAccess;
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

export interface ComponentNode {
  id: string;
  label: string;
  description?: string;
  component?: RegistryItem;
  category: string;
  contextValue?: string;
  isFavorite?: boolean;
}
