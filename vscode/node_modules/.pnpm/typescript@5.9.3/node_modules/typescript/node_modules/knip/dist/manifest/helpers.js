import { join } from "../util/path.js";
import { _require } from "../util/require.js";
export const loadPackageManifest = ({ dir, packageName, cwd }) => {
    try {
        return _require(join(dir, 'node_modules', packageName, 'package.json'));
    }
    catch (_error) {
        if (dir !== cwd) {
            try {
                return _require(join(cwd, 'node_modules', packageName, 'package.json'));
            }
            catch (_error) {
            }
        }
    }
};
export const getFilteredScripts = (scripts) => {
    if (!scripts)
        return [{}, {}];
    const productionScripts = {};
    const developmentScripts = {};
    for (const scriptName in scripts) {
        if (!/^\w/.test(scriptName))
            continue;
        if (scriptName === 'start')
            productionScripts[scriptName] = scripts[scriptName];
        else
            developmentScripts[scriptName] = scripts[scriptName];
    }
    return [productionScripts, developmentScripts];
};
