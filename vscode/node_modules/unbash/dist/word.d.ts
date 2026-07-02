import type { Word, WordPart } from "./types.ts";
type PartsResolver = (source: string, word: Word) => WordPart[] | undefined;
export declare class WordImpl implements Word {
    #private;
    static _resolve: PartsResolver;
    text: string;
    pos: number;
    end: number;
    constructor(text: string, pos: number, end: number, source?: string);
    get value(): string;
    get parts(): WordPart[] | undefined;
    set parts(v: WordPart[] | undefined);
    toJSON(): {
        text: string;
        pos: number;
        end: number;
        parts: WordPart[] | undefined;
        value: string;
    };
}
export {};
