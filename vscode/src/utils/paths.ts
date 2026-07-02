import * as path from "node:path";
import * as fs from "node:fs";
import * as vscode from "vscode";

export function resolveRegistryPath(
    context: vscode.ExtensionContext,
    configuredPath?: string
): string {
  if (configuredPath && configuredPath.trim().length > 0) {
    const normalizedPath = configuredPath.trim();
    if (path.isAbsolute(normalizedPath)) {
      return normalizedPath;
    }

    const folder = vscode.workspace.workspaceFolders?.[0];
    const base = folder ? folder.uri.fsPath : process.cwd();
    return path.resolve(base, normalizedPath);
  }

  // 1. Chercher dans le(s) workspace(s) ouvert(s)
  for (const folder of vscode.workspace.workspaceFolders ?? []) {
    const candidate = path.join(folder.uri.fsPath, "registry.json");
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  // 2. Fallback propre : dossier de l'extension elle-même (fourni par VSCode)
  const bundled = path.join(context.extensionPath, "registry.json");
  if (fs.existsSync(bundled)) {
    return bundled;
  }

  // 3. Rien trouvé : chemin par défaut dans le workspace (ou extensionPath)
  const fallbackFolder =
      vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? context.extensionPath;

  return path.join(fallbackFolder, "registry.json");
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