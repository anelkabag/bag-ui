import * as vscode from "vscode";
import { guarded } from "./shared";

/** BagUI: Open — reveals the BagUI sidebar. */
export function openCommand(): Promise<void> {
  return guarded(async () => {
    await vscode.commands.executeCommand("workbench.view.extension.bagui");
  }, "Unable to open BagUI.");
}
