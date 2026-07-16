"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { componentLoaders } from "@/lib/registry-loaders";

interface ComponentPreviewProps {
  item: {
    name: string;
    files: { path: string; target?: string; type: string }[];
  };
  /** Hauteur de la zone de preview en px. Défaut = 500 (comportement existant, page de détail). */
  height?: number;
  /** Classes additionnelles sur le conteneur (ex: pour retirer la bordure dans une carte). */
  className?: string;
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
        <div className="w-8 h-8 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
      </div>
    </div>
  );
}

/**
 * Converts `position: fixed` elements inside the container to
 * `position: absolute` so they stay within the preview div instead
 * of escaping to the viewport.
 */
function useContainFixed(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const fix = () => {
      container.querySelectorAll<HTMLElement>("*").forEach((el) => {
        const computed = window.getComputedStyle(el);
        if (computed.position === "fixed") {
          el.style.position = "absolute";
        }
      });
    };

    fix();
    const observer = new MutationObserver(fix);
    observer.observe(container, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [ref]);
}

export function ComponentPreview({
  item,
  height = 500,
  className = "",
}: ComponentPreviewProps) {
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

  const containerRef = useRef<HTMLDivElement>(null);
  useContainFixed(containerRef);

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
  }, [filePath, exportName, loader]);

  if (!filePath) {
    return (
      <div
        className={`w-full flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 ${className}`}
        style={{ height }}
      >
        <span className="text-xs text-black/30">Preview unavailable</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className={`w-full rounded-xl border border-gray-200 bg-gray-50 ${className}`}
        style={{ height }}
      >
        <Skeleton />
      </div>
    );
  }

  if (!PreviewComponent || loadError) {
    return (
      <div
        className={`w-full flex flex-col items-center justify-center gap-2 text-center px-6 rounded-xl border border-gray-200 bg-zinc-50 ${className}`}
        style={{ height }}
      >
        <div className="text-xs font-semibold text-gray-900">
          Preview failed to load
        </div>
        <div className="text-[11px] text-gray-500 max-w-sm">
          Could not load <strong>{filePath}</strong>.
        </div>
      </div>
    );
  }

  return (
    /*
     * `isolation: isolate` + `overflow: hidden/auto` + `position: relative`
     * create a new stacking context that traps `position: fixed` children,
     * so the component renders as if in its own contained "web window".
     */
    <div
      ref={containerRef}
      className={`w-full rounded-xl border border-gray-200 bg-zinc-50 overflow-auto flex items-center justify-center ${className}`}
      style={{
        height,
        position: "relative",
        isolation: "isolate",
      }}
    >
      <PreviewComponent />
    </div>
  );
}
