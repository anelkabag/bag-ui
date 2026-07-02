export const findCycles = (graph, filePath, maxDepth = 16) => {
    const cycles = [];
    const visited = new Set();
    const pathSet = new Set([filePath]);
    const path = [filePath];
    const visit = (currentPath) => {
        if (path.length > maxDepth)
            return;
        const node = graph.get(currentPath);
        if (!node?.imports?.internal)
            return;
        const nonTypeOnlyImports = new Set();
        for (const _import of node.imports.imports) {
            if (_import.filePath && !_import.isTypeOnly)
                nonTypeOnlyImports.add(_import.filePath);
        }
        for (const [importedPath] of node.imports.internal) {
            if (!nonTypeOnlyImports.has(importedPath))
                continue;
            if (importedPath === filePath) {
                cycles.push([...path, importedPath]);
                continue;
            }
            if (visited.has(importedPath))
                continue;
            if (!pathSet.has(importedPath)) {
                path.push(importedPath);
                pathSet.add(importedPath);
                visit(importedPath);
                pathSet.delete(importedPath);
                path.pop();
            }
        }
        visited.add(currentPath);
    };
    visit(filePath);
    return cycles;
};
