"use client";

import React, { useEffect, useMemo, useState } from "react";
import { componentLoaders } from "@/lib/registry-loaders";

interface ComponentPreviewProps {
  item: {
    name: string;
    files: { path: string; target?: string; type: string }[];
  };
}

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

  const [PreviewComponent, setPreviewComponent] =
    useState<React.ComponentType | null>(() => cachedComponent ?? null);
  const [loading, setLoading] = useState(() =>
    Boolean(filePath && loader && !cachedComponent),
  );
  const [loadError, setLoadError] = useState(() =>
    Boolean(filePath && !loader && !cachedComponent),
  );

  useEffect(() => {
    if (!filePath) return;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filePath, exportName, loader, cacheKey]);

  if (!filePath) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center rounded-xl border border-border bg-card">
        <span className="text-xs text-muted-foreground/80">
          Preview unavailable
        </span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-[500px] w-full rounded-xl border border-border bg-card">
        <Skeleton />
      </div>
    );
  }

  if (!PreviewComponent || loadError) {
    return (
      <div className="flex h-[500px] w-full flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card px-6 text-center">
        <div className="text-sm font-semibold text-foreground">
          Preview failed to load
        </div>
        <div className="max-w-sm text-xs text-muted-foreground">
          Could not load <strong>{filePath}</strong>. Check the registry path or
          export name.
        </div>
      </div>
    );
  }

  return (
    /*
     * `transform: translateZ(0)` makes this div the containing block of
     * every `position: fixed` descendant (navbars, drawers…), so they stay
     * inside the preview box. Pure CSS: no MutationObserver, no per-node
     * getComputedStyle scan.
     */
    <div
      className="w-full overflow-auto rounded-xl border border-border bg-card"
      style={{
        minHeight: 500,
        position: "relative",
        isolation: "isolate",
        transform: "translateZ(0)",
      }}
    >
      <PreviewComponent />
    </div>
  );
}