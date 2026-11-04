import { timingSafeEqual, randomUUID } from "node:crypto";
import { createServer as createHttpServer, type IncomingMessage, type ServerResponse } from "node:http";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "./server";

type Session = {
  transport: StreamableHTTPServerTransport;
};

const MCP_PATH = "/mcp";
const HEALTH_PATH = "/healthz";
const sessions = new Map<string, Session>();

function isAuthorized(request: IncomingMessage): boolean {
  const token = process.env["MCP_AUTH_TOKEN"];
  if (!token) {
    return true;
  }

  const authorization = request.headers.authorization;
  const expected = Buffer.from(`Bearer ${token}`);
  const received = Buffer.from(typeof authorization === "string" ? authorization : "");
  return expected.length === received.length && timingSafeEqual(expected, received);
}

function respond(
  response: ServerResponse,
  statusCode: number,
  body: Record<string, string>,
): void {
  response.writeHead(statusCode, { "content-type": "application/json" });
  response.end(JSON.stringify(body));
}

async function createSession(version: string): Promise<Session> {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: randomUUID,
    allowedHosts: process.env["MCP_ALLOWED_HOSTS"]?.split(",").map((host) => host.trim()).filter(Boolean),
    enableDnsRebindingProtection: Boolean(process.env["MCP_ALLOWED_HOSTS"]),
  });
  const server = createServer(version);
  await server.connect(transport);
  const session = { transport };
  transport.onclose = () => {
    const sessionId = transport.sessionId;
    if (sessionId) {
      sessions.delete(sessionId);
    }
    void server.close();
  };
  return session;
}

async function handleMcpRequest(
  request: IncomingMessage,
  response: ServerResponse,
  version: string,
): Promise<void> {
  const requestUrl = new URL(request.url ?? "/", "http://localhost");
  if (requestUrl.pathname === HEALTH_PATH && request.method === "GET") {
    respond(response, 200, { status: "ok" });
    return;
  }
  if (!isAuthorized(request)) {
    response.setHeader("www-authenticate", "Bearer");
    respond(response, 401, { error: "Unauthorized" });
    return;
  }
  if (requestUrl.pathname !== MCP_PATH) {
    respond(response, 404, { error: "Not found" });
    return;
  }

  const sessionId = request.headers["mcp-session-id"];
  let session = typeof sessionId === "string" ? sessions.get(sessionId) : undefined;
  if (typeof sessionId === "string" && !session) {
    respond(response, 404, { error: "MCP session not found" });
    return;
  }
  if (!session && request.method === "POST") {
    session = await createSession(version);
  }
  if (!session) {
    respond(response, 400, { error: "An MCP session ID is required" });
    return;
  }

  await session.transport.handleRequest(request, response);
  if (typeof sessionId !== "string" && session.transport.sessionId) {
    sessions.set(session.transport.sessionId, session);
  }
}

export async function startHttpServer(version: string): Promise<void> {
  const port = Number(process.env["PORT"] ?? process.env["MCP_PORT"] ?? 3001);
  const host = process.env["MCP_HOST"] ?? "127.0.0.1";
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT or MCP_PORT must be a valid TCP port.");
  }

  const httpServer = createHttpServer((request, response) => {
    void handleMcpRequest(request, response, version).catch((error: unknown) => {
      console.error("[bagui-mcp] HTTP request failed:", error instanceof Error ? error.message : error);
      if (!response.headersSent) {
        respond(response, 500, { error: "Internal server error" });
      } else {
        response.destroy();
      }
    });
  });

  await new Promise<void>((resolve, reject) => {
    httpServer.once("error", reject);
    httpServer.listen(port, host, resolve);
  });
  console.error(`[bagui-mcp] v${version} ready at http://${host}:${port}${MCP_PATH}`);
}
