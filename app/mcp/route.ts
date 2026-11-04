import { timingSafeEqual } from "node:crypto";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import registrySnapshot from "../../registry.json";
import { createServer } from "../../mcp/src/server";
import { RegistryStore } from "../../mcp/src/registry";

export const runtime = "nodejs";

const VERSION = "0.1.0";
const registryStore = new RegistryStore(registrySnapshot);

function getAllowedHosts(): string[] | undefined {
  const configuredHosts = process.env["MCP_ALLOWED_HOSTS"]?.split(",").map((host) => host.trim()).filter(Boolean);
  if (configuredHosts && configuredHosts.length > 0) {
    return configuredHosts;
  }
  return process.env["VERCEL_ENV"] === "production" ? ["bagui.pro", "www.bagui.pro"] : undefined;
}

function isAuthorized(request: Request): boolean {
  const token = process.env["MCP_AUTH_TOKEN"];
  if (!token) {
    return true;
  }

  const expected = Buffer.from(`Bearer ${token}`);
  const received = Buffer.from(request.headers.get("authorization") ?? "");
  return expected.length === received.length && timingSafeEqual(expected, received);
}

function unauthorized(): Response {
  return Response.json(
    { error: "Unauthorized" },
    { status: 401, headers: { "www-authenticate": "Bearer" } },
  );
}

async function handleMcpRequest(request: Request): Promise<Response> {
  if (!isAuthorized(request)) {
    return unauthorized();
  }

  const allowedHosts = getAllowedHosts();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
    allowedHosts,
    enableDnsRebindingProtection: Boolean(allowedHosts?.length),
  });
  const server = createServer(VERSION, registryStore);

  try {
    await server.connect(transport);
    return await transport.handleRequest(request);
  } catch (error) {
    console.error("[bagui-mcp] Vercel request failed:", error instanceof Error ? error.message : error);
    return Response.json(
      { jsonrpc: "2.0", id: null, error: { code: -32603, message: "Internal server error" } },
      { status: 500 },
    );
  } finally {
    await server.close();
  }
}

export const GET = handleMcpRequest;
export const POST = handleMcpRequest;
export const DELETE = handleMcpRequest;
