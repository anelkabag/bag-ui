import * as vscode from "vscode";
import type { CommandContext } from "./context";
import { guarded } from "./shared";

/** BagUI: Refresh Registry */
export function refreshCommand(ctx: CommandContext): Promise<void> {
  return guarded(async () => {
    await vscode.window.withProgress(
      { location: vscode.ProgressLocation.Window, title: "BagUI: refreshing registry…" },
      () => ctx.registry.refresh(),
    );
    void vscode.window.showInformationMessage("BagUI registry refreshed.");
  }, "Unable to refresh the BagUI registry.");
}
