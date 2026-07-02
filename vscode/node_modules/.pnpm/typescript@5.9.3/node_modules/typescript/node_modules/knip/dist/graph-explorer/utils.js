import { getCachedExportedIdentifiers, setCachedExportedIdentifiers } from "./cache.js";
import { forEachAliasReExport, forEachNamespaceReExport, forEachPassThroughReExport, getStarReExportSources, } from "./visitors.js";
export const getExportedIdentifiers = (graph, filePath, visited = new Set()) => {
    if (visited.has(filePath))
        return new Map();
    visited.add(filePath);
    const cached = getCachedExportedIdentifiers(graph, filePath);
    if (cached)
        return cached;
    const node = graph.get(filePath);
    if (!node)
        return new Map();
    const identifiers = new Map();
    const addIdentifier = (identifier, isDuplicate = false) => {
        if (identifiers.has(identifier)) {
            identifiers.set(identifier, true);
        }
        else {
            identifiers.set(identifier, isDuplicate);
        }
    };
    for (const identifier of node.exports.keys()) {
        if (identifier === 'default')
            continue;
        addIdentifier(identifier);
    }
    if (node.imports?.internal) {
        for (const [importedPath, importDetails] of node.imports.internal) {
            forEachPassThroughReExport(importDetails, (id, _sources) => {
                if (id !== 'default')
                    addIdentifier(id);
            });
            forEachAliasReExport(importDetails, (_id, alias, _sources) => {
                addIdentifier(alias);
            });
            forEachNamespaceReExport(importDetails, (namespace, _sources) => {
                addIdentifier(namespace, true);
            });
            const starSources = getStarReExportSources(importDetails);
            if (starSources) {
                const nestedIdentifiers = getExportedIdentifiers(graph, importedPath, new Set(visited));
                for (const [nestedId, isNestedDuplicate] of nestedIdentifiers) {
                    if (nestedId !== 'default')
                        addIdentifier(nestedId, isNestedDuplicate);
                }
            }
        }
    }
    setCachedExportedIdentifiers(graph, filePath, identifiers);
    return identifiers;
};
export const hasStrictlyEnumReferences = (importsForExport, identifier) => {
    if (!importsForExport || !importsForExport.refs.has(identifier))
        return false;
    for (const ref of importsForExport.refs) {
        if (ref.startsWith(`${identifier}.`))
            return false;
    }
    return true;
};
export const getIssueType = (hasOnlyNsReference, isType) => {
    if (hasOnlyNsReference)
        return isType ? 'nsTypes' : 'nsExports';
    return isType ? 'types' : 'exports';
};
export const findImportRef = (graph, importingFile, importedFile, identifier) => {
    const node = graph.get(importingFile);
    if (!node)
        return undefined;
    for (const _import of node.imports.imports) {
        if (_import.filePath === importedFile && _import.identifier === identifier)
            return _import;
    }
};
