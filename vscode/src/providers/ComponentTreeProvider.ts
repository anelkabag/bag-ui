import * as vscode from "vscode";
import {
  FAVORITES_CATEGORY,
  type CategoryNode,
  type Component,
  type ComponentNode,
  type TreeNode,
} from "../types";
import type { FavoritesService } from "../services/FavoritesService";
import type { RegistryService } from "../services/RegistryService";
import { toErrorMessage } from "../utils/errors";
import { categoryLabel } from "../utils/registry";

export class ComponentTreeProvider implements vscode.TreeDataProvider<TreeNode>, vscode.Disposable {
  private readonly _onDidChangeTreeData = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
  private readonly subscriptions: vscode.Disposable[] = [];

  constructor(
    private readonly registry: RegistryService,
    private readonly favorites: FavoritesService,
  ) {
    this.subscriptions.push(
      this._onDidChangeTreeData,
      registry.onDidChange(() => this.refresh()),
      favorites.onDidChange(() => this.refresh()),
      vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration("bagui")) {
          this.refresh();
        }
      }),
    );
  }

  dispose(): void {
    this.subscriptions.forEach((disposable) => disposable.dispose());
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  async getChildren(element?: TreeNode): Promise<TreeNode[]> {
    try {
      if (!element) {
        return await this.getRoots();
      }
      if (element.kind === "category") {
        return await this.getCategoryChildren(element);
      }
      return [];
    } catch (error) {
      void vscode.window.showErrorMessage(toErrorMessage(error, "Unable to load BagUI components."));
      return [];
    }
  }

  getTreeItem(element: TreeNode): vscode.TreeItem {
    if (element.kind === "category") {
      const item = new vscode.TreeItem(element.label, vscode.TreeItemCollapsibleState.Collapsed);
      item.id = `category/${element.category}`;
      item.contextValue = "category";
      item.description = String(element.count);
      item.iconPath = new vscode.ThemeIcon(
        element.category === FAVORITES_CATEGORY ? "star-full" : "folder",
      );
      return item;
    }

    const { component, parent, isFavorite } = element;
    const item = new vscode.TreeItem(component.title, vscode.TreeItemCollapsibleState.None);
    item.id = `${parent}/${component.name}`;
    item.contextValue = isFavorite ? "component.favorite" : "component";
    item.description = component.tier === "pro" ? "Pro" : undefined;
    item.tooltip = new vscode.MarkdownString(
      `**${component.title}**\n\n${component.description}`,
    );
    item.iconPath = new vscode.ThemeIcon(isFavorite ? "star-full" : "symbol-misc");

    const autoPreview = vscode.workspace.getConfiguration("bagui").get<boolean>("autoPreview", true);
    if (autoPreview) {
      item.command = {
        command: "bagui.preview",
        title: "Preview Component",
        arguments: [component.name],
      };
    }
    return item;
  }

  private async getRoots(): Promise<TreeNode[]> {
    const [categories, components] = await Promise.all([
      this.registry.getCategories(),
      this.registry.getComponents(),
    ]);

    const favoritesNode: CategoryNode = {
      kind: "category",
      category: FAVORITES_CATEGORY,
      label: categoryLabel(FAVORITES_CATEGORY),
      count: components.filter((component) => this.favorites.has(component.name)).length,
    };

    const categoryNodes = categories.map<CategoryNode>((category) => ({
      kind: "category",
      category,
      label: categoryLabel(category),
      count: components.filter((component) => component.category === category).length,
    }));

    return [favoritesNode, ...categoryNodes];
  }

  private async getCategoryChildren(node: CategoryNode): Promise<ComponentNode[]> {
    const components: Component[] =
      node.category === FAVORITES_CATEGORY
        ? (await this.registry.getComponents()).filter((c) => this.favorites.has(c.name))
        : await this.registry.getComponentsByCategory(node.category);

    return components.map<ComponentNode>((component) => ({
      kind: "component",
      parent: node.category,
      component,
      isFavorite: this.favorites.has(component.name),
    }));
  }
}
