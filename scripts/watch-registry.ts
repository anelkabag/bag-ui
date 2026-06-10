import chokidar from "chokidar";
import { spawn } from "child_process";
import path from "path";

const REGISTRY_PATH = path.join(process.cwd(), "registry/default/blocks");

// Debounce timer
let debounceTimer: NodeJS.Timeout | null = null;
const DEBOUNCE_MS = 500;

function regenerateRegistry() {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    console.log("\n📝 Registry files changed, regenerating...");

    const child = spawn("tsx", [
      path.join(process.cwd(), "scripts/generate-registry.ts"),
    ]);

    child.on("close", (code) => {
      if (code === 0) {
        console.log("✅ Registry regenerated successfully\n");
      } else {
        console.error("❌ Failed to regenerate registry\n");
      }
    });
  }, DEBOUNCE_MS);
}

console.log(`👀 Watching registry at ${REGISTRY_PATH}...`);
console.log('Press Ctrl+C to stop\n');

const watcher = chokidar.watch(REGISTRY_PATH, {
  ignored: /(^|[\/\\])\.|node_modules/,
  persistent: true,
  awaitWriteFinish: {
    stabilityThreshold: 100,
    pollInterval: 100,
  },
});

watcher.on("add", (filePath) => {
  if (filePath.endsWith(".tsx")) {
    console.log(`📄 Added: ${path.relative(process.cwd(), filePath)}`);
    regenerateRegistry();
  }
});

watcher.on("unlink", (filePath) => {
  if (filePath.endsWith(".tsx")) {
    console.log(`🗑️  Removed: ${path.relative(process.cwd(), filePath)}`);
    regenerateRegistry();
  }
});

watcher.on("change", (filePath) => {
  if (filePath.endsWith(".tsx")) {
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
