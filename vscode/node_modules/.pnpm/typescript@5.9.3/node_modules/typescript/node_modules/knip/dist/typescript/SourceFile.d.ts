import type ts from 'typescript';
type SymbolTable = Map<string, SymbolWithExportSymbol>;
type SymbolWithExports = ts.Symbol & {
    exports?: SymbolTable;
};
interface SymbolWithExportSymbol extends ts.Symbol {
    exportSymbol?: ts.Symbol;
}
type PragmaMap = {
    arguments: {
        factory?: string;
        path?: {
            value?: string;
            pos?: number;
        };
        types?: {
            value: string;
            pos: number;
        };
    };
    range?: {
        kind?: number;
        pos?: number;
        end?: number;
        hasTrailingNewLine?: boolean;
    };
};
export interface BoundSourceFile extends ts.SourceFile {
    symbol?: SymbolWithExports;
    locals?: SymbolTable;
    getNamedDeclarations?(): Map<string, readonly ts.Declaration[]>;
    scriptKind?: ts.ScriptKind;
    pragmas?: Map<string, PragmaMap | PragmaMap[]>;
}
export {};
