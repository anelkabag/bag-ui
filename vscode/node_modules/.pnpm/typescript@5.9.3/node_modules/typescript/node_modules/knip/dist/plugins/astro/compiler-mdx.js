import { fencedCodeBlockMatcher, importMatcher, importsWithinFrontmatter, inlineCodeMatcher, } from "../../compilers/compilers.js";
const frontmatterImportFields = ['layout'];
const compiler = (text) => {
    const imports = text.replace(fencedCodeBlockMatcher, '').replace(inlineCodeMatcher, '').matchAll(importMatcher);
    const frontmatterImports = importsWithinFrontmatter(text, frontmatterImportFields);
    return [...imports, frontmatterImports].join('\n');
};
export default compiler;
