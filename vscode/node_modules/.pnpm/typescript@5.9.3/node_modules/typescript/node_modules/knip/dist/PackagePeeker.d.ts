export declare class PackagePeeker {
    private lines;
    private sections;
    private ready;
    private manifestStr;
    constructor(manifestStr: string);
    private init;
    getLocation(type: 'dependencies' | 'devDependencies' | 'optionalPeerDependencies', packageName: string): {
        line: number;
        col: number;
        pos: number;
    } | undefined;
}
