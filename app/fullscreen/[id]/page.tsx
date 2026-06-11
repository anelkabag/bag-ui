"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import registryJson from "@/registry.json";
import { categoryMatchesItem, RegistryItem } from "@/lib/block-categories";
import { componentLoaders } from "@/lib/registry-loaders";

const registry = registryJson as { items: RegistryItem[] };

function itemMatchesBlock(blockId: string, item: RegistryItem) {
  const n = blockId.toLowerCase();
  if (item.name.toLowerCase() === n) return true;
  if (item.name.toLowerCase().startsWith(`${n}-`)) return true;
  return categoryMatchesItem(n, item);
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

function pascalCase(name: string) {
  return name
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

const previewCache = new Map<string, React.ComponentType>();

export default function FullscreenPreviewPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";

  const item = registry.items.find((item) => itemMatchesBlock(id, item));

  const file = item?.files?.[0];
  const filePath = file?.path;
  const targetPath = file?.target;
  const exportName = useMemo(() => (item ? pascalCase(item.name) : ""), [item]);
  const loader = useMemo(
    () => findLoader(filePath, targetPath),
    [filePath, targetPath],
  );
  const cacheKey = `${filePath ?? ""}|${exportName}`;
  const cachedComponent = filePath ? previewCache.get(cacheKey) : undefined;

  const [Component, setComponent] = useState<React.ComponentType | null>(
    () => cachedComponent ?? null,
  );
  const [loading, setLoading] = useState(() =>
    Boolean(filePath && loader && !cachedComponent),
  );

  useEffect(() => {
    if (!filePath) return;
    if (cachedComponent) {
      setLoading(false);
      return;
    }
    if (!loader) {
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
          setComponent(() => component as React.ComponentType);
        }
      })
      .catch((err) => {
        if (!active) return;
        console.error(`[FullscreenPreview] Failed to load ${filePath}:`, err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [filePath, exportName, loader, cachedComponent]);

  if (!item) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <p className="text-gray-400 text-sm">Component not found.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
          <span className="text-sm text-gray-500">Loading component…</span>
        </div>
      </div>
    );
  }

  if (!Component) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <p className="text-gray-400 text-sm">Failed to load component.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-white overflow-auto">
      <Component />
    </div>
  );
}
