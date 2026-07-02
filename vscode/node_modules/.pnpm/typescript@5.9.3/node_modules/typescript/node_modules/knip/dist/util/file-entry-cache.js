import fs from 'node:fs';
import path from 'node:path';
import { deserialize, serialize } from 'node:v8';
import { debugLog } from "./debug.js";
import { isDirectory, isFile } from "./fs.js";
import { timerify } from "./Performance.js";
import { dirname, isAbsolute, resolve } from "./path.js";
const createCache = (filePath) => {
    try {
        return deserialize(fs.readFileSync(filePath));
    }
    catch (_err) {
        debugLog('*', `Error reading cache from ${filePath}`);
    }
};
const create = timerify(createCache);
export class FileEntryCache {
    filePath;
    cache = new Map();
    normalizedEntries = new Map();
    constructor(cacheId, _path) {
        this.filePath = path.resolve(_path, cacheId);
        if (isFile(this.filePath))
            this.cache = create(this.filePath);
        this.removeNotFoundFiles();
    }
    removeNotFoundFiles() {
        for (const filePath of this.normalizedEntries.keys()) {
            try {
                fs.statSync(filePath);
            }
            catch (error) {
                if (error.code === 'ENOENT')
                    this.cache.delete(filePath);
            }
        }
    }
    getFileDescriptor(filePath) {
        let fstat;
        try {
            if (!isAbsolute(filePath))
                filePath = resolve(filePath);
            fstat = fs.statSync(filePath);
        }
        catch (error) {
            this.removeEntry(filePath);
            return { key: filePath, notFound: true, err: error };
        }
        return this._getFileDescriptorUsingMtimeAndSize(filePath, fstat);
    }
    _getFileDescriptorUsingMtimeAndSize(filePath, fstat) {
        let meta = this.cache.get(filePath);
        const cacheExists = Boolean(meta);
        const cSize = fstat.size;
        const cTime = fstat.mtime.getTime();
        let isDifferentDate;
        let isDifferentSize;
        if (meta) {
            isDifferentDate = cTime !== meta.mtime;
            isDifferentSize = cSize !== meta.size;
        }
        else {
            meta = { size: cSize, mtime: cTime };
        }
        const fd = {
            key: filePath,
            changed: !cacheExists || isDifferentDate || isDifferentSize,
            meta,
        };
        this.normalizedEntries.set(filePath, fd);
        return fd;
    }
    removeEntry(entryName) {
        if (!isAbsolute(entryName))
            entryName = resolve(entryName);
        this.normalizedEntries.delete(entryName);
        this.cache.delete(entryName);
    }
    _getMetaForFileUsingMtimeAndSize(cacheEntry) {
        const stat = fs.statSync(cacheEntry.key);
        const meta = Object.assign(cacheEntry.meta ?? {}, {
            size: stat.size,
            mtime: stat.mtime.getTime(),
        });
        return meta;
    }
    reconcile() {
        this.removeNotFoundFiles();
        for (const [entryName, cacheEntry] of this.normalizedEntries) {
            try {
                const meta = this._getMetaForFileUsingMtimeAndSize(cacheEntry);
                this.cache.set(entryName, meta);
            }
            catch (error) {
                if (error.code !== 'ENOENT')
                    throw error;
            }
        }
        try {
            const dir = dirname(this.filePath);
            if (!isDirectory(dir))
                fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(this.filePath, serialize(this.cache));
        }
        catch (_err) {
            debugLog('*', `Error writing cache to ${this.filePath}`);
        }
    }
}
