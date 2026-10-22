import * as fs from "node:fs";
import * as path from "node:path";
import * as vscode from "vscode";
import type { Component } from "../types";
import { DEFAULT_HOMEPAGE, isSafeSlug } from "../utils/registry";

type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

const TERMINAL_NAME = "BagUI";

export class InstallService {
  /** Builds the shell command that installs a component into the current project. */
  buildCommand(component: Component, homepage: string, manager: PackageManager = "npm"): string {
    if (!isSafeSlug(component.name)) {
      throw new Error(`Refusing to install a component with an unsafe name: ${component.name}`);
    }

    const url = `${homepage.replace(/\/+$/, "")}/r/${component.name}.json`;
    switch (manager) {
      case "pnpm":
        return `pnpm dlx shadcn@latest add ${url}`;
      case "yarn":
        return `yarn dlx shadcn@latest add ${url}`;
      case "bun":
        return `bunx --bun shadcn@latest add ${url}`;
      default:
        return `npx shadcn@latest add ${url}`;
    }
  }

  /** The command shown in "Copy CLI": same as install, using the project's package manager if any. */
  async getCommand(component: Component, homepage = DEFAULT_HOMEPAGE): Promise<string> {
    const folder = vscode.workspace.workspaceFolders?.[0];
    const manager = folder ? this.detectPackageManager(folder.uri.fsPath) : "npm";
    return this.buildCommand(component, homepage, manager);
  }

  async install(component: Component, homepage = DEFAULT_HOMEPAGE): Promise<void> {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders || folders.length === 0) {
      throw new Error("No workspace is opened. Open a project folder before installing a component.");
    }

    const folder = folders.length === 1 ? folders[0] : await vscode.window.showWorkspaceFolderPick({
      placeHolder: "Select the project to install the component into",
    });
    if (!folder) {
      return;
    }

    const command = this.buildCommand(component, homepage, this.detectPackageManager(folder.uri.fsPath));
    const terminal = this.getTerminal(folder);

    try {
      terminal.show(true);
      terminal.sendText(command, true);
    } catch {
      await vscode.env.clipboard.writeText(command);
      throw new Error(`The terminal is unavailable. The command was copied to your clipboard: ${command}`);
    }
  }

  async openDocumentation(component: Component | undefined, homepage = DEFAULT_HOMEPAGE): Promise<void> {
    const target = component?.docsUrl ?? `${homepage.replace(/\/+$/, "")}/docs`;
    const opened = await vscode.env.openExternal(vscode.Uri.parse(target));
    if (!opened) {
      throw new Error(`Unable to open ${target}`);
    }
  }

  private getTerminal(folder: vscode.WorkspaceFolder): vscode.Terminal {
    const name = `${TERMINAL_NAME}: ${folder.name}`;
    const existing = vscode.window.terminals.find(
      (terminal) => terminal.name === name && terminal.exitStatus === undefined,
    );
    return existing ?? vscode.window.createTerminal({ name, cwd: folder.uri });
  }

  private detectPackageManager(root: string): PackageManager {
    const has = (file: string): boolean => fs.existsSync(path.join(root, file));
    if (has("pnpm-lock.yaml")) {
      return "pnpm";
    }
    if (has("yarn.lock")) {
      return "yarn";
    }
    if (has("bun.lockb") || has("bun.lock")) {
      return "bun";
    }
    return "npm";
  }
}
