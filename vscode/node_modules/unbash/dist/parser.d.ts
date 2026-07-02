export type * from "./types.ts";
import type { ParseError, Script } from "./types.ts";
export declare function parse(source: string): Script & {
    errors?: ParseError[];
};
