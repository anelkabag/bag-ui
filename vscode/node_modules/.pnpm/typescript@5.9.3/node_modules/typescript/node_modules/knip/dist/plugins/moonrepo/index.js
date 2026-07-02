import { hasDependency } from "../../util/plugin.js";
const title = 'moonrepo';
const enablers = ['@moonrepo/cli'];
const isEnabled = ({ dependencies }) => hasDependency(dependencies, enablers);
const isRootOnly = true;
const config = ['moon.yml', '.moon/tasks.yml', '.moon/tasks/*.yml'];
const resolveConfig = async (config, options) => {
    const tasks = config.tasks ? Object.values(config.tasks) : [];
    const inputs = tasks
        .map(task => task.command)
        .filter(command => command)
        .map(command => (Array.isArray(command) ? command.join(' ') : command))
        .map(command => command.replace('$workspaceRoot', options.rootCwd))
        .map(command => command.replace('$projectRoot', options.cwd))
        .flatMap(command => options.getInputsFromScripts(command));
    return [...inputs];
};
const plugin = {
    title,
    enablers,
    isEnabled,
    isRootOnly,
    config,
    resolveConfig,
};
export default plugin;
