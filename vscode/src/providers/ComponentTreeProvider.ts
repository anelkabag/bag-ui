import * as vscode from "vscode";
import type { ComponentNode, RegistryItem } from "../types";
import { RegistryService } from "../services/RegistryService";

export class ComponentTreeProvider implements vscode.TreeDataProvider<ComponentNode> {
  private readonly _onDidChangeTreeData = new vscode.EventEmitter<
    ComponentNode | undefined | null | void
  >();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private favorites = new Set<string>();

  constructor(
    private readonly registryService: RegistryService,
    private readonly context: vscode.ExtensionContext,
  ) {
    this.favorites = new Set(
      this.context.globalState.get<string[]>("bagui.favorites", []),
    );
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  async getChildren(element?: ComponentNode): Promise<ComponentNode[]> {
    if (!element) {
      const categories = await this.registryService.getCategories();
      return [
        {
          id: "favorites",
          label: "⭐ Favorites",
          component: undefined,
          category: "favorites",
        },
        ...categories.map((category) => ({
          id: category,
          label: this.registryService.getCategoryLabel(category),
          component: undefined,
          category,
        })),
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
        isFavorite: true,
      }));
    }

    const items = await this.registryService.getComponentsByCategory(
      element.category,
    );
    return items.map((item) => ({
      id: item.name,
      label: item.title,
      description: item.description,
      component: item,
      category: element.category,
      isFavorite: this.favorites.has(item.name),
    }));
  }

  getTreeItem(element: ComponentNode): vscode.TreeItem {
    const item = new vscode.TreeItem(
      element.label,
      element.component
        ? vscode.TreeItemCollapsibleState.None
        : vscode.TreeItemCollapsibleState.Collapsed,
    );
    item.id = element.id;
    item.description = element.description;
    item.contextValue = element.component ? "component" : "category";
    item.tooltip = element.component
      ? `${element.component.title}\n${element.component.description}`
      : undefined;

    if (element.component) {
      item.iconPath = new vscode.ThemeIcon(
        element.isFavorite ? "star-full" : "symbol-method",
      );
    }

    return item;
  }

  async addFavorite(component: RegistryItem): Promise<void> {
    if (this.favorites.has(component.name)) {
      return;
    }

    this.favorites.add(component.name);
    await this.context.globalState.update(
      "bagui.favorites",
      Array.from(this.favorites),
    );
    this.refresh();
  }

  async getFavoriteComponents(): Promise<RegistryItem[]> {
    const components = await this.registryService.getComponents();
    return components.filter((component) => this.favorites.has(component.name));
  }
}
