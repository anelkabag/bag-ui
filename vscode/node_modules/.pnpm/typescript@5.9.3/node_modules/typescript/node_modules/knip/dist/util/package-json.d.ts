import type { PackageJson } from '../types/package-json.ts';
declare const INDENT: unique symbol;
declare const NEWLINE: unique symbol;
interface ExtendedPackageJson extends PackageJson {
    [INDENT]?: string;
    [NEWLINE]?: string;
}
export declare const load: (filePath: string) => Promise<ExtendedPackageJson>;
export declare const save: (filePath: string, content: ExtendedPackageJson) => Promise<void>;
export declare const getEntrySpecifiersFromManifest: (manifest: PackageJson) => Set<string>;
export declare const getManifestImportDependencies: (manifest: PackageJson) => Set<string>;
export {};
