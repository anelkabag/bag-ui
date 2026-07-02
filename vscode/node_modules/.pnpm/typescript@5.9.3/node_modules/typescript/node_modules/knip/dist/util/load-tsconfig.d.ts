import ts from 'typescript';
export declare const loadTSConfig: (tsConfigFilePath: string) => Promise<{
    isFile: boolean;
    compilerOptions: ts.CompilerOptions;
    fileNames: string[];
}>;
