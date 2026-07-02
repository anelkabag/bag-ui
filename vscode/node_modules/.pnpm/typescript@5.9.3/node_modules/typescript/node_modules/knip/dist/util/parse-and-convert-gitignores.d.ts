export declare const convertGitignoreToPicomatchIgnorePatterns: (pattern: string) => {
    negated: boolean;
    patterns: string[];
};
export declare const parseAndConvertGitignorePatterns: (patterns: string, ancestor?: string) => {
    negated: boolean;
    patterns: string[];
}[];
