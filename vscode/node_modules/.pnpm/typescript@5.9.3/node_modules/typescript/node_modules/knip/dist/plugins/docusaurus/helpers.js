import { toDeferResolve, toProductionEntry } from "../../util/input.js";
import { findWebpackDependenciesFromConfig } from "../webpack/index.js";
const FIRST_PARTY_MODULES = new Set([
    'content-docs',
    'content-blog',
    'content-pages',
    'debug',
    'sitemap',
    'svgr',
    'rsdoctor',
    'pwa',
    'client-redirects',
    'ideal-image',
    'google-analytics',
    'google-gtag',
    'google-tag-manager',
    'classic',
    'live-codeblock',
    'search-algolia',
    'mermaid',
]);
export const CORE_CLIENT_API = [
    'BrowserOnly',
    'ComponentCreator',
    'constants',
    'ExecutionEnvironment',
    'Head',
    'Interpolate',
    'isInternalUrl',
    'Link',
    'Noop',
    'renderRoutes',
    'router',
    'Translate',
    'useBaseUrl',
    'useBrokenLinks',
    'useDocusaurusContext',
    'useGlobalData',
    'useIsBrowser',
    'useIsomorphicLayoutEffect',
    'useRouteContext',
];
const resolveModuleName = (name, type) => {
    if (name.includes(`${type}-`))
        return name;
    if (!name.startsWith('@')) {
        const prefix = FIRST_PARTY_MODULES.has(name) ? '@docusaurus/' : 'docusaurus-';
        return `${prefix}${type}-${name}`;
    }
    const [scope, ...rest] = name.split('/');
    const baseName = rest.length ? `-${rest.join('/')}` : '';
    return `${scope}/docusaurus-${type}${baseName}`;
};
const resolveSidebarPath = (config) => {
    const path = config?.sidebarPath ?? config?.docs?.sidebarPath;
    return typeof path === 'string' ? path : undefined;
};
const resolveArrayConfig = ([name, config], type) => {
    if (typeof name !== 'string')
        return [];
    const resolvedName = resolveModuleName(name, type);
    const sidebarPath = type !== 'theme' ? resolveSidebarPath(config) : undefined;
    return [toDeferResolve(resolvedName), ...(sidebarPath ? [toProductionEntry(sidebarPath)] : [])];
};
export const resolveConfigItems = async (items, type, options) => {
    const inputs = new Set();
    for (let item of items) {
        if (typeof item === 'function')
            item = item();
        if (!item)
            continue;
        if (typeof item === 'string') {
            inputs.add(toDeferResolve(resolveModuleName(item, type)));
        }
        else if (Array.isArray(item)) {
            for (const input of resolveArrayConfig(item, type))
                inputs.add(input);
        }
        else if (typeof item.configureWebpack === 'function') {
            const utils = { getStyleLoaders: () => [], getJSLoader: () => null };
            const config = item.configureWebpack({}, false, utils);
            for (const input of await findWebpackDependenciesFromConfig(config, options))
                inputs.add(input);
        }
        else if (typeof item.configurePostCss === 'function') {
        }
    }
    return inputs;
};
