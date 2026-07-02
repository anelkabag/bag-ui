import { hasDependency } from "../../util/plugin.js";
import { findWebpackDependenciesFromConfig } from "../webpack/index.js";
const title = 'Rspack';
const enablers = ['@rspack/core'];
const isEnabled = ({ dependencies }) => hasDependency(dependencies, enablers);
const config = ['rspack.config*.{js,ts,mjs,mts,cjs,cts}'];
const resolveConfig = async (localConfig, options) => {
    const inputs = await findWebpackDependenciesFromConfig(localConfig, options);
    return inputs.filter(input => !input.specifier.startsWith('builtin:'));
};
const plugin = {
    title,
    enablers,
    isEnabled,
    config,
    resolveConfig,
};
export default plugin;
