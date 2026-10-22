import * as fs from "node:fs";
import * as path from "node:path";
import { registryItemUrl } from "../../vscode/src/utils/install";
import { isSafeSlug } from "../../vscode/src/utils/registry";
import { fetchWithTimeout } from "./registry";

export interface SourceFile {
  path: string;
  target?: string;
  content: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Loads the source code of a component from its built shadcn registry item
 * (<homepage>/r/<slug>.json), or from BAGUI_REGISTRY_DIR when set
 * (e.g. the repository's public/r folder).
 */
export async function loadComponentSource(slug: string, homepage: string): Promise<SourceFile[]> {
  if (!isSafeSlug(slug)) {
    throw new Error(`Unsafe component name: ${slug}`);
  }

  const dir = process.env["BAGUI_REGISTRY_DIR"]?.trim();
  let json: unknown;
  if (dir) {
    json = JSON.parse(await fs.promises.readFile(path.join(path.resolve(dir), `${slug}.json`), "utf8"));
  } else {
    try {
      json = await (await fetchWithTimeout(registryItemUrl(slug, homepage))).json();
    } catch (error) {
      const reason = error instanceof Error ? error.message : "unknown error";
      const gated = /HTTP (401|403)/.test(reason) ? " This is likely a Pro component that requires authentication." : "";
      throw new Error(`Source code unavailable for "${slug}": ${reason}.${gated}`);
    }
  }

  if (!isRecord(json) || !Array.isArray(json["files"])) {
    throw new Error(`Invalid registry item for "${slug}".`);
  }

  return json["files"].filter(isRecord).flatMap((file) =>
    typeof file["path"] === "string" && typeof file["content"] === "string"
      ? [{
          path: file["path"],
          target: typeof file["target"] === "string" ? file["target"] : undefined,
          content: file["content"],
        }]
      : [],
  );
}
