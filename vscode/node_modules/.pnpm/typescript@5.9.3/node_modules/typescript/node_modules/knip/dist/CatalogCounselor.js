import { readFile } from 'node:fs/promises';
import { ROOT_WORKSPACE_NAME } from "./constants.js";
import { JsonCatalogPeeker } from "./JsonCatalogPeeker.js";
import { extractCatalogReferences, parseCatalog } from "./util/catalog.js";
import { extname } from "./util/path.js";
import { YamlCatalogPeeker } from "./YamlCatalogPeeker.js";
export class CatalogCounselor {
    filePath;
    entries = new Set();
    referencedEntries = new Set();
    fileContent;
    constructor(options) {
        this.filePath = options.catalog.filePath;
        this.entries = parseCatalog(options.catalog);
    }
    addReferencedCatalogEntry(entryName) {
        this.referencedEntries.add(entryName);
    }
    addWorkspace(manifest) {
        if (this.entries.size === 0)
            return;
        const catalogReferences = extractCatalogReferences(manifest);
        for (const catalogEntryName of catalogReferences)
            this.addReferencedCatalogEntry(catalogEntryName);
    }
    async settleCatalogIssues(options) {
        if (this.entries.size === 0)
            return [];
        const filePath = this.filePath;
        const workspace = ROOT_WORKSPACE_NAME;
        const catalogIssues = [];
        if (this.entries.size > this.referencedEntries.size) {
            this.fileContent = await readFile(filePath, 'utf-8');
            const isYaml = ['.yml', '.yaml'].includes(extname(filePath));
            const Peeker = isYaml ? YamlCatalogPeeker : JsonCatalogPeeker;
            const peeker = new Peeker(this.fileContent);
            for (const entry of this.entries.keys()) {
                if (!this.referencedEntries.has(entry)) {
                    const [parentSymbol, symbol] = entry.split(':');
                    const pos = peeker.getLocation(parentSymbol, symbol);
                    const fixes = [];
                    if (options.isFix && isYaml && pos)
                        fixes.push([pos.line, 0, 0]);
                    catalogIssues.push({ type: 'catalog', filePath, workspace, symbol, parentSymbol, fixes, ...pos });
                }
            }
        }
        return catalogIssues;
    }
}
