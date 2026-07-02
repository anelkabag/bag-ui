declare const _default: {
    symbols: (options: import("../types.ts").ReporterOptions) => void;
    compact: ({ report, issues, isShowProgress, cwd }: import("../types.ts").ReporterOptions) => void;
    codeowners: ({ report, issues, isShowProgress, options, cwd }: import("../types.ts").ReporterOptions) => void;
    disclosure: ({ report, issues, cwd }: import("../types.ts").ReporterOptions) => void;
    codeclimate: ({ report, issues, cwd }: import("../types.ts").ReporterOptions) => Promise<void>;
    json: ({ report, issues, options, cwd }: import("../types.ts").ReporterOptions) => Promise<void>;
    markdown: ({ report, issues, cwd }: import("../types.ts").ReporterOptions) => void;
    'github-actions': ({ report, issues, cwd, configurationHints, isDisableConfigHints, isTreatConfigHintsAsErrors, configFilePath, }: import("../types.ts").ReporterOptions) => void;
};
export default _default;
