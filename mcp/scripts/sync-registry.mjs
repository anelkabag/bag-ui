// Copies the repository's registry.json into data/registry.json so it ships
// with the extension as an offline fallback. The root registry.json stays the
// single source of truth: data/registry.json is generated and git-ignored.
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(root, "..", "registry.json");
const target = resolve(root, "data", "registry.json");

if (existsSync(source)) {
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(source, target);
  console.log("[bagui] registry.json synced into data/");
} else if (existsSync(target)) {
  console.log("[bagui] ../registry.json not found, keeping existing data/registry.json");
} else {
  console.error("[bagui] registry.json not found: cannot bundle the offline registry.");
  process.exit(1);
}
