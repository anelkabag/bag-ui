"use client";

import React, { useEffect, useMemo, useState } from "react";
import { COMPONENT_MAP } from "@/lib/component-map";

interface ComponentPreviewProps {
  item: {
    name: string;
    files: { path: string; type: string }[];
  };
}

function pascalCase(name: string) {
  return name
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function Skeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-24 h-10 rounded-xl bg-gray-200 animate-pulse" />
    </div>
  );
}

export function ComponentPreview({ item }: ComponentPreviewProps) {
  const filePath = item.files?.[0]?.path;
  const exportName = useMemo(() => pascalCase(item.name), [item.name]);
  const loader = filePath ? COMPONENT_MAP[filePath] : undefined;
  const [PreviewComponent, setPreviewComponent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(() => Boolean(filePath && loader));
  const [loadError, setLoadError] = useState(() => Boolean(filePath && !loader));

  useEffect(() => {
    if (!filePath || !loader) {
      return;
    }

    let active = true;

    loader()
      .then((mod) => {
        if (!active) return;
        const component = (mod as Record<string, React.ComponentType>)[exportName] ?? mod.default;
        if (component) {
          setPreviewComponent(() => component as React.ComponentType);
        } else {
          setLoadError(true);
          console.warn(`[ComponentPreview] Export "${exportName}" not found in ${filePath}.`);
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
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-xs text-black/30">Preview unavailable</span>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ minHeight: 320, maxHeight: 320, padding: 16, boxSizing: "border-box" }}
    >
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%", overflow: "hidden", position: "relative" }}
      >
        <div style={{ width: "100%", height: "100%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <PreviewComponent />
        </div>
      </div>
    </div>
  );
}
