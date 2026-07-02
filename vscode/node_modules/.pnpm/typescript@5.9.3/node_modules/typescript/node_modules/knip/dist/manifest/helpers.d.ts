import type { Scripts } from '../types/package-json.ts';
type LoadPackageManifestOptions = {
    dir: string;
    packageName: string;
    cwd: string;
};
export declare const loadPackageManifest: ({ dir, packageName, cwd }: LoadPackageManifestOptions) => any;
export declare const getFilteredScripts: (scripts: Scripts) => Scripts[];
export {};
