import * as path from "node:path";
import * as vscode from "vscode";
import type { Component, NormalizedRegistry } from "../types";
import { toErrorMessage } from "../utils/errors";
import { compareCategories } from "../utils/registry";
import { CacheService } from "./CacheService";
import {
  BundledRegistrySource,
  FileRegistrySource,
  HttpRegistrySource,
  type RegistrySource,
} from "./RegistrySource";

const NO_EXPIRY = Number.POSITIVE_INFINITY;
const RETRY_DELAY_MS = 5 * 60 * 1000;

export class RegistryService implements vscode.Disposable {
  private readonly _onDidChange = new vscode.EventEmitter<void>();
  readonly onDidChange = this._onDidChange.event;

  private inflight: Promise<NormalizedRegistry> | undefined;
  private current: NormalizedRegistry | undefined;
  private currentSourceId = "";
  private expiresAt = 0;
  private offlineNoticeShown = false;

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly cache: CacheService,
  ) {}

  dispose(): void {
    this._onDidChange.dispose();
  }

  async getCategories(): Promise<string[]> {
    const { components } = await this.getRegistry();
    return Array.from(new Set(components.map((c) => c.category))).sort(compareCategories);
  }

  async getComponents(): Promise<Component[]> {
    return (await this.getRegistry()).components;
  }

  async getComponent(slug: string): Promise<Component | undefined> {
    const components = await this.getComponents();
    return components.find((component) => component.name === slug);
  }

  async getComponentsByCategory(category: string): Promise<Component[]> {
    const components = await this.getComponents();
    return components.filter((component) => component.category === category);
  }

  async search(query: string): Promise<Component[]> {
    const components = await this.getComponents();
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) {
      return components;
    }

    return components.filter((component) => {
      const haystack = [
        component.title,
        component.description,
        component.name,
        component.category,
        ...component.tags,
      ]
        .join(" ")
        .toLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
  }

  async getHomepage(): Promise<string> {
    return (await this.getRegistry()).homepage;
  }

  /** Drops the cache and reloads from the configured source. */
  async refresh(): Promise<void> {
    await this.cache.clear();
    this.current = undefined;
    this.inflight = undefined;
    this.offlineNoticeShown = false;
    await this.getRegistry();
    this._onDidChange.fire();
  }

  private async getRegistry(): Promise<NormalizedRegistry> {
    const source = this.resolveSource();
    if (this.current && this.currentSourceId === source.id && Date.now() < this.expiresAt) {
      return this.current;
    }

    this.inflight ??= this.load(source).finally(() => {
      this.inflight = undefined;
    });
    return this.inflight;
  }

  private remember(source: RegistrySource, registry: NormalizedRegistry, ttlMs: number): NormalizedRegistry {
    this.current = registry;
    this.currentSourceId = source.id;
    this.expiresAt = Date.now() + ttlMs;
    return registry;
  }

  private async load(source: RegistrySource): Promise<NormalizedRegistry> {
    if (source.cacheable) {
      const fresh = this.cache.getFresh(source.id);
      if (fresh) {
        return this.remember(source, fresh, CacheService.TTL_MS);
      }
    }

    try {
      const registry = await source.load();
      if (source.cacheable) {
        await this.cache.save(source.id, registry);
      }
      return this.remember(source, registry, source.cacheable ? CacheService.TTL_MS : NO_EXPIRY);
    } catch (primaryError) {
      return this.loadFallback(source, primaryError);
    }
  }

  /** Offline mode: expired cache first, then the registry bundled with the extension. */
  private async loadFallback(source: RegistrySource, primaryError: unknown): Promise<NormalizedRegistry> {
    const stale = source.cacheable ? this.cache.getStale(source.id) : undefined;
    if (stale) {
      this.notifyOffline(primaryError, "cached copy");
      return this.remember(source, stale, RETRY_DELAY_MS);
    }

    if (source.id !== "bundled") {
      try {
        const bundled = await new BundledRegistrySource(this.context).load();
        this.notifyOffline(primaryError, "registry bundled with the extension");
        return this.remember(source, bundled, RETRY_DELAY_MS);
      } catch {
        // Fall through to the original error, which is the most useful one.
      }
    }

    throw new Error(toErrorMessage(primaryError, "Unable to load the BagUI registry."));
  }

  private notifyOffline(error: unknown, fallback: string): void {
    if (this.offlineNoticeShown) {
      return;
    }
    this.offlineNoticeShown = true;
    void vscode.window.showWarningMessage(
      `${toErrorMessage(error, "BagUI registry unavailable.")} Using the ${fallback} instead.`,
    );
  }

  private resolveSource(): RegistrySource {
    const config = vscode.workspace.getConfiguration("bagui");
    const registryPath = config.get<string>("registryPath", "").trim();
    const apiUrl = config.get<string>("apiUrl", "").trim();

    if (registryPath) {
      const base = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? process.cwd();
      return new FileRegistrySource(path.resolve(base, registryPath));
    }

    if (apiUrl) {
      if (!/^https:\/\//i.test(apiUrl)) {
        throw new Error("The \"bagui.apiUrl\" setting must be an https:// URL.");
      }
      return new HttpRegistrySource(apiUrl);
    }

    return new BundledRegistrySource(this.context);
  }
}
