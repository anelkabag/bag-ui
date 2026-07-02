import { readFileSync } from 'node:fs';
import { promisify } from 'node:util';
import { walk as _walk } from '@nodelib/fs.walk';
import fg, {} from 'fast-glob';
import picomatch from 'picomatch';
import { GLOBAL_IGNORE_PATTERNS } from "../constants.js";
import { compact, partition } from "./array.js";
import { debugLogObject } from "./debug.js";
import { isDirectory, isFile } from "./fs.js";
import { timerify } from "./Performance.js";
import { parseAndConvertGitignorePatterns } from "./parse-and-convert-gitignores.js";
import { dirname, join, relative, toPosix } from "./path.js";
const walk = promisify(_walk);
const cachedGitIgnores = new Map();
const cachedGlobIgnores = new Map();
const isGitRoot = (dir) => isDirectory(dir, '.git') || isFile(dir, '.git');
const getGitDir = (cwd) => {
    const dotGit = join(cwd, '.git');
    if (isDirectory(dotGit))
        return dotGit;
    if (isFile(dotGit)) {
        const content = readFileSync(dotGit, 'utf8').trim();
        const match = content.match(/^gitdir:\s*(.+)$/);
        if (match)
            return join(cwd, match[1]);
    }
    return undefined;
};
const findAncestorGitignoreFiles = (cwd) => {
    const gitignorePaths = [];
    if (isGitRoot(cwd))
        return gitignorePaths;
    let dir = dirname(cwd);
    let prev;
    while (dir) {
        const filePath = join(dir, '.gitignore');
        if (isFile(filePath))
            gitignorePaths.push(filePath);
        if (isGitRoot(dir))
            break;
        dir = dirname((prev = dir));
        if (prev === dir || dir === '.')
            break;
    }
    return gitignorePaths;
};
export const findAndParseGitignores = async (cwd, workspaceDirs) => {
    const ignores = new Set(GLOBAL_IGNORE_PATTERNS);
    const unignores = [];
    const gitignoreFiles = [];
    const pmOptions = { ignore: unignores };
    let deepFilterMatcher;
    let prevUnignoreLength = unignores.length;
    const pendingIgnores = [];
    const getMatcher = () => {
        if (!deepFilterMatcher) {
            deepFilterMatcher = picomatch(Array.from(ignores), pmOptions);
            pendingIgnores.length = 0;
        }
        else if (pendingIgnores.length > 0) {
            const prev = deepFilterMatcher;
            const incr = picomatch(pendingIgnores.splice(0), pmOptions);
            deepFilterMatcher = (path) => prev(path) || incr(path);
        }
        return deepFilterMatcher;
    };
    const addFile = (filePath, baseDir) => {
        gitignoreFiles.push(relative(cwd, filePath));
        const dir = baseDir ?? dirname(toPosix(filePath));
        const base = relative(cwd, dir);
        const ancestor = base.startsWith('..') ? `${relative(dir, cwd)}/` : undefined;
        const ignoresForDir = new Set(base === '' ? GLOBAL_IGNORE_PATTERNS : []);
        const unignoresForDir = new Set();
        const prevIgnoreSize = ignores.size;
        const patterns = readFileSync(filePath, 'utf8');
        for (const rule of parseAndConvertGitignorePatterns(patterns, ancestor)) {
            const [pattern, extraPattern] = rule.patterns;
            if (rule.negated) {
                if (base === '' || base.startsWith('..')) {
                    if (!unignores.includes(extraPattern)) {
                        unignores.push(...rule.patterns);
                        unignoresForDir.add(pattern);
                        unignoresForDir.add(extraPattern);
                    }
                }
                else {
                    if (!unignores.includes(extraPattern.startsWith('**/') ? extraPattern : `**/${extraPattern}`)) {
                        const unignore = join(base, pattern);
                        const extraUnignore = join(base, extraPattern);
                        unignores.push(unignore, extraUnignore);
                        unignoresForDir.add(unignore);
                        unignoresForDir.add(extraUnignore);
                    }
                }
            }
            else {
                if (base === '' || base.startsWith('..')) {
                    ignores.add(pattern);
                    ignores.add(extraPattern);
                    ignoresForDir.add(pattern);
                    ignoresForDir.add(extraPattern);
                }
                else if (!unignores.includes(extraPattern.startsWith('**/') ? extraPattern : `**/${extraPattern}`)) {
                    const ignore = join(base, pattern);
                    const extraIgnore = join(base, extraPattern);
                    ignores.add(ignore);
                    ignores.add(extraIgnore);
                    ignoresForDir.add(ignore);
                    ignoresForDir.add(extraIgnore);
                }
            }
        }
        const cacheDir = ancestor ? cwd : dir;
        const cacheForDir = cachedGitIgnores.get(cacheDir);
        if (cacheForDir) {
            for (const pattern of ignoresForDir)
                cacheForDir.ignores.add(pattern);
            for (const pattern of unignoresForDir)
                cacheForDir.unignores.add(pattern);
        }
        else {
            cachedGitIgnores.set(cacheDir, { ignores: ignoresForDir, unignores: unignoresForDir });
        }
        if (unignores.length !== prevUnignoreLength) {
            deepFilterMatcher = undefined;
            prevUnignoreLength = unignores.length;
        }
        else if (ignores.size !== prevIgnoreSize) {
            for (const p of ignoresForDir)
                if (!GLOBAL_IGNORE_PATTERNS.includes(p))
                    pendingIgnores.push(p);
        }
    };
    for (const filePath of findAncestorGitignoreFiles(cwd))
        addFile(filePath);
    const gitDir = getGitDir(cwd);
    if (gitDir) {
        const excludePath = join(gitDir, 'info/exclude');
        if (isFile(excludePath))
            addFile(excludePath, cwd);
    }
    let isRelevantDir;
    if (workspaceDirs && workspaceDirs.size > 0) {
        const relevantAncestors = new Set();
        const nonRootDirs = new Set();
        for (const wsDir of workspaceDirs) {
            if (wsDir !== cwd)
                nonRootDirs.add(wsDir);
            let dir = wsDir;
            while (dir.length >= cwd.length) {
                relevantAncestors.add(dir);
                const parent = dirname(dir);
                if (parent === dir)
                    break;
                dir = parent;
            }
        }
        if (nonRootDirs.size > 0) {
            isRelevantDir = (absPath) => {
                if (relevantAncestors.has(absPath))
                    return true;
                for (const wsDir of nonRootDirs)
                    if (absPath.startsWith(`${wsDir}/`))
                        return true;
                return false;
            };
        }
    }
    const entryFilter = (entry) => {
        if (entry.dirent.isFile() && entry.name === '.gitignore') {
            addFile(entry.path);
            return true;
        }
        return false;
    };
    const deepFilter = (entry) => (!isRelevantDir || isRelevantDir(toPosix(entry.path))) && !getMatcher()(relative(cwd, entry.path));
    await walk(cwd, {
        concurrency: 16,
        entryFilter,
        deepFilter,
    });
    debugLogObject('*', 'Parsed gitignore files', { gitignoreFiles });
    return { gitignoreFiles, ignores, unignores };
};
const _parseFindGitignores = timerify(findAndParseGitignores);
export async function glob(_patterns, options) {
    if (Array.isArray(_patterns) && _patterns.length === 0)
        return [];
    const hasCache = cachedGlobIgnores.has(options.dir);
    const willCache = !hasCache && options.gitignore && options.label;
    const cachedIgnores = options.gitignore ? cachedGlobIgnores.get(options.dir) : undefined;
    const _ignore = [...GLOBAL_IGNORE_PATTERNS];
    const [negatedPatterns, patterns] = partition(_patterns, pattern => pattern.startsWith('!'));
    if (options.gitignore && willCache) {
        let dir = options.dir;
        let prev;
        while (dir) {
            const cacheForDir = cachedGitIgnores.get(dir);
            if (cacheForDir) {
                _ignore.push(...cacheForDir.ignores);
            }
            dir = dirname((prev = dir));
            if (prev === dir || dir === '.')
                break;
        }
    }
    if (willCache)
        cachedGlobIgnores.set(options.dir, compact(_ignore));
    const ignorePatterns = (cachedIgnores || _ignore).concat(negatedPatterns.map(pattern => pattern.slice(1)));
    const { dir, label, ...fgOptions } = { ...options, ignore: ignorePatterns };
    const paths = await fg.glob(patterns, fgOptions);
    debugLogObject(relative(options.cwd, dir), label ? `Finding ${label}` : 'Finding paths', () => ({
        patterns,
        ...fgOptions,
        ignore: hasCache && ignorePatterns.length === (cachedIgnores || _ignore).length
            ? `// using cache from previous glob cwd: ${fgOptions.cwd}`
            : ignorePatterns,
        paths,
    }));
    return paths;
}
export async function getGitIgnoredHandler(options, workspaceDirs) {
    cachedGitIgnores.clear();
    if (options.gitignore === false)
        return () => false;
    const { ignores, unignores } = await _parseFindGitignores(options.cwd, workspaceDirs);
    const matcher = picomatch(Array.from(ignores), { ignore: unignores });
    const cache = new Map();
    const isGitIgnored = (filePath) => {
        let result = cache.get(filePath);
        if (result === undefined) {
            result = matcher(relative(options.cwd, filePath));
            cache.set(filePath, result);
        }
        return result;
    };
    return isGitIgnored;
}
