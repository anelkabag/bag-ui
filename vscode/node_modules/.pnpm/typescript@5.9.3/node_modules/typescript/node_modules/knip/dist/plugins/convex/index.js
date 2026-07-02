import { hasDependency } from "../../util/plugin.js";
const title = 'Convex';
const enablers = ['convex'];
const isEnabled = ({ dependencies }) => hasDependency(dependencies, enablers);
const entry = ['convex/*.config.@(js|ts)', 'convex/**/_generated/*.@(js|ts)'];
const plugin = {
    title,
    enablers,
    isEnabled,
    entry,
};
export default plugin;
