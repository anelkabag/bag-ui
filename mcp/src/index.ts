import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server";

const VERSION = "0.1.0";

async function main(): Promise<void> {
  const server = createServer(VERSION);
  await server.connect(new StdioServerTransport());
  // stdout is reserved for the MCP protocol: log on stderr only.
  console.error(`[bagui-mcp] v${VERSION} ready on stdio`);
}

main().catch((error: unknown) => {
  console.error("[bagui-mcp] fatal:", error instanceof Error ? error.message : error);
  process.exit(1);
});
