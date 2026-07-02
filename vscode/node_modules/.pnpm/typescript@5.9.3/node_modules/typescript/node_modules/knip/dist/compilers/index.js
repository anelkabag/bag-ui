import MDX from "./mdx.js";
import SCSS from "./scss.js";
const isAsyncCompiler = (fn) => (fn ? fn.constructor.name === 'AsyncFunction' : false);
export const normalizeCompilerExtension = (ext) => ext.replace(/^\.*/, '.');
export const partitionCompilers = (rawLocalConfig) => {
    const syncCompilers = {};
    const asyncCompilers = {};
    for (const extension in rawLocalConfig.compilers) {
        const ext = normalizeCompilerExtension(extension);
        const compilerFn = rawLocalConfig.compilers[extension];
        if (typeof compilerFn === 'function') {
            if (!rawLocalConfig.asyncCompilers?.[ext] && isAsyncCompiler(compilerFn)) {
                asyncCompilers[ext] = compilerFn;
            }
            else {
                syncCompilers[ext] = compilerFn;
            }
        }
        else if (compilerFn === true) {
            syncCompilers[ext] = true;
        }
    }
    for (const extension in rawLocalConfig.asyncCompilers) {
        const ext = normalizeCompilerExtension(extension);
        asyncCompilers[ext] = rawLocalConfig.asyncCompilers[extension];
    }
    return { ...rawLocalConfig, syncCompilers, asyncCompilers };
};
const compilers = new Map([
    ['.mdx', MDX],
    ['.sass', SCSS],
    ['.scss', SCSS],
]);
export const getIncludedCompilers = (syncCompilers, asyncCompilers, dependencies) => {
    const hasDependency = (packageName) => dependencies.has(packageName);
    for (const [extension, { condition, compiler }] of compilers) {
        if ((!syncCompilers.has(extension) && condition(hasDependency)) || syncCompilers.get(extension) === true) {
            syncCompilers.set(extension, compiler);
        }
    }
    return [syncCompilers, asyncCompilers];
};
export const getCompilerExtensions = (compilers) => [
    ...compilers[0].keys(),
    ...compilers[1].keys(),
];
