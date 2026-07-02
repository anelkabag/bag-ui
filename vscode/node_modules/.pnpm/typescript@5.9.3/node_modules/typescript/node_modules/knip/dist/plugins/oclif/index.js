import { toDependency } from "../../util/input.js";
import { hasDependency } from "../../util/plugin.js";
const title = 'oclif';
const enablers = ['oclif'];
const isEnabled = ({ dependencies }) => hasDependency(dependencies, enablers);
const config = ['package.json'];
const resolveConfig = async (config) => {
    const plugins = config?.plugins ?? [];
    const devPlugins = config?.devPlugins ?? [];
    return [...plugins, ...devPlugins].map(id => toDependency(id));
};
const plugin = {
    title,
    enablers,
    isEnabled,
    config,
    resolveConfig,
};
export default plugin;
