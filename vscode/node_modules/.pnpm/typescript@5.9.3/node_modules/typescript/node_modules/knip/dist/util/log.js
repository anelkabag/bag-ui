import picocolors from 'picocolors';
export const logWarning = (prefix, message) => {
    console.warn(`${picocolors.yellow(prefix)}: ${message}`);
};
export const logError = (prefix, message) => {
    console.error(`${picocolors.red(prefix)}: ${message}`);
};
