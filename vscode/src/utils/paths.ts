import * as path from "node:path";
import * as fs from "node:fs";
import * as vscode from "vscode";

export function resolveRegistryPath(configuredPath?: string): string {
  if (configuredPath && configuredPath.trim().length > 0) {
    return configuredPath;
  }

  for (const folder of vscode.workspace.workspaceFolders ?? []) {
    const workspaceRoot = folder.uri.fsPath;
    const registryPath = path.join(workspaceRoot, "registry.json");
    if (fs.existsSync(registryPath)) {
      return registryPath;
    }

    const extensionRegistryPath = path.join(
      workspaceRoot,
      "vscode",
      "registry.json",
    );
    if (fs.existsSync(extensionRegistryPath)) {
      return extensionRegistryPath;
    }
  }

  const fallbackRoot = path.resolve(__dirname, "..", "..");
  const defaultPath = path.join(fallbackRoot, "registry.json");

  if (fs.existsSync(defaultPath)) {
    return defaultPath;
  }

  return path.join(fallbackRoot, "vscode", "registry.json");
}

export function toDisplayCategory(category: string): string {
  const map: Record<string, string> = {
    marketing: "Marketing",
    dashboard: "Dashboard",
    authentication: "Authentication",
    forms: "Forms",
    buttons: "Buttons",
    cards: "Cards",
    navigation: "Navigation",
    favorites: "Favorites",
  };

  return map[category.toLowerCase()] ?? category;
}
