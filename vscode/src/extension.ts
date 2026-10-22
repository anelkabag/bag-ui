import * as vscode from "vscode";
import { registerCommands } from "./commands";
import { ComponentTreeProvider } from "./providers/ComponentTreeProvider";
import { CacheService } from "./services/CacheService";
import { FavoritesService } from "./services/FavoritesService";
import { InstallService } from "./services/InstallService";
import { RegistryService } from "./services/RegistryService";
import { ComponentPreviewWebview } from "./webviews/ComponentPreview";

export function activate(context: vscode.ExtensionContext): void {
  const cache = new CacheService(context);
  const registry = new RegistryService(context, cache);
  const favorites = new FavoritesService(context);
  const installer = new InstallService();
  const preview = new ComponentPreviewWebview(context, registry, installer);
  const tree = new ComponentTreeProvider(registry, favorites);

  const treeView = vscode.window.createTreeView("bagui.components", {
    treeDataProvider: tree,
    showCollapseAll: true,
  });

  context.subscriptions.push(
    registry,
    favorites,
    preview,
    tree,
    treeView,
    ...registerCommands({ registry, installer, favorites, preview }),
    // A changed source (path / API URL) must reload the registry.
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration("bagui.registryPath") || event.affectsConfiguration("bagui.apiUrl")) {
        void registry.refresh().catch((error: unknown) => {
          void vscode.window.showErrorMessage(
            error instanceof Error ? error.message : "Unable to load the BagUI registry.",
          );
        });
      }
    }),
  );
}

export function deactivate(): void {
  // Everything is disposed through context.subscriptions.
}
