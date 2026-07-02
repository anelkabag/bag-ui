import parseArgs from 'minimist';
export const argsFrom = (args, from) => args.slice(args.indexOf(from));
export const parseNodeArgs = (args) => parseArgs(args, {
    string: ['r'],
    alias: { require: ['r', 'loader', 'experimental-loader', 'test-reporter', 'watch', 'import'] },
});
