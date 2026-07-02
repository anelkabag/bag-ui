interface GlobOptions {
    cwd: string;
    dir?: string;
    patterns: string[];
    gitignore?: boolean;
    name?: boolean;
    label?: string;
}
export declare const removeProductionSuffix: (pattern: string) => string;
export declare const prependDirToPattern: (dir: string, pattern: string) => string;
export declare const negate: (pattern: string) => string;
export declare const hasProductionSuffix: (pattern: string) => boolean;
export declare const hasNoProductionSuffix: (pattern: string) => boolean;
export declare const _glob: ({ cwd, dir, patterns, gitignore, label }: GlobOptions) => Promise<string[]>;
export declare const _syncGlob: ({ cwd, patterns }: {
    cwd?: string;
    patterns: string | string[];
}) => string[];
export declare const _dirGlob: ({ cwd, patterns, gitignore }: GlobOptions) => Promise<string[]>;
export {};
