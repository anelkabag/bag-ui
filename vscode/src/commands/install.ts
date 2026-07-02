import * as vscode from "vscode";
import { InstallService } from "../services/InstallService";
import type { RegistryItem } from "../types";

export async function installCommand(
  installService: InstallService,
  component: RegistryItem,
): Promise<void> {
  try {
    await installService.installComponent(component);
    vscode.window.showInformationMessage(
      `Installation command started for ${component.title}`,
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown installation error";
    vscode.window.showErrorMessage(message);
  }
}
