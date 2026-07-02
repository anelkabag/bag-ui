import * as vscode from "vscode";
import type { RegistryItem } from "../types";

export class ComponentPreviewWebview {
  static async show(component: RegistryItem): Promise<void> {
    const panel = vscode.window.createWebviewPanel(
      "baguiPreview",
      component.title,
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.joinPath(
            vscode.extensions.getExtension("bagui.bagui-studio")
              ?.extensionUri ?? vscode.Uri.file("/"),
            "media",
          ),
        ],
      },
    );

    const theme = vscode.workspace
      .getConfiguration("bagui")
      .get<string>("theme", "system");
    const mode =
      theme === "dark" ? "dark" : theme === "light" ? "light" : undefined;

    panel.webview.html = this.getHtml(component, mode);

    panel.webview.onDidReceiveMessage(async (message) => {
      switch (message.type) {
        case "install":
          await vscode.commands.executeCommand("bagui.installComponent", {
            name: component.name,
          });
          break;
        case "copy-cli":
          await vscode.env.clipboard.writeText(
            `npx bagui add ${component.name}`,
          );
          vscode.window.showInformationMessage(
            `CLI command copied for ${component.title}`,
          );
          break;
        case "docs":
          await vscode.commands.executeCommand("bagui.openDocumentation", {
            name: component.name,
          });
          break;
        default:
          break;
      }
    });
  }

  private static getHtml(component: RegistryItem, mode?: string): string {
    const badge = component.access?.tier === "pro" ? "Pro" : "Free";
    const theme = mode ?? "dark";
    const previewImage =
      component.image ??
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80";

    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      :root { color-scheme: ${theme}; }
      body { margin: 0; font-family: Inter, sans-serif; background: ${theme === "dark" ? "#0f172a" : "#f8fafc"}; color: ${theme === "dark" ? "#e2e8f0" : "#0f172a"}; }
      .shell { padding: 24px; display: grid; gap: 16px; }
      .hero { border-radius: 20px; padding: 24px; background: ${theme === "dark" ? "linear-gradient(135deg, #111827 0%, #312e81 100%)" : "linear-gradient(135deg, #ffffff 0%, #f5f3ff 100%)"}; box-shadow: 0 20px 50px rgba(15, 23, 42, 0.12); }
      .badge { display: inline-block; padding: 6px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; text-transform: uppercase; background: ${component.access?.tier === "pro" ? "#a855f7" : "#0ea5e9"}; color: white; }
      .grid { display: grid; gap: 16px; grid-template-columns: 1.3fr 0.7fr; }
      .card { border-radius: 16px; padding: 16px; background: ${theme === "dark" ? "#111827" : "#ffffff"}; border: 1px solid ${theme === "dark" ? "#334155" : "#e2e8f0"}; }
      .pill { display: inline-block; padding: 5px 8px; border-radius: 999px; margin-right: 8px; margin-bottom: 8px; font-size: 12px; background: ${theme === "dark" ? "#1e293b" : "#f1f5f9"}; }
      button { border: 0; padding: 10px 14px; border-radius: 10px; margin-right: 8px; cursor: pointer; font-weight: 600; }
      .primary { background: #7c3aed; color: white; }
      .secondary { background: ${theme === "dark" ? "#1f2937" : "#e2e8f0"}; color: ${theme === "dark" ? "#f8fafc" : "#111827"}; }
      img { width: 100%; border-radius: 16px; max-height: 240px; object-fit: cover; }
    </style>
    <script>
      const vscode = acquireVsCodeApi();
      function send(type) {
        vscode.postMessage({ type });
      }
    </script>
  </head>
  <body>
    <div class="shell">
      <div class="hero">
        <span class="badge">${badge}</span>
        <h1>${component.title}</h1>
        <p>${component.description}</p>
        <div>
          <button class="primary" onclick="send('install')">Install</button>
          <button class="secondary" onclick="send('copy-cli')">Copy CLI</button>
          <button class="secondary" onclick="send('docs')">Open Documentation</button>
        </div>
      </div>
      <div class="grid">
        <div class="card">
          <h3>Preview</h3>
          <img src="${previewImage}" alt="${component.title}" />
        </div>
        <div class="card">
          <h3>Details</h3>
          <p><strong>Category:</strong> ${component.category ?? "General"}</p>
          <p><strong>Tags:</strong> ${(component.tags ?? []).join(", ")}</p>
          <p><strong>Version:</strong> ${component.version ?? "1.0.0"}</p>
          <div>${(component.tags ?? []).map((tag: string) => `<span class="pill">${tag}</span>`).join("")}</div>
        </div>
      </div>
    </div>
  </body>
</html>`;
  }
}
