import type { Import, ImportMaps, ModuleGraph } from '../types/module-graph.ts';
export declare const getExportedIdentifiers: (graph: ModuleGraph, filePath: string, visited?: Set<string>) => Map<string, boolean>;
export declare const hasStrictlyEnumReferences: (importsForExport: ImportMaps | undefined, identifier: string) => boolean;
export declare const getIssueType: (hasOnlyNsReference: boolean, isType: boolean) => "exports" | "nsExports" | "types" | "nsTypes";
export declare const findImportRef: (graph: ModuleGraph, importingFile: string, importedFile: string, identifier: string) => Import | undefined;
