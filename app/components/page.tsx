"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import registryJson from "@/registry.json";
import { RegistryItem } from "@/lib/block-categories";
import { getComponentAccessTier } from "@/lib/access";
import { ComponentPreview } from "@/components/component-preview";
import { Footer } from "@/components/footer";
import Navbar from "@/components/navbar";
import { Check, Copy } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type AccessTier = "free" | "pro";

const registry = registryJson as { items: RegistryItem[] };

// ─── Récupération directe des items "ui" (pas de regroupement par catégorie) ──
function getUiComponents(): RegistryItem[] {
  return registry.items.filter((item) => item.type === "registry:ui");
}

export const UI_COMPONENTS = getUiComponents();

// ─── Bouton copier (icône) ────────────────────────────────────────────────────
function CopyButton({ item }: { item: RegistryItem }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(`npx shadcn@latest add ${item.name}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard indisponible, on ignore silencieusement
    }
  };

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy install command"
      className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-black hover:border-gray-300 transition-colors flex-shrink-0"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

// ─── Badge d'accès (free / pro) ───────────────────────────────────────────────
function AccessBadge({ tier }: { tier: AccessTier }) {
  if (tier === "free") return null;
  return (
    <span className="absolute top-2 right-2 z-10 text-[10px] font-medium px-2 py-0.5 rounded-full bg-black text-white">
      Pro
    </span>
  );
}

// ─── Component Card ───────────────────────────────────────────────────────────
function ComponentCard({ item }: { item: RegistryItem }) {
  const tier = getComponentAccessTier(item);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-3 sm:p-4 transition-shadow hover:shadow-md">
      <div className="relative rounded-xl overflow-hidden mb-3">
        <AccessBadge tier={tier} />
        {/* Rendu "fenêtre web" : le composant réel est chargé et confiné dans ce cadre */}
        <ComponentPreview item={item} height={190} className="border-0" />
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {item.title}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {item.description || "UI Component"}
          </p>
        </div>
        <CopyButton item={item} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function ComponentsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 pt-6 sm:pt-10 pb-16 sm:pb-20 border-x border-gray-200">
        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6 sm:mb-10">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-600">Components</span>
        </div>

        {/* ── Hero ── */}
        <div className="mb-6 sm:mb-10">
          <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-black mb-2 sm:mb-3 leading-tight">
            Bag/UI Components —{" "}
            <span className="text-gray-400">
              {UI_COMPONENTS.length}+ Free &amp; Pro
            </span>
          </h1>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-2xl">
            Browse and install standalone UI primitives (buttons, inputs,
            badges…) built with shadcn/ui and Tailwind CSS. Copy &amp; paste or
            install directly with the Shadcn CLI.
          </p>
        </div>

        {/* ── Grille ── */}
        {UI_COMPONENTS.length === 0 ? (
          <p className="text-sm text-gray-400 text-center">
            No components found.
          </p>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-5">
            {UI_COMPONENTS.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <ComponentCard item={item} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
