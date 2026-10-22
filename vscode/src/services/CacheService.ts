import * as vscode from "vscode";
import type { NormalizedRegistry } from "../types";

interface CacheEntry {
  sourceId: string;
  timestamp: number;
  registry: NormalizedRegistry;
}

export class CacheService {
  static readonly TTL_MS = 12 * 60 * 60 * 1000;
  private static readonly KEY = "bagui.registry.cache.v1";

  constructor(private readonly context: vscode.ExtensionContext) {}

  /** Returns the cached registry for this source if it is younger than 12 hours. */
  getFresh(sourceId: string): NormalizedRegistry | undefined {
    const entry = this.read(sourceId);
    return entry && Date.now() - entry.timestamp < CacheService.TTL_MS ? entry.registry : undefined;
  }

  /** Returns the cached registry even if expired (used for offline mode). */
  getStale(sourceId: string): NormalizedRegistry | undefined {
    return this.read(sourceId)?.registry;
  }

  async save(sourceId: string, registry: NormalizedRegistry): Promise<void> {
    const entry: CacheEntry = { sourceId, timestamp: Date.now(), registry };
    await this.context.globalState.update(CacheService.KEY, entry);
  }

  async clear(): Promise<void> {
    await this.context.globalState.update(CacheService.KEY, undefined);
  }

  private read(sourceId: string): CacheEntry | undefined {
    const entry = this.context.globalState.get<CacheEntry>(CacheService.KEY);
    return entry && entry.sourceId === sourceId ? entry : undefined;
  }
}
