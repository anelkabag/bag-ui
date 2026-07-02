const directiveMatcher = /generator\s+(?!client)\w+\s*\{\s*provider\s*=\s*"([^"]+)"[^}]*\}/g;
const compiler = (text) => {
    const imports = [];
    let match;
    while ((match = directiveMatcher.exec(text))) {
        if (match[1]) {
            imports.push(`import '${match[1]}';`);
        }
    }
    return imports.join('\n');
};
export default compiler;
