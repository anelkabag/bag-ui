import { Lexer } from "./lexer.js";
import { parse } from "./parser.js";
/**
 * Compute the structural parts of a word by re-scanning the source.
 * This is the "cold path" — only called when consumers actually need parts.
 *
 * Returns undefined for simple words (no quotes, expansions, or special structure).
 */
export function computeWordParts(source, word) {
    const lexer = new Lexer(source);
    let parts;
    // Heredoc bodies contain newlines — use dedicated scanning
    if (word.text.includes("\n") && word.pos > 0) {
        parts = lexer.buildHereDocParts(word.pos, word.end);
    }
    else {
        parts = lexer.buildWordParts(word.pos);
    }
    if (!parts)
        return undefined;
    // Resolve command expansions: parse inner scripts
    for (const exp of lexer.getCollectedExpansions()) {
        resolveExpansion(exp);
    }
    return parts;
}
function resolveExpansion(e) {
    if (e.inner !== undefined && e._part) {
        e._part.script = parse(e.inner);
        e._part.inner = undefined;
        e._part = undefined;
        e.inner = undefined;
    }
}
