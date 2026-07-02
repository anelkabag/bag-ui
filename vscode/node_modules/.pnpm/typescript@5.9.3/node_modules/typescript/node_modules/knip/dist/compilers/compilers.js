export const fencedCodeBlockMatcher = /```[\s\S]*?```/g;
export const inlineCodeMatcher = /`[^`]+`/g;
const scriptExtractor = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
export const importMatcher = /import[^'"]+['"][^'"]+['"]/g;
export const importsWithinScripts = (text) => {
    const scripts = [];
    let scriptMatch;
    while ((scriptMatch = scriptExtractor.exec(text))) {
        for (const importMatch of scriptMatch[1].matchAll(importMatcher)) {
            scripts.push(importMatch);
        }
    }
    return scripts.join(';\n');
};
const scriptBodyExtractor = /<script\b[^>]*>(?<body>[\s\S]*?)<\/script>/gm;
export const scriptBodies = (text) => {
    const scripts = [];
    let scriptMatch;
    while ((scriptMatch = scriptBodyExtractor.exec(text))) {
        if (scriptMatch.groups?.body)
            scripts.push(scriptMatch.groups.body);
    }
    return scripts.join(';\n');
};
export const frontmatterMatcher = /^---\r?\n([\s\S]*?)\r?\n---/;
export const importsWithinFrontmatter = (text, keys = []) => {
    const frontmatter = text.match(frontmatterMatcher)?.[1];
    if (!frontmatter)
        return '';
    const imports = keys.flatMap(key => {
        const valueMatcher = new RegExp(`${key}:\\s*["']([^"']+)["']`, 'i');
        const match = frontmatter.match(valueMatcher);
        return match?.[1] ? [`import ${key} from "${match[1]}";`] : [];
    });
    return imports.join('\n');
};
