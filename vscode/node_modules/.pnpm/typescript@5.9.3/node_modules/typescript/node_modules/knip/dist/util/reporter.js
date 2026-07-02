import internalReporters from "../reporters/index.js";
import { _load } from "./loader.js";
import { isAbsolute, isInternal, resolve } from "./path.js";
export const runPreprocessors = async (processors, data) => {
    const preprocessors = await Promise.all(processors.map(proc => _load(isInternal(proc) && !isAbsolute(proc) ? resolve(proc) : proc)));
    return preprocessors.length === 0
        ? Promise.resolve(data)
        : runPreprocessors(preprocessors.slice(1), preprocessors[0](data));
};
export const runReporters = async (reporter, options) => {
    const reporters = await Promise.all(reporter.map(async (reporter) => {
        return reporter in internalReporters
            ? internalReporters[reporter]
            : await _load(isInternal(reporter) && !isAbsolute(reporter) ? resolve(reporter) : reporter);
    }));
    for (const reporter of reporters)
        await reporter(options);
};
