import * as vscode from "vscode";
import { CacheService } from "../services/CacheService";
import { RegistryService } from "../services/RegistryService";
import { ComponentTreeProvider } from "../providers/ComponentTreeProvider";

export async function refreshCommand(
  cacheService: CacheService,
  registryService: RegistryService,
  treeProvider: ComponentTreeProvider,
): Promise<void> {
  try {
    await cacheService.clear();
    await registryService.getComponents();
    treeProvider.refresh();
    vscode.window.showInformationMessage("BagUI registry refreshed");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to refresh registry";
    vscode.window.showErrorMessage(message);
  }
}
