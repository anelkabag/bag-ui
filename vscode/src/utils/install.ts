import { isSafeSlug } from "./registry";

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

export const PACKAGE_MANAGERS: readonly PackageManager[] = ["npm", "pnpm", "yarn", "bun"];

/** URL of the shadcn registry item for a component. */
export function registryItemUrl(slug: string, homepage: string): string {
  return `${homepage.replace(/\/+$/, "")}/r/${slug}.json`;
}

/** Shell command that installs a component into the current project. Pure: no VS Code dependency. */
export function buildInstallCommand(
  slug: string,
  homepage: string,
  manager: PackageManager = "npm",
): string {
  if (!isSafeSlug(slug)) {
    throw new Error(`Refusing to build an install command for an unsafe component name: ${slug}`);
  }

  const url = registryItemUrl(slug, homepage);
  switch (manager) {
    case "pnpm":
      return `pnpm dlx shadcn@latest add ${url}`;
    case "yarn":
      return `yarn dlx shadcn@latest add ${url}`;
    case "bun":
      return `bunx --bun shadcn@latest add ${url}`;
    default:
      return `npx shadcn@latest add ${url}`;
  }
}
