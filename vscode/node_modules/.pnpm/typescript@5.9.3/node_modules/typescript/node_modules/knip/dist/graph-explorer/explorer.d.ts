import type { ModuleGraph } from '../types/module-graph.ts';
export declare const createGraphExplorer: (graph: ModuleGraph, entryPaths: Set<string>) => {
    isReferenced: (filePath: string, identifier: string, options: {
        includeEntryExports: boolean;
    }) => [boolean, string | undefined];
    hasStrictlyNsReferences: (filePath: string, identifier: string) => [boolean, (string | undefined)?];
    buildExportsTree: (options: {
        filePath?: string;
        identifier?: string;
    }) => import("./operations/build-exports-tree.ts").ExportsTreeNode[];
    getDependencyUsage: (pattern?: string | RegExp) => Map<string, import("./operations/get-dependency-usage.ts").DependencyNodes>;
    resolveDefinition: (filePath: string, identifier: string) => import("./operations/resolve-definition.ts").DefinitionResult | null;
    getUsage: (filePath: string, identifier: string) => import("./operations/get-usage.ts").UsageResult;
    findCycles: (filePath: string, maxDepth?: number) => import("../session/types.ts").Cycle[];
    getContention: (filePath: string) => Map<string, import("../session/types.ts").ContentionDetails>;
    invalidateCache: () => void;
};
export type GraphExplorer = ReturnType<typeof createGraphExplorer>;
