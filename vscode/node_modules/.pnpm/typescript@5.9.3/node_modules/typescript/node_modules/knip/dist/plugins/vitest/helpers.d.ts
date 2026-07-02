import type { ViteConfig } from './types.ts';
export declare const getEnvSpecifier: (env: string) => string;
export declare const getExternalReporters: (reporters?: ViteConfig["test"]["reporters"]) => string[];
