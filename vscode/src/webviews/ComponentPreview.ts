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
  --bg: #f8fafc; --surface: rgba(255,255,255,0.88); --surface-strong: #ffffff; --surface-alt: #f1f5f9; --border: rgba(148,163,184,0.35);
  --text: #0f172a; --muted: #475569; --hero: linear-gradient(135deg, #ffffff 0%, #f5f3ff 38%, #ecfeff 100%);
  --shadow: 0 18px 42px rgba(15,23,42,0.08); --ring: rgba(124,58,237,0.22); --accent: #7c3aed; --accent-2: #4f46e5;`;

const DARK_PALETTE = `
  --bg: #020817; --surface: rgba(15,23,42,0.86); --surface-strong: #0f172a; --surface-alt: #111827; --border: rgba(148,163,184,0.22);
  --text: #e2e8f0; --muted: #94a3b8; --hero: linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(76,29,149,0.9) 100%);
  --shadow: 0 20px 50px rgba(2,6,23,0.38); --ring: rgba(168,85,247,0.32); --accent: #8b5cf6; --accent-2: #4f46e5;`;

const SYSTEM_PALETTE = `
  --bg: var(--vscode-editor-background); --surface: color-mix(in srgb, var(--vscode-editorWidget-background, var(--vscode-editor-background)) 90%, transparent); --surface-strong: var(--vscode-editorWidget-background, var(--vscode-editor-background));
  --surface-alt: var(--vscode-input-background); --border: var(--vscode-widget-border, var(--vscode-panel-border, rgba(128,128,128,.35)));
  --text: var(--vscode-foreground); --muted: var(--vscode-descriptionForeground); --hero: linear-gradient(135deg, color-mix(in srgb, var(--vscode-editor-background) 80%, #7c3aed) 0%, color-mix(in srgb, var(--vscode-editor-background) 70%, #4f46e5) 100%);
  --shadow: 0 20px 48px rgba(15,23,42,0.18); --ring: rgba(124,58,237,0.28); --accent: color-mix(in srgb, var(--vscode-foreground) 8%, #7c3aed); --accent-2: #4f46e5;`;

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
    :root { color-scheme: ${scheme}; ${palette}; }
    * { box-sizing: border-box; }
    html, body { min-height: 100%; }
    body {
      margin: 0; padding: 0; background:
        radial-gradient(circle at top left, rgba(124, 58, 237, 0.12), transparent 30%),
        radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.12), transparent 28%),
        var(--bg);
      color: var(--text);
      font-family: var(--vscode-font-family, system-ui, sans-serif);
      line-height: 1.5;
    }
    .shell {
      max-width: 980px; margin: 0 auto; padding: 28px 24px 32px; display: grid; gap: 18px;
    }
    .hero {
      border-radius: 24px; padding: 26px 28px 24px; background: var(--hero); border: 1px solid var(--border);
      box-shadow: var(--shadow); overflow: hidden; position: relative;
    }
    .hero::before {
      content: ""; position: absolute; inset: 0 auto auto 0; width: 180px; height: 180px;
      background: rgba(255,255,255,0.28); border-radius: 999px; filter: blur(28px);
      transform: translate(-20%, -20%);
    }
    .hero > * { position: relative; z-index: 1; }
    .badge {
      display: inline-flex; align-items: center; justify-content: center; padding: 5px 12px; border-radius: 9999px;
      font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #fff;
      background: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%);
      box-shadow: 0 8px 18px rgba(124, 58, 237, 0.25);
    }
    .hero h1 { margin: 14px 0 8px; font-size: clamp(30px, 4vw, 42px); line-height: 1.1; letter-spacing: -0.04em; }
    .hero p { margin: 0 0 20px; color: var(--muted); max-width: 62ch; font-size: 15px; }
    .actions { display: flex; flex-wrap: wrap; gap: 10px; }
    button {
      appearance: none; border: 1px solid var(--border); padding: 10px 16px; border-radius: 12px; cursor: pointer;
      font: inherit; font-weight: 600; background: rgba(255,255,255,0.55); color: var(--text);
      box-shadow: 0 1px 0 rgba(255,255,255,0.5) inset; backdrop-filter: blur(8px);
    }
    button:hover { filter: brightness(1.06); }
    button:focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; }
    button.primary {
      background: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%); border-color: transparent; color: #fff;
      box-shadow: 0 12px 22px rgba(124, 58, 237, 0.25);
    }
    .grid { display: grid; gap: 18px; grid-template-columns: 1.35fr 0.95fr; }
    @media (max-width: 720px) { .grid { grid-template-columns: 1fr; } }
    .card {
      border-radius: 20px; padding: 18px 18px 16px; background: var(--surface); border: 1px solid var(--border);
      box-shadow: var(--shadow);
    }
    .card h2 {
      margin: 0 0 12px; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted);
    }
    img, .placeholder {
      display: block; width: 100%; border-radius: 16px; max-height: 280px; object-fit: cover; overflow: hidden;
      border: 1px solid var(--border); background: var(--surface-alt); box-shadow: inset 0 1px 0 rgba(255,255,255,0.2);
    }
    .placeholder {
      height: 220px; display: flex; align-items: center; justify-content: center; text-align: center; padding: 18px;
      font-weight: 700; font-size: 18px; color: #fff; background: linear-gradient(135deg, #4f46e5, #8b5cf6);
    }
    dl {
      margin: 0; display: grid; grid-template-columns: auto 1fr; gap: 10px 18px; align-items: center;
    }
    dt { color: var(--muted); font-size: 13px; }
    dd { margin: 0; font-weight: 600; text-align: right; word-break: break-word; }
    .pills { margin-top: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
    .pill {
      display: inline-flex; align-items: center; padding: 5px 10px; border-radius: 999px; font-size: 12px; font-weight: 600;
      background: var(--surface-alt); border: 1px solid var(--border); color: var(--text);
    }
    code {
      display: block; padding: 12px 14px; border-radius: 12px; background: rgba(15, 23, 42, 0.02); border: 1px solid var(--border);
      font-family: var(--vscode-editor-font-family, monospace); font-size: 12px; overflow-x: auto; white-space: nowrap;
      color: var(--text);
    }
    @media (prefers-color-scheme: dark) {
      code { background: rgba(148, 163, 184, 0.08); }
    }
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
