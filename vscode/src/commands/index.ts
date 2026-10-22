import * as vscode from "vscode";
import type { CommandContext } from "./context";
import { addFavoriteCommand, removeFavoriteCommand } from "./favorites";
import { installCommand, openDocumentationCommand } from "./install";
import { openCommand } from "./open";
import { refreshCommand } from "./refresh";
import { previewCommand, searchCommand } from "./search";

export function registerCommands(ctx: CommandContext): vscode.Disposable[] {
  const register = (id: string, handler: (arg: unknown) => Promise<void>): vscode.Disposable =>
    vscode.commands.registerCommand(id, (arg?: unknown) => handler(arg));

  return [
    register("bagui.open", () => openCommand()),
    register("bagui.searchComponent", () => searchCommand(ctx)),
    register("bagui.refreshRegistry", () => refreshCommand(ctx)),
    register("bagui.installComponent", (arg) => installCommand(ctx, arg)),
    register("bagui.openDocumentation", (arg) => openDocumentationCommand(ctx, arg)),
    register("bagui.preview", (arg) => previewCommand(ctx, arg)),
    register("bagui.addFavorite", (arg) => addFavoriteCommand(ctx, arg)),
    register("bagui.removeFavorite", (arg) => removeFavoriteCommand(ctx, arg)),
  ];
}
