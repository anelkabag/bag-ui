import { toEntry, toProductionEntry } from "../../util/input.js";
const title = 'Node.js';
const isEnabled = () => true;
const patterns = [
    '**/*{.,-,_}test.{cjs,mjs,js,cts,mts,ts}',
    '**/test-*.{cjs,mjs,js,cts,mts,ts}',
    '**/test.{cjs,mjs,js,cts,mts,ts}',
    '**/test/**/*.{cjs,mjs,js,cts,mts,ts}',
];
const hasNodeTest = (scripts) => scripts && Object.values(scripts).some(script => /(?<=^|\s)node\s(.*)--test/.test(script));
const entry = ['server.js'];
const resolve = options => {
    const entries = entry.map(id => toProductionEntry(id));
    if (hasNodeTest(options.manifest.scripts) || hasNodeTest(options.rootManifest?.scripts)) {
        entries.push(...patterns.map(toEntry));
    }
    return entries;
};
const args = {
    positional: true,
    nodeImportArgs: true,
    resolve: ['test-reporter'],
    boolean: [
        'deprecation',
        'experimental-strip-types',
        'experimental-transform-types',
        'harmony',
        'inspect-brk',
        'inspect-wait',
        'inspect',
        'test-only',
        'test',
        'warnings',
        'watch',
    ],
    args: (args) => args.filter(arg => !/--test-reporter[= ](spec|tap|dot|junit|lcov)/.test(arg)),
};
const plugin = {
    title,
    isEnabled,
    entry,
    resolve,
    args,
};
export default plugin;
