import type { HostDependencies, InstalledBinaries } from '../types/workspace.ts';
type Options = {
    packageNames: string[];
    dir: string;
    cwd: string;
};
export declare const getDependencyMetaData: ({ cwd, dir, packageNames }: Options) => {
    hostDependencies: HostDependencies;
    installedBinaries: InstalledBinaries;
    hasTypesIncluded: Set<string>;
};
export {};
