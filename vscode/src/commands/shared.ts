import * as vscode from "vscode";
import type { Component } from "../types";
import { pickComponent } from "../ui/ComponentPicker";
import { resolveSlug } from "../utils/args";
import { toErrorMessage } from "../utils/errors";
import type { CommandContext } from "./context";

/** Runs a command body and reports any error to the user instead of failing silently. */
export async function guarded(action: () => Promise<void>, fallback: string): Promise<void> {
  try {
    await action();
  } catch (error) {
    void vscode.window.showErrorMessage(toErrorMessage(error, fallback));
  }
}

/**
 * Resolves the component a command should act on: from its argument when
 * there is one, otherwise by asking the user in a QuickPick.
 */
export async function resolveComponent(
  ctx: CommandContext,
  arg: unknown,
  placeHolder: string,
): Promise<Component | undefined> {
  const slug = resolveSlug(arg);
  if (slug) {
    const component = await ctx.registry.getComponent(slug);
    if (!component) {
      throw new Error(`Component "${slug}" was not found in the BagUI registry.`);
    }
    return component;
  }
  return pickComponent(ctx.registry, placeHolder);
}
