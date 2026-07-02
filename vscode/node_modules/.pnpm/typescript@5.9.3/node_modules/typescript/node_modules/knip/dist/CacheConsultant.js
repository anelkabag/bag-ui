import { FileEntryCache } from "./util/file-entry-cache.js";
import { timerify } from "./util/Performance.js";
import { version } from "./version.js";
const dummyFileDescriptor = { key: '', changed: true, notFound: true };
export class CacheConsultant {
    isEnabled;
    cache;
    constructor(name, options) {
        this.isEnabled = options.isCache;
        if (this.isEnabled) {
            const cacheName = `${name.replace(/[^a-z0-9]/g, '-').replace(/-*$/, '')}-${options.isProduction ? '-prod' : ''}-${version}`;
            this.cache = new FileEntryCache(cacheName, options.cacheLocation);
            this.reconcile = timerify(this.cache.reconcile).bind(this.cache);
            this.getFileDescriptor = timerify(this.cache.getFileDescriptor).bind(this.cache);
        }
    }
    getFileDescriptor(filePath) {
        if (this.isEnabled && this.cache)
            return this.cache.getFileDescriptor(filePath);
        return dummyFileDescriptor;
    }
    reconcile() {
        if (this.isEnabled && this.cache)
            this.cache.reconcile();
    }
}
