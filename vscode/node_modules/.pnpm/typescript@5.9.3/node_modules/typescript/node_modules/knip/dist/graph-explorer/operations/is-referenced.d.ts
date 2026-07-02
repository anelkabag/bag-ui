import type { Identifier, ModuleGraph } from '../../types/module-graph.ts';
export declare const isReferenced: (graph: ModuleGraph, entryPaths: Set<string>, filePath: string, id: Identifier, options: {
    includeEntryExports: boolean;
}) => [boolean, string | undefined];
