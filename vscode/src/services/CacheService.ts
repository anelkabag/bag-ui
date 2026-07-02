import * as vscode from "vscode";
import type { RegistryData } from "../types";

export class CacheService {
  private static readonly CACHE_KEY = "bagui.registry.cache";
  private static readonly CACHE_TTL_MS = 12 * 60 * 60 * 1000;

  constructor(private readonly context: vscode.ExtensionContext) {}

  async load(): Promise<RegistryData | undefined> {
    const cached = this.context.globalState.get<
      { data: RegistryData; timestamp: number } | undefined
    >(CacheService.CACHE_KEY);

    if (!cached) {
      return undefined;
    }

    const isFresh = Date.now() - cached.timestamp < CacheService.CACHE_TTL_MS;
    if (!isFresh) {
      await this.clear();
      return undefined;
    }

    return cached.data;
  }

  async save(data: RegistryData): Promise<void> {
    await this.context.globalState.update(CacheService.CACHE_KEY, {
      data,
      timestamp: Date.now(),
    });
  }

  async clear(): Promise<void> {
    await this.context.globalState.update(CacheService.CACHE_KEY, undefined);
  }
}
