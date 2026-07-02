import { type PerformanceEntry, PerformanceObserver } from 'node:perf_hooks';
export declare const timerify: <T extends (...params: any[]) => any>(fn: T, name?: string) => T;
type MemInfo = {
    label: string;
    heapUsed: number;
    heapTotal: number;
    rss: number;
};
interface MemoryEntry extends PerformanceEntry {
    detail: MemInfo;
}
declare class Performance {
    isEnabled: boolean;
    isTimerifyFunctions: boolean;
    isMemoryUsageEnabled: boolean;
    startTime: number;
    endTime: number;
    perfEntries: PerformanceEntry[];
    memEntries: MemoryEntry[];
    perfId?: string;
    memId?: string;
    fnObserver?: PerformanceObserver;
    memObserver?: PerformanceObserver;
    constructor({ isTimerifyFunctions, isMemoryUsageEnabled }: {
        isTimerifyFunctions?: boolean | undefined;
        isMemoryUsageEnabled?: boolean | undefined;
    });
    private setMark;
    private clearMark;
    private flush;
    private getPerfEntriesByName;
    getTimerifiedFunctionsTable(): string;
    addMemoryMark(label: string): void;
    getMemoryUsageTable(): string;
    getCurrentDurationInMs(): number;
    getMemHeapUsage(): number;
    getCurrentMemUsageInMb(): any;
    finalize(): Promise<void>;
    reset(): void;
}
export declare const perfObserver: Performance;
export {};
