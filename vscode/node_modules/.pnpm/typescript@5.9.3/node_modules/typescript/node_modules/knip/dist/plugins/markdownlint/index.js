import { toDependency } from "../../util/input.js";
import { hasDependency } from "../../util/plugin.js";
import { getArgumentValues } from "./helpers.js";
const title = 'markdownlint';
const enablers = ['markdownlint-cli'];
const isEnabled = ({ dependencies }) => hasDependency(dependencies, enablers);
const config = ['.markdownlint.{json,jsonc}', '.markdownlint.{yml,yaml}'];
const resolveConfig = (config, options) => {
    const { manifest } = options;
    const extend = config?.extends ? [config.extends] : [];
    const scripts = manifest?.scripts
        ? Object.values(manifest.scripts).filter((script) => typeof script === 'string')
        : [];
    const uses = scripts
        .filter(script => script.includes('markdownlint '))
        .flatMap(script => getArgumentValues(script, / (--rules|-r)[ =]([^ ]+)/g));
    return [...extend, ...uses].map(id => toDependency(id));
};
const plugin = {
    title,
    enablers,
    isEnabled,
    config,
    resolveConfig,
};
export default plugin;
