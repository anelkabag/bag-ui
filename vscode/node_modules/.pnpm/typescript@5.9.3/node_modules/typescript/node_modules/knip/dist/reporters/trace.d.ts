import type { GraphExplorer } from '../graph-explorer/explorer.ts';
import type { ModuleGraph } from '../types/module-graph.ts';
import type { MainOptions } from '../util/create-options.ts';
import type { WorkspaceFilePathFilter } from '../util/workspace-file-filter.ts';
interface TraceReporterOptions {
    graph: ModuleGraph;
    explorer: GraphExplorer;
    options: MainOptions;
    workspaceFilePathFilter: WorkspaceFilePathFilter;
}
declare const _default: ({ graph, explorer, options, workspaceFilePathFilter }: TraceReporterOptions) => void;
export default _default;
