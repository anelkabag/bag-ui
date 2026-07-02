import { hasDependency } from "../../util/plugin.js";
import { getInputs } from "../eslint/helpers.js";
const title = 'xo';
const enablers = ['xo'];
const isEnabled = ({ dependencies }) => hasDependency(dependencies, enablers);
const config = ['package.json', '.xo-config', '.xo-config.{js,cjs,json}', 'xo.config.{js,cjs}'];
const entry = ['.xo-config.{js,cjs}', 'xo.config.{js,cjs}'];
const resolveConfig = async (config, options) => {
    const inputs = getInputs(config, options);
    return [...inputs];
};
const plugin = {
    title,
    enablers,
    isEnabled,
    entry,
    config,
    resolveConfig,
};
export default plugin;
