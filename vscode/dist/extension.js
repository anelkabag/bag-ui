"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var path2 = __toESM(require("node:path"));
var vscode10 = __toESM(require("vscode"));

// src/commands/install.ts
var vscode = __toESM(require("vscode"));
async function installCommand(installService, component) {
  try {
    await installService.installComponent(component);
    vscode.window.showInformationMessage(
      `Installation command started for ${component.title}`
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown installation error";
    vscode.window.showErrorMessage(message);
  }
}

// src/commands/open.ts
var vscode3 = __toESM(require("vscode"));

// src/webviews/ComponentPreview.ts
var vscode2 = __toESM(require("vscode"));
var ComponentPreviewWebview = class {
  static async show(component) {
    const panel = vscode2.window.createWebviewPanel(
      "baguiPreview",
      component.title,
      vscode2.ViewColumn.Beside,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode2.Uri.joinPath(
            vscode2.extensions.getExtension("bagui.bagui-studio")?.extensionUri ?? vscode2.Uri.file("/"),
            "media"
          )
        ]
      }
    );
    const theme = vscode2.workspace.getConfiguration("bagui").get("theme", "system");
    const mode = theme === "dark" ? "dark" : theme === "light" ? "light" : void 0;
    panel.webview.html = this.getHtml(component, mode);
    panel.webview.onDidReceiveMessage(async (message) => {
      switch (message.type) {
        case "install":
          await vscode2.commands.executeCommand("bagui.installComponent", {
            name: component.name
          });
          break;
        case "copy-cli":
          await vscode2.env.clipboard.writeText(
            `npx bagui add ${component.name}`
          );
          vscode2.window.showInformationMessage(
            `CLI command copied for ${component.title}`
          );
          break;
        case "docs":
          await vscode2.commands.executeCommand("bagui.openDocumentation", {
            name: component.name
          });
          break;
        default:
          break;
      }
    });
  }
  static getHtml(component, mode) {
    const badge = component.access?.tier === "pro" ? "Pro" : "Free";
    const theme = mode ?? "dark";
    const previewImage = component.image ?? "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80";
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
          <div>${(component.tags ?? []).map((tag) => `<span class="pill">${tag}</span>`).join("")}</div>
        </div>
      </div>
    </div>
  </body>
</html>`;
  }
};

// src/commands/open.ts
async function openCommand(registryService) {
  const components = await registryService.getComponents();
  const selected = await vscode3.window.showQuickPick(
    components.map((component) => ({
      label: component.title,
      description: component.description,
      component
    })),
    { placeHolder: "Select a BagUI component to preview" }
  );
  if (!selected) {
    return;
  }
  await ComponentPreviewWebview.show(selected.component);
}

// src/commands/refresh.ts
var vscode4 = __toESM(require("vscode"));
async function refreshCommand(cacheService, registryService, treeProvider) {
  try {
    await cacheService.clear();
    await registryService.getComponents();
    treeProvider.refresh();
    vscode4.window.showInformationMessage("BagUI registry refreshed");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to refresh registry";
    vscode4.window.showErrorMessage(message);
  }
}

// src/commands/search.ts
var vscode5 = __toESM(require("vscode"));
async function searchCommand(registryService) {
  const items = await registryService.getComponents();
  const quickPick = vscode5.window.createQuickPick();
  quickPick.items = items.map((component) => ({
    label: component.title,
    description: component.description,
    detail: `${component.category ?? "General"} \u2022 ${component.access?.tier ?? "free"}`,
    component
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
        ...component.tags ?? []
      ].join(" ").toLowerCase();
      return haystack.includes(value.toLowerCase());
    });
    quickPick.items = filtered.map((component) => ({
      label: component.title,
      description: component.description,
      detail: `${component.category ?? "General"} \u2022 ${component.access?.tier ?? "free"}`,
      component
    }));
  });
  quickPick.onDidAccept(async () => {
    const selected = quickPick.selectedItems[0];
    if (!selected) {
      return;
    }
    quickPick.dispose();
    await ComponentPreviewWebview.show(selected.component);
  });
  quickPick.onDidHide(() => quickPick.dispose());
  quickPick.show();
}

// src/providers/ComponentTreeProvider.ts
var vscode6 = __toESM(require("vscode"));
var ComponentTreeProvider = class {
  constructor(registryService, context) {
    this.registryService = registryService;
    this.context = context;
    this.favorites = new Set(
      this.context.globalState.get("bagui.favorites", [])
    );
  }
  _onDidChangeTreeData = new vscode6.EventEmitter();
  onDidChangeTreeData = this._onDidChangeTreeData.event;
  favorites = /* @__PURE__ */ new Set();
  refresh() {
    this._onDidChangeTreeData.fire();
  }
  async getChildren(element) {
    if (!element) {
      const categories = await this.registryService.getCategories();
      return [
        {
          id: "favorites",
          label: "\u2B50 Favorites",
          component: void 0,
          category: "favorites"
        },
        ...categories.map((category) => ({
          id: category,
          label: this.registryService.getCategoryLabel(category),
          component: void 0,
          category
        }))
      ];
    }
    if (element.category === "favorites") {
      const favorites = await this.getFavoriteComponents();
      return favorites.map((item) => ({
        id: item.name,
        label: item.title,
        description: item.description,
        component: item,
        category: element.category,
        isFavorite: true
      }));
    }
    const items = await this.registryService.getComponentsByCategory(
      element.category
    );
    return items.map((item) => ({
      id: item.name,
      label: item.title,
      description: item.description,
      component: item,
      category: element.category,
      isFavorite: this.favorites.has(item.name)
    }));
  }
  getTreeItem(element) {
    const item = new vscode6.TreeItem(
      element.label,
      element.component ? vscode6.TreeItemCollapsibleState.None : vscode6.TreeItemCollapsibleState.Collapsed
    );
    item.id = element.id;
    item.description = element.description;
    item.contextValue = element.component ? "component" : "category";
    item.tooltip = element.component ? `${element.component.title}
${element.component.description}` : void 0;
    if (element.component) {
      item.iconPath = new vscode6.ThemeIcon(
        element.isFavorite ? "star-full" : "symbol-method"
      );
    }
    return item;
  }
  async addFavorite(component) {
    if (this.favorites.has(component.name)) {
      return;
    }
    this.favorites.add(component.name);
    await this.context.globalState.update(
      "bagui.favorites",
      Array.from(this.favorites)
    );
    this.refresh();
  }
  async getFavoriteComponents() {
    const components = await this.registryService.getComponents();
    return components.filter((component) => this.favorites.has(component.name));
  }
};

// src/services/CacheService.ts
var CacheService = class _CacheService {
  constructor(context) {
    this.context = context;
  }
  static CACHE_KEY = "bagui.registry.cache";
  static CACHE_TTL_MS = 12 * 60 * 60 * 1e3;
  async load() {
    const cached = this.context.globalState.get(_CacheService.CACHE_KEY);
    if (!cached) {
      return void 0;
    }
    const isFresh = Date.now() - cached.timestamp < _CacheService.CACHE_TTL_MS;
    if (!isFresh) {
      await this.clear();
      return void 0;
    }
    return cached.data;
  }
  async save(data) {
    await this.context.globalState.update(_CacheService.CACHE_KEY, {
      data,
      timestamp: Date.now()
    });
  }
  async clear() {
    await this.context.globalState.update(_CacheService.CACHE_KEY, void 0);
  }
};

// src/services/InstallService.ts
var vscode7 = __toESM(require("vscode"));
var InstallService = class {
  async installComponent(component) {
    const workspaceFolders = vscode7.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      throw new Error(
        "No workspace is opened. Open a folder before installing a component."
      );
    }
    const workspaceRoot = workspaceFolders[0]?.uri.fsPath;
    if (!workspaceRoot) {
      throw new Error(
        "Unable to determine the workspace root for installation."
      );
    }
    const terminal = vscode7.window.createTerminal({
      name: "BagUI Install",
      cwd: workspaceRoot
    });
    terminal.show(true);
    terminal.sendText(`npx bagui add ${component.name}`, true);
  }
  async openDocumentation(component) {
    const docsUrl = component.docsUrl ?? "https://bagui.vercel.app/docs";
    await vscode7.env.openExternal(vscode7.Uri.parse(docsUrl));
  }
};

// src/services/RegistryService.ts
var fs2 = __toESM(require("node:fs"));
var vscode9 = __toESM(require("vscode"));

// src/utils/paths.ts
var path = __toESM(require("node:path"));
var fs = __toESM(require("node:fs"));
var vscode8 = __toESM(require("vscode"));
function resolveRegistryPath(configuredPath) {
  if (configuredPath && configuredPath.trim().length > 0) {
    const normalizedPath = configuredPath.trim();
    if (path.isAbsolute(normalizedPath)) {
      return normalizedPath;
    }
    for (const folder of vscode8.workspace.workspaceFolders ?? []) {
      return path.resolve(folder.uri.fsPath, normalizedPath);
    }
    return path.resolve(process.cwd(), normalizedPath);
  }
  const rootsToCheck = /* @__PURE__ */ new Set();
  for (const folder of vscode8.workspace.workspaceFolders ?? []) {
    rootsToCheck.add(folder.uri.fsPath);
  }
  rootsToCheck.add(process.cwd());
  rootsToCheck.add(path.resolve(__dirname, ".."));
  rootsToCheck.add(path.resolve(__dirname, "..", ".."));
  for (const root of rootsToCheck) {
    const candidates = [
      path.join(root, "registry.json"),
      path.join(root, "vscode", "registry.json"),
      path.join(path.dirname(root), "registry.json"),
      path.join(path.dirname(root), "vscode", "registry.json")
    ];
    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
  }
  const fallbackRoot = path.resolve(__dirname, "..");
  const defaultPath = path.join(fallbackRoot, "registry.json");
  if (fs.existsSync(defaultPath)) {
    return defaultPath;
  }
  return path.join(fallbackRoot, "vscode", "registry.json");
}
function toDisplayCategory(category) {
  const map = {
    marketing: "Marketing",
    dashboard: "Dashboard",
    authentication: "Authentication",
    forms: "Forms",
    buttons: "Buttons",
    cards: "Cards",
    navigation: "Navigation",
    favorites: "Favorites"
  };
  return map[category.toLowerCase()] ?? category;
}

// src/services/RegistryService.ts
var RegistryService = class {
  constructor(context) {
    this.context = context;
  }
  async getCategories() {
    const registry = await this.loadRegistry();
    const categories = /* @__PURE__ */ new Set();
    for (const item of registry.items) {
      const category = this.inferCategory(item);
      categories.add(category);
    }
    return Array.from(categories).sort();
  }
  async getComponents() {
    const registry = await this.loadRegistry();
    return registry.items;
  }
  async getComponent(slug) {
    const components = await this.getComponents();
    return components.find(
      (component) => component.name === slug || component.title === slug
    );
  }
  async search(query) {
    const components = await this.getComponents();
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return components;
    }
    return components.filter((component) => {
      const haystack = [
        component.title,
        component.description,
        component.name,
        component.category ?? "",
        ...component.tags ?? []
      ].join(" ").toLowerCase();
      return haystack.includes(normalized);
    });
  }
  async loadRegistry() {
    const configuredPath = vscode9.workspace.getConfiguration("bagui").get("registryPath");
    const registryPath = resolveRegistryPath(configuredPath);
    if (!fs2.existsSync(registryPath)) {
      throw new Error(`Registry file not found at ${registryPath}`);
    }
    const raw = await fs2.promises.readFile(registryPath, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed.items || !Array.isArray(parsed.items)) {
      throw new Error("Invalid registry format");
    }
    return {
      ...parsed,
      items: parsed.items.map((item) => ({
        ...item,
        category: item.category ?? this.inferCategory(item),
        tags: item.tags ?? [item.type, item.access?.tier ?? "free"]
      }))
    };
  }
  async getComponentsByCategory(category) {
    const components = await this.getComponents();
    return components.filter(
      (component) => this.inferCategory(component) === category
    );
  }
  getCategoryLabel(category) {
    return toDisplayCategory(category);
  }
  inferCategory(component) {
    const lowerTitle = component.title.toLowerCase();
    const lowerName = component.name.toLowerCase();
    if (lowerTitle.includes("hero") || lowerName.includes("hero")) {
      return "marketing";
    }
    if (lowerTitle.includes("navbar") || lowerName.includes("navbar")) {
      return "navigation";
    }
    if (lowerTitle.includes("cta") || lowerName.includes("cta")) {
      return "marketing";
    }
    if (lowerTitle.includes("faq") || lowerName.includes("faq")) {
      return "marketing";
    }
    if (lowerTitle.includes("pricing") || lowerName.includes("pricing")) {
      return "marketing";
    }
    if (lowerTitle.includes("contact") || lowerName.includes("contact")) {
      return "forms";
    }
    if (lowerTitle.includes("feature") || lowerName.includes("feature")) {
      return "marketing";
    }
    if (lowerTitle.includes("testimonial") || lowerName.includes("testimonial")) {
      return "marketing";
    }
    if (lowerTitle.includes("login") || lowerName.includes("login")) {
      return "authentication";
    }
    if (lowerTitle.includes("dashboard") || lowerName.includes("dashboard")) {
      return "dashboard";
    }
    if (lowerTitle.includes("button") || lowerName.includes("button")) {
      return "buttons";
    }
    if (lowerTitle.includes("card") || lowerName.includes("card")) {
      return "cards";
    }
    return "marketing";
  }
};

// src/extension.ts
function activate(context) {
  const registryService = new RegistryService(context);
  const cacheService = new CacheService(context);
  const installService = new InstallService();
  const treeProvider = new ComponentTreeProvider(registryService, context);
  const registerCommand = (id, handler) => {
    context.subscriptions.push(vscode10.commands.registerCommand(id, handler));
  };
  const openCommandHandler = async () => {
    await openCommand(registryService);
  };
  const searchHandler = async () => {
    await searchCommand(registryService);
  };
  const refreshHandler = async () => {
    await refreshCommand(cacheService, registryService, treeProvider);
  };
  const installHandler = async (...args) => {
    const component = args[0];
    if (!component?.name) {
      return;
    }
    const resolved = await registryService.getComponent(component.name);
    if (!resolved) {
      vscode10.window.showErrorMessage("Component not found in registry");
      return;
    }
    await installCommand(installService, resolved);
  };
  const previewHandler = async (...args) => {
    const item = args[0];
    if (!item?.name) {
      return;
    }
    const resolved = await registryService.getComponent(item.name);
    if (!resolved) {
      vscode10.window.showErrorMessage("Component not found in registry");
      return;
    }
    await ComponentPreviewWebview.show(resolved);
  };
  const addFavoriteHandler = async (...args) => {
    const item = args[0];
    if (!item?.name) {
      return;
    }
    const resolved = await registryService.getComponent(item.name);
    if (!resolved) {
      return;
    }
    await treeProvider.addFavorite(resolved);
    vscode10.window.showInformationMessage(
      `Added ${resolved.title} to favorites`
    );
  };
  const openDocumentationHandler = async (...args) => {
    const item = args[0];
    if (!item?.name) {
      return;
    }
    const resolved = await registryService.getComponent(item.name);
    if (!resolved) {
      return;
    }
    await installService.openDocumentation(resolved);
  };
  registerCommand("bagui.open", openCommandHandler);
  registerCommand("bagui.searchComponent", searchHandler);
  registerCommand("bagui.refreshRegistry", refreshHandler);
  registerCommand("bagui.installComponent", installHandler);
  registerCommand("bagui.openDocumentation", openDocumentationHandler);
  registerCommand("bagui.addFavorite", addFavoriteHandler);
  registerCommand("bagui.preview", previewHandler);
  const treeView = vscode10.window.createTreeView("bagui.components", {
    treeDataProvider: treeProvider,
    showCollapseAll: true
  });
  context.subscriptions.push(treeView);
  treeView.onDidChangeSelection(async (event) => {
    const item = event.selection[0];
    if (!item?.id) {
      return;
    }
    if (item.contextValue === "component") {
      const autoPreview = vscode10.workspace.getConfiguration("bagui").get("autoPreview", true);
      if (autoPreview) {
        const component = await registryService.getComponent(item.id);
        if (component) {
          await ComponentPreviewWebview.show(component);
        }
      }
    }
  });
  void (async () => {
    try {
      await cacheService.load();
      await registryService.getComponents();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load BagUI registry";
      vscode10.window.showWarningMessage(message);
    }
  })();
  const statusBar = vscode10.window.createStatusBarItem(
    vscode10.StatusBarAlignment.Right,
    100
  );
  statusBar.text = "BagUI";
  statusBar.tooltip = "BagUI Studio";
  statusBar.command = "bagui.open";
  statusBar.show();
  context.subscriptions.push(statusBar);
  const mediaRoot = vscode10.Uri.joinPath(context.extensionUri, "media");
  if (path2.basename(mediaRoot.fsPath) !== "media") {
  }
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
