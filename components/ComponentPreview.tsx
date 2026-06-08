"use client";

import React, { useEffect, useMemo, useState } from "react";

interface ComponentPreviewProps {
    item: {
        name: string;
        files: { path: string; target?: string; type: string }[];
    };
}

const componentLoaders: Record<
    string,
    () => Promise<Record<string, React.ComponentType>>
> = {
    // Ajoute tes composants ici
    "registry/default/blocks/hero/hero1.tsx": () =>
        import("../registry/default/blocks/hero/hero1"),
    "registry/default/blocks/teams/team-section.tsx": () =>
        import("../registry/default/blocks/teams/team-section"),
    "registry/default/ui/fancy-button.tsx": () =>
        import("../registry/default/ui/fancy-button"),
    // Ajoute d'autres composants au fur et à mesure
};

function normalizePath(path: string) {
    return path.replace(/^\.\//, "").replace(/\\/g, "/");
}

function findLoader(filePath?: string, targetPath?: string) {
    const candidates = [filePath, targetPath].filter(Boolean) as string[];

    for (const candidate of candidates) {
        const normalized = normalizePath(candidate);
        const exact = componentLoaders[normalized];
        if (exact) return exact;
    }

    if (!filePath) return undefined;

    const basename = filePath.split("/").pop();
    if (!basename) return undefined;

    const fallbackEntry = Object.entries(componentLoaders).find(([importPath]) =>
        importPath.endsWith(`/${basename}`),
    );

    return fallbackEntry?.[1];
}

const previewCache = new Map<string, React.ComponentType>();

function pascalCase(name: string) {
    return name
        .split(/[-_]/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");
}

function Skeleton() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
                <span className="text-sm text-gray-500">Loading preview…</span>
            </div>
        </div>
    );
}

export function ComponentPreview({ item }: ComponentPreviewProps) {
    const file = item.files?.[0];
    const filePath = file?.path;
    const targetPath = file?.target;
    const exportName = useMemo(() => pascalCase(item.name), [item.name]);
    const loader = useMemo(
        () => findLoader(filePath, targetPath),
        [filePath, targetPath],
    );
    const cacheKey = `${filePath ?? ""}|${exportName}`;
    const cachedComponent = filePath ? previewCache.get(cacheKey) : undefined;

    // ✅ FIX: wrap with () => so React doesn't call the component as a state initializer
    const [PreviewComponent, setPreviewComponent] =
        useState<React.ComponentType | null>(() => cachedComponent ?? null);
    const [loading, setLoading] = useState(() =>
        Boolean(filePath && loader && !cachedComponent),
    );
    const [loadError, setLoadError] = useState(() =>
        Boolean(filePath && !loader && !cachedComponent),
    );

    useEffect(() => {
        if (!filePath) {
            return;
        }

        if (cachedComponent) {
            setLoading(false);
            return;
        }

        if (!loader) {
            setLoadError(true);
            setLoading(false);
            return;
        }

        let active = true;

        loader()
            .then((mod) => {
                if (!active) return;
                const component =
                    (mod as Record<string, React.ComponentType>)[exportName] ??
                    mod.default;
                if (component) {
                    previewCache.set(cacheKey, component as React.ComponentType);
                    // ✅ FIX: wrap with () => so React stores the reference instead of calling it
                    setPreviewComponent(() => component as React.ComponentType);
                } else {
                    setLoadError(true);
                    console.warn(
                        `[ComponentPreview] Export "${exportName}" not found in ${filePath}.`,
                    );
                }
            })
            .catch((err) => {
                if (!active) return;
                setLoadError(true);
                console.error(`[ComponentPreview] Failed to load ${filePath}:`, err);
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [filePath, exportName, loader]);

    if (!filePath) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <span className="text-xs text-black/30">Preview unavailable</span>
            </div>
        );
    }

    if (loading) return <Skeleton />;

    if (!PreviewComponent || loadError) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-center px-6">
                <div className="text-sm font-semibold text-gray-900">
                    Preview failed to load
                </div>
                <div className="text-xs text-gray-500 max-w-sm">
                    The registry preview component could not be loaded for{" "}
                    <strong>{filePath}</strong>. Check the registry path or component
                    export name.
                </div>
            </div>
        );
    }

    return (
        <div
            className="w-full h-full flex items-center justify-center"
            style={{
                minHeight: 320,
                maxHeight: 320,
                padding: 16,
                boxSizing: "border-box",
            }}
        >
            <div
                className="w-full h-full flex items-center justify-center"
                style={{
                    width: "100%",
                    height: "100%",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <PreviewComponent />
                </div>
            </div>
        </div>
    );
}