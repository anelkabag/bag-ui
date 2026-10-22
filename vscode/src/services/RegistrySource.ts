import * as fs from "node:fs";
import * as path from "node:path";
import * as vscode from "vscode";
import type { NormalizedRegistry } from "../types";
import { parseRegistry } from "../utils/registry";

/**
 * A place the registry can be loaded from. Swapping the registry for an HTTP
 * API only means picking another RegistrySource: nothing else changes.
 */
export interface RegistrySource {
  /** Stable identifier, used to invalidate the cache when the source changes. */
  readonly id: string;
  /** Whether the result may be cached (the bundled snapshot never needs it). */
  readonly cacheable: boolean;
  load(): Promise<NormalizedRegistry>;
}

export class FileRegistrySource implements RegistrySource {
  readonly cacheable = false;

  constructor(private readonly filePath: string) {}

  get id(): string {
    return `file:${this.filePath}`;
  }

  async load(): Promise<NormalizedRegistry> {
    let raw: string;
    try {
      raw = await fs.promises.readFile(this.filePath, "utf8");
    } catch {
      throw new Error(`BagUI registry file not found or unreadable: ${this.filePath}`);
    }
    return parseJson(raw, this.filePath);
  }
}

export class HttpRegistrySource implements RegistrySource {
  readonly cacheable = true;

  constructor(
    private readonly url: string,
    private readonly timeoutMs = 10_000,
  ) {}

  get id(): string {
    return `http:${this.url}`;
  }

  async load(): Promise<NormalizedRegistry> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await fetch(this.url, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return parseJson(await response.text(), this.url);
    } catch (error) {
      const reason = error instanceof Error ? error.message : "unknown error";
      throw new Error(`Unable to fetch the BagUI registry from ${this.url} (${reason}).`);
    } finally {
      clearTimeout(timer);
    }
  }
}

export class BundledRegistrySource implements RegistrySource {
  readonly id = "bundled";
  readonly cacheable = false;

  constructor(private readonly context: vscode.ExtensionContext) {}

  async load(): Promise<NormalizedRegistry> {
    const file = path.join(this.context.extensionPath, "data", "registry.json");
    return new FileRegistrySource(file).load();
  }
}

function parseJson(raw: string, origin: string): NormalizedRegistry {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    throw new Error(`Invalid BagUI registry (malformed JSON): ${origin}`);
  }
  return parseRegistry(json);
}
