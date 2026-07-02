const directiveMatcher = /@(?:import|config|plugin)\s+['"]([^'"]+)['"][^;]*;/g;
const compiler = (text) => {
    const imports = [];
    let match;
    let index = 0;
    while ((match = directiveMatcher.exec(text)))
        if (match[1])
            imports.push(`import _$${index++} from '${match[1]}';`);
    return imports.join('\n');
};
export default compiler;
