import { toDeferResolve, toDependency } from "../../util/input.js";
import { hasDependency } from "../../util/plugin.js";
const title = 'Prettier';
const enablers = ['prettier'];
const isEnabled = ({ dependencies }) => hasDependency(dependencies, enablers);
const config = [
    '.prettierrc',
    '.prettierrc.{json,js,cjs,mjs,ts,cts,mts,yml,yaml,toml,json5}',
    'prettier.config.{js,cjs,mjs,ts,cts,mts}',
    'package.{json,yaml}',
];
const resolveConfig = config => {
    if (typeof config === 'string')
        return [toDeferResolve(config)];
    return Array.isArray(config.plugins)
        ? config.plugins.filter((plugin) => typeof plugin === 'string').map(id => toDependency(id))
        : [];
};
const isFilterTransitiveDependencies = true;
const plugin = {
    title,
    enablers,
    isEnabled,
    config,
    resolveConfig,
    isFilterTransitiveDependencies,
};
export default plugin;
