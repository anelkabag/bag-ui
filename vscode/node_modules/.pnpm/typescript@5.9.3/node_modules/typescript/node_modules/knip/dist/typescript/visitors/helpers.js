import ts from 'typescript';
export const isNotJS = (sourceFile) => !isJS(sourceFile);
export const isJS = (sourceFile) => sourceFile.scriptKind === ts.ScriptKind.JS || sourceFile.scriptKind === ts.ScriptKind.JSX;
export const isModule = (sourceFile) => ts.isExternalModule(sourceFile);
export function hasImportSpecifier(node, name, id) {
    return (ts.isImportDeclaration(node) &&
        ts.isStringLiteral(node.moduleSpecifier) &&
        node.moduleSpecifier.text === name &&
        !!node.importClause?.namedBindings &&
        ts.isNamedImports(node.importClause.namedBindings) &&
        (!id || node.importClause.namedBindings.elements.some(element => element.name.text === id)));
}
