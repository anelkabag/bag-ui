"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import registryJson from "@/registry.json";

interface RegistryItem {
  name: string;
  type: string;
  title: string;
  description: string;
  dependencies?: string[];
  files: { path: string; type: string; target?: string }[];
}

interface RegistryFile {
  items: RegistryItem[];
}

const registryData = registryJson as RegistryFile;

function getBlockCategory(item: RegistryItem) {
  const targetPath = item.files?.find((file) => file.target)?.target;
  const filePath = targetPath ?? item.files?.[0]?.path;

  if (!filePath) {
    return item.type?.split(":")[1] ?? "section";
  }

  const normalized = filePath
    .replace(/^\.\//, "")
    .replace(/^registry\/default\//, "")
    .replace(/^components\//, "")
    .replace(/\.tsx?$/i, "")
    .replace(/\.jsx?$/i, "");

  const segments = normalized.split("/").filter(Boolean);
  if (segments.length === 0) {
    return item.type?.split(":")[1] ?? "section";
  }

  const lastSegment = segments[segments.length - 1];
  if (lastSegment.toLowerCase() === "index" && segments.length > 1) {
    return segments[segments.length - 2];
  }

  return lastSegment;
}

function formatCount(count: number) {
  return `${count} composant${count > 1 ? "s" : ""}`;
}

function DepBadge({ dep }: { dep: string }) {
  return (
    <span
      className="text-[10px] font-medium px-2 py-0.5 rounded-md"
      style={{ background: "#f0f0f0", color: "#888", letterSpacing: "0.03em" }}
    >
      {dep}
    </span>
  );
}

function ComponentCard({ item, index }: { item: RegistryItem; index: number }) {
  const componentCount = item.files?.length ?? 0;
  const category = getBlockCategory(item);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="flex flex-col rounded-3xl border border-[#e9e9e9] bg-white shadow-sm overflow-hidden"
    >
      <div className="px-6 py-5 bg-slate-50 border-b border-slate-100">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-2">
              Section
            </p>
            <h2 className="text-xl font-bold text-slate-950 tracking-[-0.03em]">
              {item.title}
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-[0.16em]">
            {item.type?.split(":")[1] === "block" ? "Block" : "UI"}
          </span>
        </div>
      </div>

      <div className="px-6 py-5 flex-1">
        <p className="text-sm text-slate-600 leading-relaxed mb-5">
          {item.description}
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-100 p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-2">
              Catégorie
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {category || "Autre"}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-100 p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-2">
              Composants utilisés
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {formatCount(componentCount)}
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          {item.files?.map((file) => (
            <div
              key={file.path}
              className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-600"
            >
              {file.path.replace(/^registry\/default\//, "")}
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {item.dependencies?.map((dep) => (
            <DepBadge key={dep} dep={dep} />
          ))}
        </div>
        <Link
          href={`/blocks/${item.name}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
        >
          Voir le bloc <ArrowUpRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
}

export default function BlocksCatalog() {
  const registryItems = registryData.items ?? [];

  return (
    <section className="min-h-screen bg-white px-6 md:px-12 lg:px-16 py-16">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-12">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.12em] text-slate-500 uppercase mb-3">
            Catalogue de sections
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold text-slate-950 mb-4"
            style={{ letterSpacing: "-0.03em", lineHeight: 1.05 }}
          >
            Les blocs de page modernes
          </h1>
          <p className="text-slate-600 text-sm md:text-base max-w-xl leading-relaxed">
            Ici, chaque bloc représente une section de site web. On affiche
            combien de composants sont nécessaires pour le construire selon le
            registre.
          </p>
        </div>

        <div className="hidden md:block">
          <Link
            href="/blocks"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            Voir tous les blocs <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      {registryItems.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-400 text-sm">
            Aucun bloc trouvé dans le registre.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {registryItems.map((item, index) => (
            <ComponentCard key={item.name} item={item} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}
