import { fencedCodeBlockMatcher, frontmatterMatcher, inlineCodeMatcher } from "./compilers.js";
const mdxDependencies = [
    '@mdx-js/esbuild',
    '@mdx-js/loader',
    '@mdx-js/mdx',
    '@mdx-js/node-loader',
    '@mdx-js/preact',
    '@mdx-js/react',
    '@mdx-js/rollup',
    '@mdx-js/vue',
    'remark-mdx',
];
const condition = (hasDependency) => mdxDependencies.some(hasDependency);
const mdxImportMatcher = /^import[^'"]+['"][^'"]+['"]/gm;
const compiler = (text) => [
    ...text
        .replace(frontmatterMatcher, '')
        .replace(fencedCodeBlockMatcher, '')
        .replace(inlineCodeMatcher, '')
        .matchAll(mdxImportMatcher),
].join('\n');
export default { condition, compiler };
