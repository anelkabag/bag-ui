import * as vscode from "vscode";
import type { CommandContext } from "./context";
import { guarded, resolveComponent } from "./shared";

export function addFavoriteCommand(ctx: CommandContext, arg: unknown): Promise<void> {
  return guarded(async () => {
    const component = await resolveComponent(ctx, arg, "Select a component to add to favorites");
    if (!component) {
      return;
    }
    await ctx.favorites.add(component.name);
    void vscode.window.showInformationMessage(`Added ${component.title} to favorites.`);
  }, "Unable to add this component to favorites.");
}

export function removeFavoriteCommand(ctx: CommandContext, arg: unknown): Promise<void> {
  return guarded(async () => {
    const component = await resolveComponent(ctx, arg, "Select a favorite to remove");
    if (component) {
      await ctx.favorites.remove(component.name);
    }
  }, "Unable to remove this component from favorites.");
}
