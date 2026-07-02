import parseArgs from 'minimist';
import { toBinary, toDependency } from "../../util/input.js";
import { stripVersionFromSpecifier } from "../../util/modules.js";
import { isInternal } from "../../util/path.js";
import { argsFrom } from "../util.js";
export const resolveX = (args, options) => {
    const { fromArgs } = options;
    const parsed = parseArgs(args, { boolean: ['bun'] });
    const packageSpecifier = parsed._[0];
    const specifier = packageSpecifier ? stripVersionFromSpecifier(packageSpecifier) : '';
    const packages = parsed.package && !parsed.yes ? [parsed.package].flat().map(stripVersionFromSpecifier) : [];
    const command = parsed['shell-mode'] ? fromArgs([parsed['shell-mode']]) : [];
    const restArgs = argsFrom(args, packageSpecifier);
    const isBinary = specifier && !packageSpecifier.includes('@') && !isInternal(specifier);
    const dependency = isBinary ? toBinary(specifier, { optional: true }) : toDependency(specifier, { optional: true });
    const specifiers = specifier ? [dependency] : [];
    return [...specifiers, ...packages.map(id => toDependency(id)), ...command, ...fromArgs(restArgs).slice(1)];
};
export const resolve = (_binary, args, options) => {
    return resolveX(args, options);
};
