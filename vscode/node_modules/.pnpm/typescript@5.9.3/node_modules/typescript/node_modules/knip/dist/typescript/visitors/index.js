const noop = () => undefined;
export const importVisitor = (fileCondition, visitorFn) => sourceFile => {
    if (fileCondition(sourceFile)) {
        return (node, options) => visitorFn(node, options);
    }
    return noop;
};
export const exportVisitor = (fileCondition, visitorFn) => sourceFile => {
    if (fileCondition(sourceFile)) {
        return (node, options) => visitorFn(node, options);
    }
    return noop;
};
export const scriptVisitor = (fileCondition, visitorFn) => sourceFile => {
    if (fileCondition(sourceFile)) {
        return (node, options) => visitorFn(node, options);
    }
    return noop;
};
