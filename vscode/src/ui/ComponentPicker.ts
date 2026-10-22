import * as vscode from "vscode";
import type { Component } from "../types";
import { categoryLabel } from "../utils/registry";
import type { RegistryService } from "../services/RegistryService";

interface ComponentPickItem extends vscode.QuickPickItem {
  component: Component;
}

function toItem(component: Component): ComponentPickItem {
  return {
    label: component.title,
    description: component.description,
    detail: `${categoryLabel(component.category)} • ${component.tier === "pro" ? "Pro" : "Free"}`,
    // The registry service does the filtering; stop VS Code from filtering a second time.
    alwaysShow: true,
    component,
  };
}

/** Live-filtering QuickPick over the registry. Resolves to undefined when dismissed. */
export async function pickComponent(
  registry: RegistryService,
  placeHolder: string,
): Promise<Component | undefined> {
  const quickPick = vscode.window.createQuickPick<ComponentPickItem>();
  quickPick.placeholder = placeHolder;
  quickPick.matchOnDescription = true;
  quickPick.matchOnDetail = true;
  quickPick.busy = true;
  quickPick.show();

  try {
    quickPick.items = (await registry.getComponents()).map(toItem);
  } catch (error) {
    quickPick.dispose();
    throw error;
  }
  quickPick.busy = false;

  return new Promise<Component | undefined>((resolve) => {
    const disposables: vscode.Disposable[] = [];
    let settled = false;
    const finish = (value: Component | undefined): void => {
      if (settled) {
        return;
      }
      settled = true;
      resolve(value);
      disposables.forEach((disposable) => disposable.dispose());
      quickPick.dispose();
    };

    disposables.push(
      quickPick.onDidChangeValue(async (value) => {
        try {
          quickPick.items = (await registry.search(value)).map(toItem);
        } catch {
          quickPick.items = [];
        }
      }),
      quickPick.onDidAccept(() => finish(quickPick.selectedItems[0]?.component)),
      quickPick.onDidHide(() => finish(undefined)),
    );
  });
}
