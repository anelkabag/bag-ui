import { hasDependency } from "../../util/plugin.js";
const title = 'Rslib';
const enablers = ['@rslib/core'];
const isEnabled = ({ dependencies }) => hasDependency(dependencies, enablers);
const entry = ['rslib*.config.{mjs,ts,js,cjs,mts,cts}'];
const resolveConfig = () => {
    return [];
};
const plugin = {
    title,
    enablers,
    isEnabled,
    entry,
    resolveConfig,
};
export default plugin;
