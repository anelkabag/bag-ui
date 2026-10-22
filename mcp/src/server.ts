import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { Component } from "../../vscode/src/types";
import { PACKAGE_MANAGERS, buildInstallCommand, registryItemUrl } from "../../vscode/src/utils/install";
import { categoryLabel } from "../../vscode/src/utils/registry";
import { RegistryStore } from "./registry";
import { loadComponentSource } from "./source";

type ToolResult = { content: Array<{ type: "text"; text: string }>; isError?: boolean };

const ok = (value: unknown): ToolResult => ({
  content: [{ type: "text", text: typeof value === "string" ? value : JSON.stringify(value, null, 2) }],
});

const fail = (error: unknown): ToolResult => ({
  content: [{
    type: "text",
    text: typeof error === "string" ? error : error instanceof Error ? error.message : "Unexpected error.",
  }],
  isError: true,
});

const summarize = (component: Component) => ({
  slug: component.name,
  title: component.title,
  description: component.description,
  category: component.category,
  tier: component.tier,
  tags: component.tags,
});

const readOnly = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true } as const;

export function createServer(version: string): McpServer {
  const store = new RegistryStore();
  const server = new McpServer({ name: "bagui", version });

  const categorySchema = z.string().min(1).optional().describe("Category slug, e.g. marketing, dashboard, navigation.");
  const tierSchema = z.enum(["free", "pro"]).optional().describe("Filter by plan.");

  server.registerTool(
    "list_categories",
    {
      title: "List BagUI categories",
      description: "List the categories of the BagUI registry with the number of components in each.",
      inputSchema: {},
      annotations: readOnly,
    },
    async () => {
      try {
        const categories = await store.categories();
        return ok(categories.map((entry) => ({ ...entry, label: categoryLabel(entry.category) })));
      } catch (error) {
        return fail(error);
      }
    },
  );

  server.registerTool(
    "list_components",
    {
      title: "List BagUI components",
      description: "List BagUI components, optionally filtered by category and plan (free/pro).",
      inputSchema: { category: categorySchema, tier: tierSchema },
      annotations: readOnly,
    },
    async ({ category, tier }) => {
      try {
        return ok((await store.search({ category, tier })).map(summarize));
      } catch (error) {
        return fail(error);
      }
    },
  );

  server.registerTool(
    "search_components",
    {
      title: "Search BagUI components",
      description:
        "Search BagUI components by keywords (title, description, tags, category). Use it to find the right hero, navbar, pricing, dashboard… block for a UI task.",
      inputSchema: {
        query: z.string().min(1).describe("Keywords, e.g. \"pricing table\" or \"dark dashboard\"."),
        category: categorySchema,
        tier: tierSchema,
        limit: z.number().int().min(1).max(50).default(10).describe("Maximum number of results."),
      },
      annotations: readOnly,
    },
    async ({ query, category, tier, limit }) => {
      try {
        const results = await store.search({ query, category, tier });
        return ok({ total: results.length, results: results.slice(0, limit).map(summarize) });
      } catch (error) {
        return fail(error);
      }
    },
  );

  server.registerTool(
    "get_component",
    {
      title: "Get a BagUI component",
      description:
        "Get everything about one component: metadata, dependencies, files, install command and, optionally, its full source code.",
      inputSchema: {
        slug: z.string().min(1).describe("Component slug, e.g. hero4 or navbar2."),
        include_source: z.boolean().default(false).describe("Also return the source code of every file."),
        package_manager: z.enum(PACKAGE_MANAGERS as [string, ...string[]]).default("npm"),
      },
      annotations: readOnly,
    },
    async ({ slug, include_source, package_manager }) => {
      try {
        const component = await store.find(slug);
        if (!component) {
          const suggestions = (await store.search({ query: slug })).slice(0, 5).map((c) => c.name);
          return fail(`Component "${slug}" not found.${suggestions.length ? ` Did you mean: ${suggestions.join(", ")}?` : ""}`);
        }

        const { homepage } = await store.get();
        const manager = package_manager as (typeof PACKAGE_MANAGERS)[number];
        const result: Record<string, unknown> = {
          ...summarize(component),
          version: component.version ?? "1.0.0",
          dependencies: component.dependencies ?? [],
          files: component.files.map((file) => ({ path: file.path, target: file.target })),
          installCommand: buildInstallCommand(component.name, homepage, manager),
          registryUrl: registryItemUrl(component.name, homepage),
          docsUrl: component.docsUrl ?? `${homepage}/docs`,
        };

        if (include_source) {
          result["source"] = await loadComponentSource(component.name, homepage);
        }
        return ok(result);
      } catch (error) {
        return fail(error);
      }
    },
  );

  server.registerTool(
    "get_install_command",
    {
      title: "Get the install command",
      description:
        "Get the shell command that installs a BagUI component into a shadcn/ui project. The command is returned, never executed.",
      inputSchema: {
        slug: z.string().min(1).describe("Component slug."),
        package_manager: z.enum(PACKAGE_MANAGERS as [string, ...string[]]).default("npm"),
      },
      annotations: readOnly,
    },
    async ({ slug, package_manager }) => {
      try {
        const component = await store.find(slug);
        if (!component) {
          return fail(`Component "${slug}" not found.`);
        }
        const { homepage } = await store.get();
        return ok(buildInstallCommand(component.name, homepage, package_manager as (typeof PACKAGE_MANAGERS)[number]));
      } catch (error) {
        return fail(error);
      }
    },
  );

  server.registerResource(
    "registry",
    "bagui://registry",
    { title: "BagUI registry", description: "Every BagUI component (summary).", mimeType: "application/json" },
    async (uri) => ({
      contents: [{
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify((await store.get()).components.map(summarize), null, 2),
      }],
    }),
  );

  server.registerResource(
    "component",
    new ResourceTemplate("bagui://component/{slug}", {
      list: async () => ({
        resources: (await store.get()).components.map((component) => ({
          uri: `bagui://component/${component.name}`,
          name: component.title,
          description: component.description,
          mimeType: "application/json",
        })),
      }),
    }),
    { title: "BagUI component", description: "Metadata of one BagUI component.", mimeType: "application/json" },
    async (uri, variables) => {
      const slug = Array.isArray(variables["slug"]) ? variables["slug"][0] : variables["slug"];
      const component = slug ? await store.find(slug) : undefined;
      if (!component) {
        throw new Error(`Component "${slug ?? ""}" not found.`);
      }
      return { contents: [{ uri: uri.href, mimeType: "application/json", text: JSON.stringify(component, null, 2) }] };
    },
  );

  return server;
}
