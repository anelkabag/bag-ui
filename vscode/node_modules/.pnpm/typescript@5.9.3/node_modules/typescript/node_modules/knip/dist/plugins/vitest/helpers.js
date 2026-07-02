const environments = {
    node: null,
    jsdom: null,
    'happy-dom': null,
    'edge-runtime': null,
};
const envPackageNames = {
    jsdom: 'jsdom',
    'happy-dom': 'happy-dom',
    'edge-runtime': '@edge-runtime/vm',
};
export const getEnvSpecifier = (env) => {
    if (env in envPackageNames)
        return envPackageNames[env];
    return `vitest-environment-${env}`;
};
const builtInReporters = [
    'basic',
    'blob',
    'default',
    'dot',
    'github-actions',
    'hanging-process',
    'html',
    'json',
    'junit',
    'tap',
    'tap-flat',
    'tree',
    'verbose',
];
export const getExternalReporters = (reporters) => reporters
    ? [reporters]
        .flat()
        .map(reporter => (Array.isArray(reporter) ? reporter[0] : reporter))
        .filter((reporter) => typeof reporter === 'string' && !builtInReporters.includes(reporter))
    : [];
