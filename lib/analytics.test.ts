import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  ensureProjectIdConfig,
  getOrCreateAnalyticsProjectId,
} from "./analytics.ts";

test("getOrCreateAnalyticsProjectId reuses a stored project id", () => {
  const store = new Map<string, string>();
  const storage = {
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
    removeItem(key: string) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null;
    },
    get length() {
      return store.size;
    },
  };

  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: storage,
  });

  const first = getOrCreateAnalyticsProjectId();
  const second = getOrCreateAnalyticsProjectId();

  assert.equal(second, first);
  assert.equal(storage.getItem("bagui.analytics.projectId"), first);
});

test("ensureProjectIdConfig creates a UUID v4 once and reuses it", async () => {
  const tempDir = await mkdtemp(path.join(tmpdir(), "bagui-analytics-"));

  try {
    const first = await ensureProjectIdConfig(tempDir);
    const firstConfigPath = path.join(tempDir, ".bagui", "config.json");
    const firstFile = JSON.parse(await readFile(firstConfigPath, "utf8"));

    assert.match(
      first,
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    assert.equal(firstConfigPath, path.join(tempDir, ".bagui", "config.json"));
    assert.equal(firstFile.projectId, first);

    const second = await ensureProjectIdConfig(tempDir);
    const secondFile = JSON.parse(await readFile(firstConfigPath, "utf8"));

    assert.equal(second, first);
    assert.equal(secondFile.projectId, first);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});
