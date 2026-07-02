import { isFile } from "../../util/fs.js";
import { toDependency } from "../../util/input.js";
import { hasDependency } from "../../util/plugin.js";
const title = 'Capacitor';
const enablers = [/^@capacitor\//];
const isEnabled = ({ dependencies }) => hasDependency(dependencies, enablers);
const config = ['capacitor.config.{json,ts}'];
const resolveConfig = async (config, { configFileDir }) => {
    const plugins = config.includePlugins ?? [];
    const android = isFile(configFileDir, 'android/capacitor.settings.gradle') ? ['@capacitor/android'] : [];
    const ios = isFile(configFileDir, 'ios/App/Podfile') ? ['@capacitor/ios'] : [];
    return [...plugins, ...android, ...ios].map(id => toDependency(id));
};
const plugin = {
    title,
    enablers,
    isEnabled,
    config,
    resolveConfig,
};
export default plugin;
