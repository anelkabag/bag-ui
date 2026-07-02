import type { MainOptions } from './util/create-options.ts';
import { type FileDescriptor } from './util/file-entry-cache.ts';
export declare class CacheConsultant<T> {
    private isEnabled;
    private cache;
    constructor(name: string, options: MainOptions);
    getFileDescriptor(filePath: string): FileDescriptor<T>;
    reconcile(): void;
}
