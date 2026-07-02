import * as vscode from "vscode";
import { RegistryService } from "../services/RegistryService";
import { ComponentPreviewWebview } from "../webviews/ComponentPreview";

export async function searchCommand(
  registryService: RegistryService,
): Promise<void> {
  const items = await registryService.getComponents();

  const quickPick = vscode.window.createQuickPick<
    vscode.QuickPickItem & { component: (typeof items)[number] }
  >();
  quickPick.items = items.map((component) => ({
    label: component.title,
    description: component.description,
    detail: `${component.category ?? "General"} • ${component.access?.tier ?? "free"}`,
    component,
  }));
  quickPick.placeholder = "Search BagUI components";
  quickPick.matchOnDescription = true;
  quickPick.matchOnDetail = true;

  quickPick.onDidChangeValue((value) => {
    const filtered = items.filter((component) => {
      const haystack = [
        component.title,
        component.description,
        component.name,
        component.category ?? "",
        ...(component.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(value.toLowerCase());
    });

    quickPick.items = filtered.map((component) => ({
      label: component.title,
      description: component.description,
      detail: `${component.category ?? "General"} • ${component.access?.tier ?? "free"}`,
      component,
    }));
  });

  quickPick.onDidAccept(async () => {
    const selected = quickPick.selectedItems[0] as
      | (vscode.QuickPickItem & { component: (typeof items)[number] })
      | undefined;
    if (!selected) {
      return;
    }
    quickPick.dispose();
    await ComponentPreviewWebview.show(selected.component);
  });

  quickPick.onDidHide(() => quickPick.dispose());
  quickPick.show();
}
