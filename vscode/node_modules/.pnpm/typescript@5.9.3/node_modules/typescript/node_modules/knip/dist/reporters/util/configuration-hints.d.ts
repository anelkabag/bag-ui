import type { Results } from '../../run.ts';
import type { ConfigurationHint, ConfigurationHintType, ReporterOptions } from '../../types/issues.ts';
interface PrintHintOptions {
    type: ConfigurationHintType;
    identifier: string | RegExp;
    filePath: string;
    configFilePath?: string;
    workspaceName?: string;
    size?: number;
}
declare const hintPrinters: Map<ConfigurationHintType, {
    print: (options: PrintHintOptions) => string;
}>;
export { hintPrinters };
interface ProcessedHint extends ConfigurationHint {
    message: string;
}
export declare const finalizeConfigurationHints: (results: Results, options: {
    cwd: string;
    configFilePath?: string;
}) => ProcessedHint[];
export declare const printConfigurationHints: ({ cwd, counters, issues, tagHints, configurationHints, enabledPlugins, isTreatConfigHintsAsErrors, includedWorkspaceDirs, selectedWorkspaces, configFilePath, }: ReporterOptions) => void;
