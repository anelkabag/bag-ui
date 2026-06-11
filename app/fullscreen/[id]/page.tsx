"use client";

import React from "react";
import { useParams } from "next/navigation";
import registryJson from "@/registry.json";
import { categoryMatchesItem, RegistryItem } from "@/lib/block-categories";
import { ComponentPreview } from "@/components/ComponentPreview";

const registry = registryJson as { items: RegistryItem[] };

function itemMatchesBlock(blockId: string, item: RegistryItem) {
  const n = blockId.toLowerCase();
  if (item.name.toLowerCase() === n) return true;
  if (item.name.toLowerCase().startsWith(`${n}-`)) return true;
  return categoryMatchesItem(n, item);
}

export default function FullscreenPreviewPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";

  const item = registry.items.find((item) => itemMatchesBlock(id, item));

  if (!item) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <p className="text-gray-400 text-sm">Component not found.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-white overflow-auto">
      <ComponentPreview item={item} />
    </div>
  );
}
