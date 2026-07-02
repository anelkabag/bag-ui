import { isFile } from "../../util/fs.js";
import { toEntry } from "../../util/input.js";
const title = 'Yarn';
const enablers = 'This plugin is enabled when a `yarn.lock` file is found in the root folder.';
const isEnabled = async ({ cwd }) => isFile(cwd, 'yarn.lock');
const isRootOnly = true;
const config = ['.yarnrc.yml'];
const entry = ['yarn.config.cjs'];
const resolveConfig = config => {
    const inputs = entry.map(id => toEntry(id));
    if (Array.isArray(config.plugins)) {
        for (const plugin of config.plugins) {
            if (typeof plugin === 'string')
                inputs.push(toEntry(plugin));
            else if (typeof plugin.path === 'string')
                inputs.push(toEntry(plugin.path));
        }
    }
    if (config.yarnPath) {
        inputs.push(toEntry(config.yarnPath));
    }
    return inputs;
};
const plugin = {
    title,
    enablers,
    isEnabled,
    isRootOnly,
    config,
    entry,
    resolveConfig,
};
export default plugin;
