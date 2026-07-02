import parseArgs from 'minimist';
import { toDeferResolve, toEntry } from "../../util/input.js";
const title = 'Bun';
const enablers = ['bun'];
const hasBunTest = (scripts) => scripts && Object.values(scripts).some(script => /(?<=^|\s)bun test/.test(script));
const isEnabled = ({ manifest }) => !!hasBunTest(manifest.scripts);
const config = ['bunfig.toml'];
const patterns = ['**/*.{test,spec}.{js,jsx,ts,tsx}', '**/*_{test,spec}.{js,jsx,ts,tsx}'];
const resolveConfig = localConfig => {
    const preload = localConfig.test?.preload ?? [];
    return preload.map(specifier => toDeferResolve(specifier));
};
const toPatterns = (arg) => {
    if (/[*{?]/.test(arg))
        return [arg];
    const dir = arg.replace(/\/+$/, '');
    return patterns.map(pattern => `${dir}/${pattern}`);
};
const resolve = options => {
    const scripts = { ...options.rootManifest?.scripts, ...options.manifest.scripts };
    for (const script of Object.values(scripts)) {
        if (/(?<=^|\s)bun test/.test(script)) {
            const parsed = parseArgs(script.split(' '), { string: ['timeout', 'rerun-each', 'preload'] });
            const args = parsed._.filter(id => id !== 'bun' && id !== 'test');
            const inputs = (args.length === 0 ? patterns : args.flatMap(toPatterns)).map(toEntry);
            for (const specifier of [parsed.preload ?? []].flat())
                inputs.push(toDeferResolve(specifier));
            return inputs;
        }
    }
    return [];
};
const plugin = {
    title,
    enablers,
    isEnabled,
    config,
    resolve,
    resolveConfig,
};
export default plugin;
