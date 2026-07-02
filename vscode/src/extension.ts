import * as path from "node:path";
import * as vscode from "vscode";
import { installCommand } from "./commands/install";
import { openCommand } from "./commands/open";
import { refreshCommand } from "./commands/refresh";
import { searchCommand } from "./commands/search";
import { ComponentTreeProvider } from "./providers/ComponentTreeProvider";
import { CacheService } from "./services/CacheService";
import { InstallService } from "./services/InstallService";
import { RegistryService } from "./services/RegistryService";
import { ComponentPreviewWebview } from "./webviews/ComponentPreview";

export function activate(context: vscode.ExtensionContext): void {
  const registryService = new RegistryService(context);
  const cacheService = new CacheService(context);
  const installService = new InstallService();
  const treeProvider = new ComponentTreeProvider(registryService, context);

  const registerCommand = (
    id: string,
    handler: (...args: unknown[]) => unknown,
  ) => {
    context.subscriptions.push(vscode.commands.registerCommand(id, handler));
  };

  const openCommandHandler = async () => {
    await openCommand(registryService);
  };

  const searchHandler = async () => {
    await searchCommand(registryService);
  };

  const refreshHandler = async () => {
    await refreshCommand(cacheService, registryService, treeProvider);
  };

  const installHandler = async (...args: unknown[]) => {
    const component = args[0] as { name: string } | undefined;
    if (!component?.name) {
      return;
    }

    const resolved = await registryService.getComponent(component.name);
    if (!resolved) {
      vscode.window.showErrorMessage("Component not found in registry");
      return;
    }

    await installCommand(installService, resolved);
  };

  const previewHandler = async (...args: unknown[]) => {
    const item = args[0] as { name: string } | undefined;
    if (!item?.name) {
      return;
    }

    const resolved = await registryService.getComponent(item.name);
    if (!resolved) {
      vscode.window.showErrorMessage("Component not found in registry");
      return;
    }

    await ComponentPreviewWebview.show(resolved);
  };

  const addFavoriteHandler = async (...args: unknown[]) => {
    const item = args[0] as { name: string } | undefined;
    if (!item?.name) {
      return;
    }

    const resolved = await registryService.getComponent(item.name);
    if (!resolved) {
      return;
    }

    await treeProvider.addFavorite(resolved);
    vscode.window.showInformationMessage(
      `Added ${resolved.title} to favorites`,
    );
  };

  const openDocumentationHandler = async (...args: unknown[]) => {
    const item = args[0] as { name: string } | undefined;
    if (!item?.name) {
      return;
    }

    const resolved = await registryService.getComponent(item.name);
    if (!resolved) {
      return;
    }

    await installService.openDocumentation(resolved);
  };

  registerCommand("bagui.open", openCommandHandler);
  registerCommand("bagui.searchComponent", searchHandler);
  registerCommand("bagui.refreshRegistry", refreshHandler);
  registerCommand("bagui.installComponent", installHandler);
  registerCommand("bagui.openDocumentation", openDocumentationHandler);
  registerCommand("bagui.addFavorite", addFavoriteHandler);
  registerCommand("bagui.preview", previewHandler);

  const treeView = vscode.window.createTreeView("bagui.components", {
    treeDataProvider: treeProvider,
    showCollapseAll: true,
  });

  context.subscriptions.push(treeView);

  treeView.onDidChangeSelection(async (event) => {
    const item = event.selection[0];
    if (!item?.id) {
      return;
    }

    if (item.contextValue === "component") {
      const autoPreview = vscode.workspace
        .getConfiguration("bagui")
        .get<boolean>("autoPreview", true);
      if (autoPreview) {
        const component = await registryService.getComponent(item.id);
        if (component) {
          await ComponentPreviewWebview.show(component);
        }
      }
    }
  });

  void (async () => {
    try {
      await cacheService.load();
      await registryService.getComponents();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load BagUI registry";
      vscode.window.showWarningMessage(message);
    }
  })();

  const statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100,
  );
  statusBar.text = "BagUI";
  statusBar.tooltip = "BagUI Studio";
  statusBar.command = "bagui.open";
  statusBar.show();
  context.subscriptions.push(statusBar);

  const mediaRoot = vscode.Uri.joinPath(context.extensionUri, "media");
  if (path.basename(mediaRoot.fsPath) !== "media") {
    // no-op for build stability
  }
}

export function deactivate(): void {
  // no-op
}
