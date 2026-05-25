/**
 * scripts/generate-component-map.ts
 *
 * Generates src/lib/component-map.ts from registry.json.
 *
 * Usage:
 *   npx tsx scripts/generate-component-map.ts
 *
 * Add to package.json:
 *   "generate:map": "tsx scripts/generate-component-map.ts"
 *
 * Then run automatically before dev/build:
 *   "predev":   "npm run generate:map"
 *   "prebuild": "npm run generate:map"
 */

import fs from "fs";
import path from "path";

// ─── Paths ────────────────────────────────────────────────────────────────────
const REGISTRY_PATH = path.resolve(process.cwd(), "registry.json");
const OUTPUT_PATH   = path.resolve(process.cwd(), "src/lib/component-map.ts");

// ─── Types ────────────────────────────────────────────────────────────────────
interface RegistryFile {
    path: string;
    type: string;
}

interface RegistryItem {
    name: string;
    files?: RegistryFile[];
}

interface Registry {
    items?: RegistryItem[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Strip the .tsx / .ts extension for the import path */
function stripExt(filePath: string): string {
    return filePath.replace(/\.(tsx?|jsx?)$/, "");
}

/** Collect every unique file path across all registry items */
function collectFilePaths(registry: Registry): string[] {
    const seen = new Set<string>();

    for (const item of registry.items ?? []) {
        for (const file of item.files ?? []) {
            if (file.path && !seen.has(file.path)) {
                seen.add(file.path);
            }
        }
    }

    return [...seen].sort();
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
    // 1. Read registry
    if (!fs.existsSync(REGISTRY_PATH)) {
        console.error(`❌  registry.json not found at ${REGISTRY_PATH}`);
        process.exit(1);
    }

    const registry: Registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf-8"));
    const filePaths = collectFilePaths(registry);

    if (filePaths.length === 0) {
        console.warn("⚠️  No file paths found in registry.json — component map will be empty.");
    }

    // 2. Build file content
    const imports = filePaths
        .map((p) => `  "${p}": () => import("@/${stripExt(p)}"),`)
        .join("\n");

    const output = `// ─────────────────────────────────────────────────────────────────────────────
// AUTO-GENERATED — do not edit manually.
// Run \`npm run generate:map\` to regenerate from registry.json.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";

export const COMPONENT_MAP: Record<
  string,
  () => Promise<Record<string, React.ComponentType>>
> = {
${imports}
};
`;

    // 3. Write output
    const outputDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_PATH, output, "utf-8");

    console.log(`✅  Generated component map → ${OUTPUT_PATH}`);
    console.log(`    ${filePaths.length} component(s) registered.`);
    filePaths.forEach((p) => console.log(`    • ${p}`));
}

main();