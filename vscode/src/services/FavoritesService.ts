import * as vscode from "vscode";

export class FavoritesService implements vscode.Disposable {
  private static readonly KEY = "bagui.favorites";

  private readonly _onDidChange = new vscode.EventEmitter<void>();
  readonly onDidChange = this._onDidChange.event;

  constructor(private readonly context: vscode.ExtensionContext) {
    // Prepares for the future "Favorites Sync" feature: favorites follow Settings Sync.
    this.context.globalState.setKeysForSync([FavoritesService.KEY]);
  }

  dispose(): void {
    this._onDidChange.dispose();
  }

  list(): string[] {
    return this.context.globalState.get<string[]>(FavoritesService.KEY, []);
  }

  has(slug: string): boolean {
    return this.list().includes(slug);
  }

  async add(slug: string): Promise<void> {
    if (!this.has(slug)) {
      await this.save([...this.list(), slug]);
    }
  }

  async remove(slug: string): Promise<void> {
    if (this.has(slug)) {
      await this.save(this.list().filter((entry) => entry !== slug));
    }
  }

  private async save(slugs: string[]): Promise<void> {
    await this.context.globalState.update(FavoritesService.KEY, slugs);
    this._onDidChange.fire();
  }
}
