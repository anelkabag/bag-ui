import * as vscode from "vscode";
import { RegistryService } from "../services/RegistryService";
import { ComponentPreviewWebview } from "../webviews/ComponentPreview";

export async function openCommand(
  registryService: RegistryService,
): Promise<void> {
  const components = await registryService.getComponents();
  const selected = await vscode.window.showQuickPick(
    components.map((component) => ({
      label: component.title,
      description: component.description,
      component,
    })),
    { placeHolder: "Select a BagUI component to preview" },
  );

  if (!selected) {
    return;
  }

  await ComponentPreviewWebview.show(selected.component);
}
