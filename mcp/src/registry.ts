import * as fs from "node:fs";
import * as path from "node:path";
import type { Component, NormalizedRegistry } from "../../vscode/src/types";
import { compareCategories, parseRegistry } from "../../vscode/src/utils/registry";

const TTL_MS = 12 * 60 * 60 * 1000;
const FETCH_TIMEOUT_MS = 10_000;

/**
 * Registry access for the MCP server. Parsing/validation is shared with the
 * VS Code extension (../vscode/src/utils/registry.ts): one registry.json,
 * one parser.
 *
 * Source priority: BAGUI_REGISTRY_PATH > BAGUI_REGISTRY_URL > bundled snapshot.
 */
export class RegistryStore {
  private cached: { registry: NormalizedRegistry; expiresAt: number } | undefined;

  async get(): Promise<NormalizedRegistry> {
    if (this.cached && Date.now() < this.cached.expiresAt) {
      return this.cached.registry;
    }

    const url = process.env["BAGUI_REGISTRY_URL"]?.trim();
    const file = process.env["BAGUI_REGISTRY_PATH"]?.trim();

    try {
      const registry = file ? await readJsonFile(file) : url ? await fetchJson(url) : await readBundled();
      this.cached = { registry, expiresAt: Date.now() + (url && !file ? TTL_MS : Number.POSITIVE_INFINITY) };
      return registry;
    } catch (error) {
      // Offline mode: stale copy first, then the bundled snapshot.
      if (this.cached) {
        return this.cached.registry;
      }
      if (file || url) {
        const bundled = await readBundled();
        this.cached = { registry: bundled, expiresAt: Date.now() + 5 * 60 * 1000 };
        return bundled;
      }
      throw error;
    }
  }

  async categories(): Promise<Array<{ category: string; count: number }>> {
    const { components } = await this.get();
    const counts = new Map<string, number>();
    for (const component of components) {
      counts.set(component.category, (counts.get(component.category) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort(([a], [b]) => compareCategories(a, b))
      .map(([category, count]) => ({ category, count }));
  }

  async find(slug: string): Promise<Component | undefined> {
    return (await this.get()).components.find((component) => component.name === slug);
  }

  async search(options: { query?: string; category?: string; tier?: "free" | "pro" }): Promise<Component[]> {
    const { components } = await this.get();
    const terms = (options.query ?? "").toLowerCase().split(/\s+/).filter(Boolean);

    return components.filter((component) => {
      if (options.category && component.category !== options.category.toLowerCase()) {
        return false;
      }
      if (options.tier && component.tier !== options.tier) {
        return false;
      }
      const haystack = [component.title, component.description, component.name, component.category, ...component.tags]
        .join(" ")
        .toLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
  }
}

async function readJsonFile(filePath: string): Promise<NormalizedRegistry> {
  let raw: string;
  try {
    raw = await fs.promises.readFile(path.resolve(filePath), "utf8");
  } catch {
    throw new Error(`BagUI registry file not found or unreadable: ${filePath}`);
  }
  return parseText(raw, filePath);
}

function readBundled(): Promise<NormalizedRegistry> {
  // dist/index.js sits next to ../data/registry.json once packaged.
  return readJsonFile(path.resolve(__dirname, "..", "data", "registry.json"));
}

async function fetchJson(url: string): Promise<NormalizedRegistry> {
  if (!/^https:\/\//i.test(url)) {
    throw new Error("BAGUI_REGISTRY_URL must be an https:// URL.");
  }
  const response = await fetchWithTimeout(url);
  return parseText(await response.text(), url);
}

export async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response;
  } catch (error) {
    throw new Error(`Unable to fetch ${url} (${error instanceof Error ? error.message : "unknown error"}).`);
  } finally {
    clearTimeout(timer);
  }
}

function parseText(raw: string, origin: string): NormalizedRegistry {
  try {
    return parseRegistry(JSON.parse(raw));
  } catch (error) {
    throw new Error(`Invalid BagUI registry (${origin}): ${error instanceof Error ? error.message : "parse error"}`);
  }
}
