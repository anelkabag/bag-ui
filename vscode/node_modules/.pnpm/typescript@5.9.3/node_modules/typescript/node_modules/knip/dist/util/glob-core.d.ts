import { type Options as FastGlobOptions } from 'fast-glob';
type Options = {
    gitignore: boolean;
    cwd: string;
};
interface GlobOptions extends FastGlobOptions {
    gitignore: boolean;
    cwd: string;
    dir: string;
    label?: string;
}
export declare const findAndParseGitignores: (cwd: string, workspaceDirs?: Set<string>) => Promise<{
    gitignoreFiles: string[];
    ignores: Set<string>;
    unignores: string[];
}>;
export declare function glob(_patterns: string[], options: GlobOptions): Promise<string[]>;
export declare function getGitIgnoredHandler(options: Options, workspaceDirs?: Set<string>): Promise<(path: string) => boolean>;
export {};
