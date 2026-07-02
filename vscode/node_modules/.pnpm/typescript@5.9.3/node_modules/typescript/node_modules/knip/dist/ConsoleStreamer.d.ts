import type { MainOptions } from './util/create-options.ts';
export declare class ConsoleStreamer {
    isEnabled: boolean;
    isWatch: boolean;
    private lines;
    constructor(options: MainOptions);
    private clearLines;
    private clearScreen;
    private update;
    cast(message: string | string[], sub?: string): void;
    clear(): void;
}
