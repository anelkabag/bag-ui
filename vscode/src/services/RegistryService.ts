import * as fs from "node:fs";
import * as path from "node:path";
import * as vscode from "vscode";
import { resolveRegistryPath, toDisplayCategory } from "../utils/paths";
import type { RegistryData, RegistryItem } from "../types";

export class RegistryService {
  constructor(private readonly context: vscode.ExtensionContext) {}

  async getCategories(): Promise<string[]> {
    const registry = await this.loadRegistry();
    const categories = new Set<string>();

    for (const item of registry.items) {
      const category = this.inferCategory(item);
      categories.add(category);
    }

    return Array.from(categories).sort();
  }

  async getComponents(): Promise<RegistryItem[]> {
    const registry = await this.loadRegistry();
    return registry.items;
  }

  async getComponent(slug: string): Promise<RegistryItem | undefined> {
    const components = await this.getComponents();
    return components.find(
      (component) => component.name === slug || component.title === slug,
    );
  }

  async search(query: string): Promise<RegistryItem[]> {
    const components = await this.getComponents();
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return components;
    }

    return components.filter((component) => {
      const haystack = [
        component.title,
        component.description,
        component.name,
        component.category ?? "",
        ...(component.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalized);
    });
  }

  async loadRegistry(): Promise<RegistryData> {
    const configuredPath = vscode.workspace
      .getConfiguration("bagui")
      .get<string>("registryPath");
    const registryPath = resolveRegistryPath(configuredPath);

    if (!fs.existsSync(registryPath)) {
      throw new Error(`Registry file not found at ${registryPath}`);
    }

    const raw = await fs.promises.readFile(registryPath, "utf8");
    const parsed = JSON.parse(raw) as RegistryData;

    if (!parsed.items || !Array.isArray(parsed.items)) {
      throw new Error("Invalid registry format");
    }

    return {
      ...parsed,
      items: parsed.items.map((item) => ({
        ...item,
        category: item.category ?? this.inferCategory(item),
        tags: item.tags ?? [item.type, item.access?.tier ?? "free"],
      })),
    };
  }

  async getComponentsByCategory(category: string): Promise<RegistryItem[]> {
    const components = await this.getComponents();
    return components.filter(
      (component) => this.inferCategory(component) === category,
    );
  }

  getCategoryLabel(category: string): string {
    return toDisplayCategory(category);
  }

  private inferCategory(component: RegistryItem): string {
    const lowerTitle = component.title.toLowerCase();
    const lowerName = component.name.toLowerCase();

    if (lowerTitle.includes("hero") || lowerName.includes("hero")) {
      return "marketing";
    }

    if (lowerTitle.includes("navbar") || lowerName.includes("navbar")) {
      return "navigation";
    }

    if (lowerTitle.includes("cta") || lowerName.includes("cta")) {
      return "marketing";
    }

    if (lowerTitle.includes("faq") || lowerName.includes("faq")) {
      return "marketing";
    }

    if (lowerTitle.includes("pricing") || lowerName.includes("pricing")) {
      return "marketing";
    }

    if (lowerTitle.includes("contact") || lowerName.includes("contact")) {
      return "forms";
    }

    if (lowerTitle.includes("feature") || lowerName.includes("feature")) {
      return "marketing";
    }

    if (
      lowerTitle.includes("testimonial") ||
      lowerName.includes("testimonial")
    ) {
      return "marketing";
    }

    if (lowerTitle.includes("login") || lowerName.includes("login")) {
      return "authentication";
    }

    if (lowerTitle.includes("dashboard") || lowerName.includes("dashboard")) {
      return "dashboard";
    }

    if (lowerTitle.includes("button") || lowerName.includes("button")) {
      return "buttons";
    }

    if (lowerTitle.includes("card") || lowerName.includes("card")) {
      return "cards";
    }

    return "marketing";
  }
}
