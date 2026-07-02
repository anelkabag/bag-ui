export declare const resolveName: (identifier: string, namespace: "preset" | "plugin") => string;
export declare const api: {
    assertVersion: () => boolean;
    cache: {
        (): undefined;
        forever(): any;
        never(): any;
        using(): any;
        invalidate(): any;
    };
    caller: () => boolean;
    env: (env?: string) => true | "development";
    version: string;
};
