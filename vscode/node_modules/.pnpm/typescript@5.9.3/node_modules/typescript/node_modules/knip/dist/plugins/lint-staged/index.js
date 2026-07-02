import { hasDependency } from "../../util/plugin.js";
import { toLilconfig } from "../../util/plugin-config.js";
const title = 'lint-staged';
const enablers = ['lint-staged'];
const isEnabled = ({ dependencies }) => hasDependency(dependencies, enablers);
const config = [
    'package.json',
    'package.yaml',
    'package.yml',
    ...toLilconfig('lint-staged'),
    ...toLilconfig('lintstaged'),
];
const resolveEntry = async (value) => {
    if (Array.isArray(value))
        return (await Promise.all(value.map(resolveEntry))).flat();
    if (typeof value === 'function')
        return [await value([])].flat().filter(item => typeof item === 'string');
    return typeof value === 'string' ? [value] : [];
};
const resolveConfig = async (config, options) => {
    if (options.isProduction)
        return [];
    const cfg = typeof config === 'function' ? await config([]) : config;
    if (!cfg)
        return [];
    const inputs = new Set();
    for (const [key, entry] of Object.entries(cfg)) {
        if (key.startsWith('_'))
            continue;
        const scripts = await resolveEntry(entry);
        for (const id of options.getInputsFromScripts(scripts))
            inputs.add(id);
    }
    return Array.from(inputs);
};
const plugin = {
    title,
    enablers,
    isEnabled,
    config,
    resolveConfig,
};
export default plugin;
