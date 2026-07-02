import type { CatalogContainer } from '../CatalogCounselor.ts';
import type { PackageJson } from '../types/package-json.ts';
export declare const DEFAULT_CATALOG = "default";
export declare const getCatalogContainer: (cwd: string, manifest: PackageJson, manifestPath: string, pnpmWorkspacePath?: string, pnpmWorkspace?: any) => Promise<CatalogContainer>;
export declare const parseCatalog: (container: CatalogContainer) => Set<string>;
export declare const extractCatalogReferences: (manifest: PackageJson) => Set<string>;
