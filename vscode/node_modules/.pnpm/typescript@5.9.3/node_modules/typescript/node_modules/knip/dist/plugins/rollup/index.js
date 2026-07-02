import { hasDependency } from "../../util/plugin.js";
const title = 'Rollup';
const enablers = ['rollup'];
const isEnabled = ({ dependencies }) => hasDependency(dependencies, enablers);
const entry = ['rollup.config.{js,cjs,mjs,ts}'];
const args = {
    alias: { plugin: ['p'] },
    args: (args) => args.map(arg => (arg.startsWith('--watch.onEnd') ? `--_exec${arg.slice(13)}` : arg)),
    fromArgs: ['_exec'],
    resolve: ['plugin', 'configPlugin'],
};
const plugin = {
    title,
    enablers,
    isEnabled,
    entry,
    args,
};
export default plugin;
