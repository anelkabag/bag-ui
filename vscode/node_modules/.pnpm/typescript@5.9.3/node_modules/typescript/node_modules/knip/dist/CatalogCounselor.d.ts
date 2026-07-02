import type { Issue } from './types/issues.ts';
import type { Catalog, Catalogs, PackageJson } from './types/package-json.ts';
import type { MainOptions } from './util/create-options.ts';
export type CatalogContainer = {
    filePath: string;
    catalog?: Catalog;
    catalogs?: Catalogs;
};
export declare class CatalogCounselor {
    private filePath;
    private entries;
    private referencedEntries;
    private fileContent?;
    constructor(options: MainOptions);
    private addReferencedCatalogEntry;
    addWorkspace(manifest: PackageJson): void;
    settleCatalogIssues(options: MainOptions): Promise<Issue[]>;
}
