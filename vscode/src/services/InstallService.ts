import * as vscode from "vscode";
import type { RegistryItem } from "../types";

export class InstallService {
  async installComponent(component: RegistryItem): Promise<void> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      throw new Error(
        "No workspace is opened. Open a folder before installing a component.",
      );
    }

    const terminal = vscode.window.createTerminal({
      name: "BagUI Install",
      cwd: workspaceFolders[0].uri.fsPath,
    });

    terminal.show(true);
    terminal.sendText(`npx bagui add ${component.name}`, true);
  }

  async openDocumentation(component: RegistryItem): Promise<void> {
    const docsUrl = component.docsUrl ?? "https://bagui.vercel.app/docs";
    await vscode.env.openExternal(vscode.Uri.parse(docsUrl));
  }
}
