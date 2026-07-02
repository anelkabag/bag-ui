import { readFileSync } from 'node:fs';
import picomatch from 'picomatch';
import { debugLog } from "./debug.js";
import { convertGitignoreToPicomatchIgnorePatterns } from "./parse-and-convert-gitignores.js";
export function parseCodeowners(content) {
    const matchers = content
        .split(/\r?\n/)
        .filter(line => line && !line.startsWith('#'))
        .map(rule => {
        const [path, ...owners] = rule.split(/\s+/);
        const { patterns } = convertGitignoreToPicomatchIgnorePatterns(path);
        return { owners, match: picomatch(patterns) };
    });
    return (filePath) => {
        for (const matcher of [...matchers].reverse()) {
            if (matcher.match(filePath)) {
                return matcher.owners;
            }
        }
        return [];
    };
}
export function createOwnershipEngine(filePath) {
    try {
        const content = readFileSync(filePath, 'utf8');
        return parseCodeowners(content);
    }
    catch (error) {
        debugLog('*', `Failed to load codeowners file from ${filePath}`);
        throw error;
    }
}
