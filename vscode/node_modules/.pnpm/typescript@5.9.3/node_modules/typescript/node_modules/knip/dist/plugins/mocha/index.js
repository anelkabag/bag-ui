import { toDeferResolve, toEntry } from "../../util/input.js";
import { hasDependency } from "../../util/plugin.js";
const title = 'Mocha';
const enablers = ['mocha'];
const isEnabled = ({ dependencies }) => hasDependency(dependencies, enablers);
const config = ['.mocharc.{js,cjs,json,jsonc,yml,yaml}', 'package.json'];
const entry = ['**/test/*.{js,cjs,mjs}'];
const resolveConfig = localConfig => {
    const entryPatterns = localConfig.spec ? [localConfig.spec].flat() : entry;
    const require = localConfig.require ? [localConfig.require].flat() : [];
    const inputs = [];
    inputs.push(...entryPatterns.map(id => toEntry(id)));
    inputs.push(...require.map(id => toDeferResolve(id)));
    return inputs;
};
const args = {
    nodeImportArgs: true,
};
const plugin = {
    title,
    enablers,
    isEnabled,
    config,
    entry,
    resolveConfig,
    args,
};
export default plugin;
