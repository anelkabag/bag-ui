type Value = string | number | undefined | false | null;
export declare class Table {
    private columns;
    private rows;
    private header;
    private maxWidth;
    private truncateStart;
    private noTruncate;
    constructor(options?: {
        maxWidth?: number;
        header?: boolean;
        truncateStart?: string[];
        noTruncate?: string[];
    });
    row(): this;
    cell(column: string, value: Value, formatter?: (value: Value) => string): this;
    sort(column: string): this;
    toCells(): string[][];
    toRows(): string[];
    toString(): string;
}
export {};
