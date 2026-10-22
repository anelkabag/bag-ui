import type { TreeNode } from "../types";

/**
 * Commands can be invoked from the tree (TreeNode), from the webview or API
 * (slug string / { name }), or from the palette (nothing). This normalizes
 * whatever we received into a component slug.
 */
export function resolveSlug(arg: unknown): string | undefined {
  if (typeof arg === "string" && arg.length > 0) {
    return arg;
  }
  if (typeof arg !== "object" || arg === null) {
    return undefined;
  }
  const node = arg as Partial<TreeNode> & { name?: unknown };
  if (node.kind === "component" && node.component) {
    return node.component.name;
  }
  return typeof node.name === "string" ? node.name : undefined;
}
