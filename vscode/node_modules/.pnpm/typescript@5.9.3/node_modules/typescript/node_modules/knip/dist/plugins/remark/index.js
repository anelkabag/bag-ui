import { toDeferResolve } from "../../util/input.js";
import { isInternal } from "../../util/path.js";
import { hasDependency } from "../../util/plugin.js";
const title = 'Remark';
const enablers = ['remark-cli'];
const isEnabled = ({ dependencies }) => hasDependency(dependencies, enablers);
const packageJsonPath = 'remarkConfig';
const config = ['package.json', '.remarkrc', '.remarkrc.json', '.remarkrc.{js,cjs,mjs}', '.remarkrc.{yml,yaml}'];
const resolveConfig = config => {
    const plugins = config.plugins
        ?.flatMap(plugin => {
        if (typeof plugin === 'string')
            return plugin;
        if (Array.isArray(plugin) && typeof plugin[0] === 'string')
            return plugin[0];
        return [];
    })
        .map(plugin => (isInternal(plugin) ? plugin : plugin.startsWith('remark-') ? plugin : `remark-${plugin}`)) ?? [];
    return plugins.map(id => toDeferResolve(id));
};
const plugin = {
    title,
    enablers,
    isEnabled,
    packageJsonPath,
    config,
    resolveConfig,
};
export default plugin;
