import * as vscode from "vscode";
import type { Component } from "../types";
import type { InstallService } from "../services/InstallService";
import type { RegistryService } from "../services/RegistryService";
import { createNonce, escapeHtml, isSafeImageSource } from "../utils/html";
import { categoryLabel } from "../utils/registry";
import type { ComponentPreviewWebview } from "./ComponentPreview";

type GalleryMessage = "install" | "preview" | "refresh";

function isGalleryMessage(
  value: unknown,
): value is { type: GalleryMessage; name?: string } {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const message = value as { type?: unknown; name?: unknown };
  return (
    (message.type === "install" || message.type === "preview") &&
    typeof message.name === "string"
  ) || message.type === "refresh";
}

export class ComponentGalleryWebview implements vscode.Disposable {
  private panel: vscode.WebviewPanel | undefined;
  private components: Component[] = [];
  private homepage = "https://bagui.pro";
  private readonly registrySubscription: vscode.Disposable;

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly registry: RegistryService,
    private readonly installer: InstallService,
    private readonly preview: ComponentPreviewWebview,
  ) {
    this.registrySubscription = registry.onDidChange(() => {
      void this.update().catch((error: unknown) => {
        void vscode.window.showErrorMessage(
          error instanceof Error ? error.message : "Unable to update the BagUI gallery.",
        );
      });
    });
  }

  dispose(): void {
    this.registrySubscription.dispose();
    this.panel?.dispose();
  }

  async open(): Promise<void> {
    await this.loadComponents();
    if (!this.panel) {
      this.panel = this.createPanel();
    }
    this.panel.title = "BagUI Components";
    this.panel.webview.html = this.render(this.panel.webview);
    this.panel.reveal(vscode.ViewColumn.Active);
  }

  private async update(): Promise<void> {
    if (!this.panel) {
      return;
    }
    await this.loadComponents();
    if (this.panel) {
      this.panel.webview.html = this.render(this.panel.webview);
    }
  }

  private async loadComponents(): Promise<void> {
    [this.components, this.homepage] = await Promise.all([
      this.registry.getComponents(),
      this.registry.getHomepage(),
    ]);
  }

  private createPanel(): vscode.WebviewPanel {
    const panel = vscode.window.createWebviewPanel(
      "baguiGallery",
      "BagUI Components",
      vscode.ViewColumn.Active,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(this.context.extensionUri, "media")],
      },
    );

    panel.onDidDispose(() => {
      this.panel = undefined;
    });

    panel.webview.onDidReceiveMessage(async (message: unknown) => {
      if (!isGalleryMessage(message)) {
        return;
      }

      try {
        if (message.type === "refresh") {
          await vscode.commands.executeCommand("bagui.refreshRegistry");
          return;
        }

        const component = this.components.find((item) => item.name === message.name);
        if (!component) {
          throw new Error("The selected component is no longer in the BagUI registry.");
        }

        if (message.type === "preview") {
          await this.preview.show(component);
        } else {
          await this.installer.install(component, this.homepage);
          void vscode.window.showInformationMessage(`Installing ${component.title}…`);
        }
      } catch (error) {
        void vscode.window.showErrorMessage(
          error instanceof Error ? error.message : "Unable to perform this BagUI action.",
        );
      }
    });

    return panel;
  }

  private render(webview: vscode.Webview): string {
    const nonce = createNonce();
    const categories = Array.from(
      new Set(this.components.map((component) => component.category)),
    ).sort((a, b) => categoryLabel(a).localeCompare(categoryLabel(b)));
    const cards = this.components
      .map((component) => {
        const name = escapeHtml(component.name);
        const title = escapeHtml(component.title);
        const description = escapeHtml(component.description || "BagUI component");
        const category = escapeHtml(component.category);
        const categoryName = escapeHtml(categoryLabel(component.category));
        const searchText = escapeHtml(
          `${component.title} ${component.name} ${component.description} ${component.category} ${component.tags.join(" ")}`.toLowerCase(),
        );
        const image =
          component.image && isSafeImageSource(component.image)
            ? `<img class="thumbnail" src="${escapeHtml(component.image)}" alt="" loading="lazy" />`
            : `<div class="thumbnail placeholder" aria-hidden="true"><span>${categoryName}</span></div>`;

        return `
          <article class="component-card" data-category="${category}" data-search="${searchText}">
            <div class="thumbnail-wrap">${image}<span class="tier ${component.tier}">${component.tier}</span></div>
            <div class="card-content">
              <p class="category">${categoryName}</p>
              <h2>${title}</h2>
              <p class="description">${description}</p>
              <div class="actions">
                <button class="secondary" data-action="preview" data-name="${name}">Preview</button>
                <button class="primary" data-action="install" data-name="${name}">Install</button>
              </div>
            </div>
          </article>`;
      })
      .join("");
    const categoryOptions = categories
      .map(
        (category) =>
          `<option value="${escapeHtml(category)}">${escapeHtml(categoryLabel(category))}</option>`,
      )
      .join("");
    const csp = [
      "default-src 'none'",
      `img-src ${webview.cspSource} https: data:`,
      `style-src 'nonce-${nonce}'`,
      `script-src 'nonce-${nonce}'`,
    ].join("; ");

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Security-Policy" content="${csp}" />
  <title>BagUI Components</title>
  <style nonce="${nonce}">
    :root {
      color-scheme: var(--vscode-color-scheme);
      --border: var(--vscode-widget-border, var(--vscode-panel-border, rgba(128,128,128,.35)));
      --muted: var(--vscode-descriptionForeground);
      --surface: var(--vscode-editorWidget-background, var(--vscode-editor-background));
      --accent: var(--vscode-button-background);
      --accent-text: var(--vscode-button-foreground);
    }
    * { box-sizing: border-box; }
    body { margin: 0; padding: 26px; color: var(--vscode-foreground); background: var(--vscode-editor-background); font-family: var(--vscode-font-family, sans-serif); }
    .shell { max-width: 1280px; margin: 0 auto; }
    header { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 22px; }
    h1 { margin: 0 0 5px; font-size: 24px; }
    .subtitle { margin: 0; color: var(--muted); font-size: 13px; }
    .toolbar { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
    input, select, button { min-height: 34px; border: 1px solid var(--border); border-radius: 6px; color: var(--vscode-input-foreground, var(--vscode-foreground)); background: var(--vscode-input-background, var(--surface)); font: inherit; }
    input, select { padding: 0 10px; }
    input { flex: 1; min-width: 200px; }
    button { padding: 0 12px; cursor: pointer; }
    button:hover { filter: brightness(1.12); }
    button:focus-visible, input:focus-visible, select:focus-visible { outline: 1px solid var(--vscode-focusBorder); outline-offset: 1px; }
    .refresh { color: var(--vscode-foreground); }
    .count { margin: 0 0 12px; color: var(--muted); font-size: 12px; }
    .gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(245px, 1fr)); gap: 14px; }
    .component-card { min-width: 0; overflow: hidden; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); }
    .thumbnail-wrap { position: relative; height: 150px; overflow: hidden; border-bottom: 1px solid var(--border); background: var(--vscode-sideBar-background, var(--surface)); }
    .thumbnail { display: flex; width: 100%; height: 100%; align-items: center; justify-content: center; object-fit: cover; }
    .placeholder { color: var(--muted); background: linear-gradient(140deg, var(--vscode-editor-background), var(--surface)); font-size: 13px; font-weight: 600; }
    .tier { position: absolute; top: 9px; right: 9px; padding: 3px 8px; border: 1px solid var(--border); border-radius: 999px; background: var(--surface); font-size: 10px; text-transform: uppercase; }
    .tier.pro { color: var(--vscode-editorWarning-foreground, var(--muted)); }
    .card-content { padding: 13px; }
    .category { margin: 0 0 5px; color: var(--muted); font-size: 11px; text-transform: uppercase; letter-spacing: .06em; }
    h2 { overflow: hidden; margin: 0; font-size: 15px; text-overflow: ellipsis; white-space: nowrap; }
    .description { display: -webkit-box; min-height: 38px; overflow: hidden; margin: 7px 0 12px; color: var(--muted); font-size: 12px; line-height: 1.55; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
    .actions { display: flex; gap: 8px; }
    .actions button { flex: 1; }
    .primary { border-color: var(--accent); color: var(--accent-text); background: var(--accent); }
    .secondary { color: var(--vscode-foreground); }
    .empty { display: none; padding: 36px 12px; color: var(--muted); text-align: center; }
    @media (max-width: 520px) { body { padding: 16px; } header { align-items: flex-start; flex-direction: column; } }
  </style>
</head>
<body>
  <main class="shell">
    <header>
      <div><h1>BagUI Components</h1><p class="subtitle">Browse the live registry, preview a block, and install it into your project.</p></div>
      <button class="refresh" data-action="refresh">Refresh registry</button>
    </header>
    <div class="toolbar">
      <input id="search" type="search" placeholder="Search components…" aria-label="Search components" />
      <select id="category" aria-label="Filter by category"><option value="">All categories</option>${categoryOptions}</select>
    </div>
    <p class="count" id="count">${this.components.length} components</p>
    <section class="gallery" id="gallery">${cards}</section>
    <p class="empty" id="empty">No components match your search.</p>
  </main>
  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    const cards = [...document.querySelectorAll(".component-card")];
    const search = document.getElementById("search");
    const category = document.getElementById("category");
    const count = document.getElementById("count");
    const empty = document.getElementById("empty");
    function filterCards() {
      const query = search.value.trim().toLowerCase();
      let visible = 0;
      for (const card of cards) {
        const matches = card.dataset.search.includes(query) &&
          (!category.value || card.dataset.category === category.value);
        card.hidden = !matches;
        if (matches) visible += 1;
      }
      count.textContent = visible + (visible === 1 ? " component" : " components");
      empty.style.display = visible === 0 ? "block" : "none";
    }
    search.addEventListener("input", filterCards);
    category.addEventListener("change", filterCards);
    document.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) {
        return;
      }
      const button = event.target.closest("button[data-action]");
      if (button instanceof HTMLButtonElement) {
        vscode.postMessage({
          type: button.dataset.action,
          name: button.dataset.name,
        });
      }
    });
  </script>
</body>
</html>`;
  }
}
