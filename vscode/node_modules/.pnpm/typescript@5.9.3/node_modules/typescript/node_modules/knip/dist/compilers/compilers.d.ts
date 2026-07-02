import type { CompilerSync } from './types.ts';
export declare const fencedCodeBlockMatcher: RegExp;
export declare const inlineCodeMatcher: RegExp;
export declare const importMatcher: RegExp;
export declare const importsWithinScripts: CompilerSync;
export declare const scriptBodies: CompilerSync;
export declare const frontmatterMatcher: RegExp;
export declare const importsWithinFrontmatter: (text: string, keys?: string[]) => string;
