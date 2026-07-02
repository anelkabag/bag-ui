import type { Word, WordPart } from "./types.ts";
/**
 * Compute the structural parts of a word by re-scanning the source.
 * This is the "cold path" — only called when consumers actually need parts.
 *
 * Returns undefined for simple words (no quotes, expansions, or special structure).
 */
export declare function computeWordParts(source: string, word: Word): WordPart[] | undefined;
