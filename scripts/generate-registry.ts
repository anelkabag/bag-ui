import fs from "fs";
import path from "path";

interface RegistryEntry {
  name: string;
  category: string;
  path: string;
}

const REGISTRY_BASE = path.join(process.cwd(), "registry/default/blocks");
const OUTPUT_DIR = path.join(process.cwd(), "lib");
const MANIFEST_FILE = path.join(OUTPUT_DIR, "registry-manifest.ts");
const LOADERS_FILE = path.join(OUTPUT_DIR, "registry-loaders.ts");

// Files to ignore
const IGNORE_PATTERNS = [
  "index.ts",
  "types.ts",
  "utils.ts",
  "hooks.ts",
  "index.tsx",
  "types.tsx",
  "utils.tsx",
  "hooks.tsx",
];

function isIgnored(filename: string): boolean {
  return IGNORE_PATTERNS.includes(filename);
}

function getAllTsxFiles(dir: string, baseDir: string = ""): RegistryEntry[] {
  const entries: RegistryEntry[] = [];

  try {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Recursively scan subdirectories
        const category = file;
        const subEntries = fs.readdirSync(fullPath).filter((f) => {
          return f.endsWith(".tsx") && !isIgnored(f);
        });

        for (const subFile of subEntries) {
          const componentName = subFile.replace(".tsx", "");
          const relativePath = path.join("registry/default/blocks", category, subFile);
          entries.push({
            name: componentName,
            category,
            path: relativePath,
          });
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error);
  }

  return entries;
}

function generateManifest(entries: RegistryEntry[]): string {
  const sortedEntries = entries.sort((a, b) =>
    `${a.category}${a.name}`.localeCompare(`${b.category}${b.name}`)
  );

  const manifestContent = entries.map((entry) => ({
    name: entry.name,
    category: entry.category,
    path: entry.path,
  }));

  return `// This file is auto-generated. Do not edit manually.
// Run: npm run registry:generate

export const registryManifest = ${JSON.stringify(manifestContent, null, 2)} as const;

export type RegistryEntry = typeof registryManifest[number];

export function getComponentsByCategory(category: string) {
  return registryManifest.filter((entry) => entry.category === category);
}

export function getAllCategories() {
  return Array.from(new Set(registryManifest.map((entry) => entry.category)));
}

export function findComponent(name: string) {
  return registryManifest.find((entry) => entry.name === name);
}
`;
}

function generateLoaders(entries: RegistryEntry[]): string {
  const sortedEntries = entries.sort((a, b) =>
    a.path.localeCompare(b.path)
  );

  const loaderEntries = sortedEntries
    .map((entry) => {
      const importPath = entry.path.replace(/\.tsx$/, "");
      return `  "${entry.path}": () => import("@/${importPath}"),`;
    })
    .join("\n");

  return `// This file is auto-generated. Do not edit manually.
// Run: npm run registry:generate

export const componentLoaders: Record<
  string,
  () => Promise<Record<string, React.ComponentType>>
> = {
${loaderEntries}
};
`;
}

async function main() {
  try {
    console.log("🔍 Scanning registry...");
    const entries = getAllTsxFiles(REGISTRY_BASE);

    if (entries.length === 0) {
      console.warn("⚠️  No components found in registry");
      return;
    }

    console.log(`✨ Found ${entries.length} components`);

    // Generate manifest
    const manifestContent = generateManifest(entries);
    fs.writeFileSync(MANIFEST_FILE, manifestContent, "utf-8");
    console.log(`✅ Generated ${MANIFEST_FILE}`);

    // Generate loaders
    const loadersContent = generateLoaders(entries);
    fs.writeFileSync(LOADERS_FILE, loadersContent, "utf-8");
    console.log(`✅ Generated ${LOADERS_FILE}`);

    console.log("\n📦 Registry generation complete!");
    console.log(`   Manifest: lib/registry-manifest.ts`);
    console.log(`   Loaders:  lib/registry-loaders.ts`);
  } catch (error) {
    console.error("❌ Error generating registry:", error);
    process.exit(1);
  }
}

main();
