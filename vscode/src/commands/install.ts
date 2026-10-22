import * as vscode from "vscode";
import type { CommandContext } from "./context";
import { guarded, resolveComponent } from "./shared";

/** BagUI: Install Component */
export function installCommand(ctx: CommandContext, arg: unknown): Promise<void> {
  return guarded(async () => {
    const component = await resolveComponent(ctx, arg, "Select a BagUI component to install");
    if (!component) {
      return;
    }
    await ctx.installer.install(component, await ctx.registry.getHomepage());
    void vscode.window.showInformationMessage(`Installing ${component.title}…`);
  }, "Unable to install this component.");
}

/** BagUI: Open Documentation */
export function openDocumentationCommand(ctx: CommandContext, arg: unknown): Promise<void> {
  return guarded(async () => {
    const homepage = await ctx.registry.getHomepage();
    const component = arg === undefined ? undefined : await resolveComponent(ctx, arg, "");
    await ctx.installer.openDocumentation(component, homepage);
  }, "Unable to open the documentation.");
}
