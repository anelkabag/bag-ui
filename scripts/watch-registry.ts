import chokidar from "chokidar";
import { spawn } from "child_process";
import path from "path";

const REGISTRY_PATHS = [
  path.join(process.cwd(), "registry.json"),
  path.join(process.cwd(), "registry/default/blocks"),
  path.join(process.cwd(), "registry/default/ui"),
];

function shouldRegenerate(filePath: string) {
  const base = path.basename(filePath);
  return filePath.endsWith(".tsx") || base === "registry.json";
}

// Debounce timer
let debounceTimer: NodeJS.Timeout | null = null;
const DEBOUNCE_MS = 500;

function regenerateRegistry() {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    console.log("\n📝 Registry files changed, regenerating...");

    // Lance la commande npm plutôt que tsx directement
    const child = spawn("npm", ["run", "registry:generate"], {
      cwd: process.cwd(),
      stdio: "inherit",
      shell: true, // nécessaire sous Windows pour trouver npm
    });

    child.on("close", (code) => {
      if (code === 0) {
        console.log("✅ Registry regenerated successfully\n");
      } else {
        console.error(`❌ Failed to regenerate registry (code ${code})\n`);
      }
    });

    child.on("error", (err) => {
      console.error("❌ Failed to spawn npm:", err);
    });
  }, DEBOUNCE_MS);
}

console.log(`👀 Watching registry at:`);
REGISTRY_PATHS.forEach((p) => console.log(`   - ${p}`));
console.log("Press Ctrl+C to stop\n");

const watcher = chokidar.watch(REGISTRY_PATHS, {
  ignored: /(^|[\/\\])\.|node_modules/,
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 100,
    pollInterval: 100,
  },
});

watcher.on("add", (filePath) => {
  if (shouldRegenerate(filePath)) {
    console.log(`📄 Added: ${path.relative(process.cwd(), filePath)}`);
    regenerateRegistry();
  }
});

watcher.on("unlink", (filePath) => {
  if (shouldRegenerate(filePath)) {
    console.log(`🗑️  Removed: ${path.relative(process.cwd(), filePath)}`);
    regenerateRegistry();
  }
});

watcher.on("change", (filePath) => {
  if (shouldRegenerate(filePath)) {
    console.log(`✏️  Changed: ${path.relative(process.cwd(), filePath)}`);
    regenerateRegistry();
  }
});

watcher.on("error", (error) => {
  console.error("❌ Watcher error:", error);
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n👋 Shutting down watcher...");
  watcher.close();
  process.exit(0);
});
