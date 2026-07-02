import { isInternal, toAbsolute } from "../../util/path.js";
import { load } from "../../util/plugin.js";
export const resolveDependencies = async (config, options) => {
    const { reporter } = config;
    const { configFileDir } = options;
    const reporters = reporter ? new Set([reporter]) : new Set();
    if (reporter === 'cypress-multi-reporters' && config.reporterOptions?.configFile) {
        const { configFile } = config.reporterOptions;
        const configFilePath = toAbsolute(configFile, configFileDir);
        if (isInternal(configFilePath)) {
            const reporterConfig = await load(configFilePath);
            if (typeof reporterConfig === 'object' && reporterConfig.reporterEnabled) {
                const { reporterEnabled: reporterConcatenatedNames } = reporterConfig;
                const reporterNames = reporterConcatenatedNames.split(',');
                for (const reporterName of reporterNames) {
                    reporters.add(reporterName.trim());
                }
            }
        }
    }
    return [...reporters];
};
