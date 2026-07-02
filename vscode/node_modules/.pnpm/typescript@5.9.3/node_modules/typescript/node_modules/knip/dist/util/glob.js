import fg from 'fast-glob';
import { compact } from "./array.js";
import { glob } from "./glob-core.js";
import { timerify } from "./Performance.js";
import { isAbsolute, join, relative } from "./path.js";
const prepend = (pattern, relativePath) => isAbsolute(pattern.replace(/^!/, '')) ? pattern : prependDirToPattern(relativePath, pattern);
const prependDirToPatterns = (cwd, dir, patterns) => {
    const relativePath = relative(cwd, dir);
    return compact([patterns].flat().map(p => removeProductionSuffix(prepend(p, relativePath)))).sort(negatedLast);
};
export const removeProductionSuffix = (pattern) => pattern.replace(/!$/, '');
const negatedLast = (pattern) => (pattern.startsWith('!') ? 1 : -1);
export const prependDirToPattern = (dir, pattern) => {
    if (pattern.startsWith('!'))
        return `!${join(dir, pattern.slice(1))}`;
    return join(dir, pattern);
};
export const negate = (pattern) => pattern.replace(/^!?/, '!');
export const hasProductionSuffix = (pattern) => pattern.endsWith('!');
export const hasNoProductionSuffix = (pattern) => !pattern.endsWith('!');
const defaultGlob = async ({ cwd, dir = cwd, patterns, gitignore = true, label }) => {
    if (patterns.length === 0)
        return [];
    const globPatterns = prependDirToPatterns(cwd, dir, patterns);
    if (globPatterns[0].startsWith('!'))
        return [];
    return glob(globPatterns, {
        cwd,
        dir,
        gitignore,
        absolute: true,
        dot: true,
        label,
    });
};
const syncGlob = ({ cwd, patterns }) => fg.sync(patterns, { cwd, followSymbolicLinks: false });
const dirGlob = async ({ cwd, patterns, gitignore = true }) => glob(patterns, {
    cwd,
    dir: cwd,
    onlyDirectories: true,
    gitignore,
});
export const _glob = timerify(defaultGlob);
export const _syncGlob = timerify(syncGlob);
export const _dirGlob = timerify(dirGlob);
