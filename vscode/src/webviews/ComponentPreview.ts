import * as vscode from "vscode";
import type { Component } from "../types";
import type { InstallService } from "../services/InstallService";
import type { RegistryService } from "../services/RegistryService";
import { createNonce, escapeHtml, isSafeImageSource } from "../utils/html";
import { categoryLabel } from "../utils/registry";

type PreviewMessage = "install" | "copy-cli" | "docs";

function isPreviewMessage(value: unknown): value is { type: PreviewMessage } {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const type = (value as { type?: unknown }).type;
  return type === "install" || type === "copy-cli" || type === "docs";
}

const LIGHT_PALETTE = `
  --bg: #f8fafc; --surface: #ffffff; --surface-alt: #f1f5f9; --border: #e2e8f0;
  --text: #0f172a; --muted: #475569; --hero: linear-gradient(135deg, #ffffff 0%, #ede9fe 100%);`;

const DARK_PALETTE = `
  --bg: #0b1120; --surface: #111827; --surface-alt: #1e293b; --border: #334155;
  --text: #e2e8f0; --muted: #94a3b8; --hero: linear-gradient(135deg, #111827 0%, #312e81 100%);`;

const SYSTEM_PALETTE = `
  --bg: var(--vscode-editor-background); --surface: var(--vscode-editorWidget-background, var(--vscode-editor-background));
  --surface-alt: var(--vscode-input-background); --border: var(--vscode-widget-border, var(--vscode-panel-border, rgba(128,128,128,.35)));
  --text: var(--vscode-foreground); --muted: var(--vscode-descriptionForeground);
  --hero: linear-gradient(135deg, color-mix(in srgb, var(--vscode-editor-background) 85%, #7c3aed) 0%, color-mix(in srgb, var(--vscode-editor-background) 60%, #4f46e5) 100%);`;

