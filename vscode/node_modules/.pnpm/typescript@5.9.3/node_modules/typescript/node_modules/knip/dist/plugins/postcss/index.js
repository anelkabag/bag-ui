import { toDeferResolve, toDependency } from "../../util/input.js";
import { hasDependency } from "../../util/plugin.js";
import { toLilconfig } from "../../util/plugin-config.js";
const title = 'PostCSS';
const enablers = ['postcss', 'postcss-cli', 'next'];
const isEnabled = ({ dependencies }) => hasDependency(dependencies, enablers);
const config = [
    'package.json',
    'postcss.config.json',
    ...toLilconfig('postcss', { configDir: false, additionalExtensions: ['mts', 'cts', 'yaml', 'yml'] }),
];
const resolveConfig = config => {
    const plugins = config.plugins
        ? (Array.isArray(config.plugins) ? config.plugins : Object.keys(config.plugins)).flatMap(plugin => {
            if (typeof plugin === 'string')
                return plugin;
            if (Array.isArray(plugin) && typeof plugin[0] === 'string')
                return plugin[0];
            return [];
        })
        : [];
    const inputs = plugins.map(id => toDeferResolve(id));
    return ['tailwindcss', '@tailwindcss/postcss'].some(tailwindPlugin => plugins.includes(tailwindPlugin))
        ? [...inputs, toDependency('postcss')]
        : inputs;
};
const plugin = {
    title,
    enablers,
    isEnabled,
    config,
    resolveConfig,
};
export default plugin;