export class ComponentPreviewWebview implements vscode.Disposable {
  private panel: vscode.WebviewPanel | undefined;
  private current: Component | undefined;

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly registry: RegistryService,
    private readonly installer: InstallService,
  ) {}

  dispose(): void {
    this.panel?.dispose();
  }

  async show(component: Component): Promise<void> {
    this.current = component;
    const homepage = await this.registry.getHomepage();
    const command = await this.installer.getCommand(component, homepage);

    if (!this.panel) {
      this.panel = this.createPanel();
    }
    this.panel.title = component.title;
    this.panel.webview.html = this.render(this.panel.webview, component, command);
    this.panel.reveal(vscode.ViewColumn.Beside, true);
  }

  private createPanel(): vscode.WebviewPanel {
    const panel = vscode.window.createWebviewPanel(
      "baguiPreview",
      "BagUI",
      { viewColumn: vscode.ViewColumn.Beside, preserveFocus: true },
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(this.context.extensionUri, "media")],
      },
    );

    panel.onDidDispose(() => {
      this.panel = undefined;
      this.current = undefined;
    });

    panel.webview.onDidReceiveMessage(async (message: unknown) => {
      const component = this.current;
      if (!component || !isPreviewMessage(message)) {
        return;
      }
      switch (message.type) {
        case "install":
          await vscode.commands.executeCommand("bagui.installComponent", component.name);
          break;
        case "copy-cli":
          await vscode.env.clipboard.writeText(
            await this.installer.getCommand(component, await this.registry.getHomepage()),
          );
          void vscode.window.showInformationMessage(`CLI command copied for ${component.title}`);
          break;
        case "docs":
          await vscode.commands.executeCommand("bagui.openDocumentation", component.name);
          break;
      }
    });

    return panel;
  }

  private render(webview: vscode.Webview, component: Component, command: string): string {
    const nonce = createNonce();
    const theme = vscode.workspace.getConfiguration("bagui").get<string>("theme", "system");
    const palette = theme === "dark" ? DARK_PALETTE : theme === "light" ? LIGHT_PALETTE : SYSTEM_PALETTE;
    const scheme = theme === "dark" ? "dark" : theme === "light" ? "light" : "light dark";
    const isPro = component.tier === "pro";
    const title = escapeHtml(component.title);
    const csp = [
      "default-src 'none'",
      `img-src ${webview.cspSource} https: data:`,
      `style-src 'nonce-${nonce}'`,
      `script-src 'nonce-${nonce}'`,
    ].join("; ");

    const image =
      component.image && isSafeImageSource(component.image)
        ? `<img src="${escapeHtml(component.image)}" alt="${title}" />`
        : `<div class="placeholder" role="img" aria-label="${title}"><span>${title}</span></div>`;

    const tags = component.tags.map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`).join("");

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Security-Policy" content="${csp}" />
  <title>${title}</title>
  <style nonce="${nonce}">
    :root { color-scheme: ${scheme}; ${palette} --accent: #7c3aed; }
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; background: var(--bg); color: var(--text);
      font-family: var(--vscode-font-family, system-ui, sans-serif); line-height: 1.5; }
    .shell { max-width: 960px; margin: 0 auto; padding: 24px; display: grid; gap: 16px; }
    .hero { border-radius: 20px; padding: 28px; background: var(--hero); border: 1px solid var(--border); }
    .hero h1 { margin: 12px 0 8px; font-size: 28px; }
    .hero p { margin: 0 0 20px; color: var(--muted); max-width: 60ch; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700;
      letter-spacing: .06em; text-transform: uppercase; color: #fff; background: ${isPro ? "#9333ea" : "#0284c7"}; }
    .actions { display: flex; flex-wrap: wrap; gap: 8px; }
    button { border: 1px solid var(--border); padding: 9px 14px; border-radius: 10px; cursor: pointer;
      font: inherit; font-weight: 600; background: var(--surface-alt); color: var(--text); }
    button:hover { filter: brightness(1.1); }
    button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    button.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
    .grid { display: grid; gap: 16px; grid-template-columns: 1.4fr 1fr; }
    @media (max-width: 720px) { .grid { grid-template-columns: 1fr; } }
    .card { border-radius: 16px; padding: 18px; background: var(--surface); border: 1px solid var(--border); }
    .card h2 { margin: 0 0 12px; font-size: 14px; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); }
    img, .placeholder { width: 100%; border-radius: 12px; max-height: 260px; object-fit: cover; }
    .placeholder { height: 220px; display: flex; align-items: center; justify-content: center; text-align: center;
      padding: 16px; font-weight: 700; font-size: 18px; color: #fff; background: linear-gradient(135deg, #4f46e5, #9333ea); }
    dl { margin: 0; display: grid; grid-template-columns: auto 1fr; gap: 8px 16px; }
    dt { color: var(--muted); } dd { margin: 0; text-align: right; word-break: break-word; }
    .pills { margin-top: 14px; display: flex; flex-wrap: wrap; gap: 6px; }
    .pill { padding: 3px 9px; border-radius: 999px; font-size: 12px; background: var(--surface-alt); border: 1px solid var(--border); }
    code { display: block; padding: 10px 12px; border-radius: 10px; background: var(--surface-alt);
      font-family: var(--vscode-editor-font-family, monospace); font-size: 12px; overflow-x: auto; white-space: nowrap; }
  </style>
</head>
<body>
  <main class="shell">
    <section class="hero">
      <span class="badge">${isPro ? "Pro" : "Free"}</span>
      <h1>${title}</h1>
      <p>${escapeHtml(component.description)}</p>
      <div class="actions">
        <button class="primary" data-action="install">Install</button>
        <button data-action="copy-cli">Copy CLI</button>
        <button data-action="docs">Open Documentation</button>
      </div>
    </section>
    <section class="grid">
      <div class="card"><h2>Preview</h2>${image}</div>
      <div class="card">
        <h2>Details</h2>
        <dl>
          <dt>Category</dt><dd>${escapeHtml(categoryLabel(component.category))}</dd>
          <dt>Version</dt><dd>${escapeHtml(component.version ?? "1.0.0")}</dd>
          <dt>Plan</dt><dd>${isPro ? "Pro" : "Free"}</dd>
        </dl>
        <div class="pills">${tags}</div>
      </div>
    </section>
    <section class="card"><h2>Install command</h2><code>${escapeHtml(command)}</code></section>
  </main>
  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    document.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", () => vscode.postMessage({ type: button.getAttribute("data-action") }));
    });
  </script>
</body>
</html>`;
  }
}
