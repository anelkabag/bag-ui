"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

// ─── Re-use the shared SVG preview ───────────────────────────────────────────
// (In your project, import from "../page" or a shared lib)
import registryJson from "@/registry.json";
import { categoryMatchesItem, RegistryItem } from "@/lib/block-categories";
import {
  BlockPreview,
  MARKETING_BLOCKS,
  APP_BLOCKS,
  ECOMMERCE_BLOCKS,
} from "../page";

// ─── Types ───────────────────────────────────────────────────────────────────
type ViewMode = "preview" | "code";

interface Variant {
  id: string;
  label: string;
  description: string;
  pro: boolean;
}

const registry = registryJson as { items: RegistryItem[] };

function itemMatchesBlock(blockId: string, item: RegistryItem) {
  const normalized = blockId.toLowerCase();
  if (item.name.toLowerCase() === normalized) return true;
  if (item.name.toLowerCase().startsWith(`${normalized}-`)) return true;
  return categoryMatchesItem(normalized, item);
}

function getVariants(id: string, count: number): Variant[] {
  const matchingItems = registry.items.filter((item) =>
    itemMatchesBlock(id, item),
  );

  if (matchingItems.length > 0) {
    return matchingItems.map((item) => ({
      id: item.name,
      label: item.title || item.name,
      description: item.description || `Ready-to-use ${id} component`,
      pro: false,
    }));
  }

  return Array.from({ length: count }, (_, i) => ({
    id: `${id}-0${i + 1}`,
    label: `${id
      .split("-")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" ")} ${String(i + 1).padStart(2, "0")}`,
    description: `Variant ${i + 1}`,
    pro: i > 1,
  }));
}

// Dummy code snippet
function getCodeSnippet(blockId: string, variantId: string) {
  const name = variantId
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");
  return `import { ${name} } from "@/components/blocks/${blockId}/${variantId}";

export default function Page() {
  return (
    <main>
      <${name} />
    </main>
  );
}`;
}

// ─── Large preview for a variant ─────────────────────────────────────────────
function VariantPreview({ blockId }: { blockId: string }) {
  return (
    <div
      className="w-full bg-gray-50 rounded-xl border border-gray-200 overflow-hidden"
      style={{ minHeight: 320 }}
    >
      {/* Browser chrome bar */}
      <div className="flex items-center gap-1.5 px-4 py-3 bg-white border-b border-gray-200">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        <div className="mx-4 flex-1 bg-gray-100 rounded-md h-5 max-w-sm flex items-center px-3">
          <span className="text-[10px] text-gray-400 truncate">
            bagui.com/blocks/{blockId}
          </span>
        </div>
      </div>
      {/* SVG preview — large, centered */}
      <div
        className="flex items-center justify-center p-8"
        style={{ minHeight: 280 }}
      >
        <div className="w-full max-w-2xl">
          <BlockPreview id={blockId} />
        </div>
      </div>
    </div>
  );
}

// ─── Code block ──────────────────────────────────────────────────────────────
function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="relative rounded-xl border border-gray-200 bg-gray-950 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800">
        <span className="text-xs text-gray-500 font-mono">page.tsx</span>
        <button
          onClick={copy}
          aria-label={copied ? "Copied code" : "Copy code"}
          className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 6l3 3 5-5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect
                  x="1"
                  y="3"
                  width="8"
                  height="8"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1"
                />
                <path
                  d="M3 3V2a1 1 0 011-1h6a1 1 0 011 1v7a1 1 0 01-1 1H9"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-5 overflow-x-auto text-sm leading-relaxed">
        <code className="text-gray-300 font-mono text-[13px]">{code}</code>
      </pre>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
      <div className="flex items-center justify-between px-8 h-14 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="BagUI Logo"
              width={20}
              height={20}
              className="shrink-0"
              priority
            />
            <span className="text-[15px] font-semibold tracking-tight text-black">
              Bag\Ui
            </span>
          </Link>
          <Link
            href="https://x.com/anelkabag"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] text-gray-400 hover:text-black transition-colors"
          >
            by Anelka Bag
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="h-9 px-4 rounded-full text-sm font-medium text-black border border-gray-300 hover:bg-gray-50 transition-all inline-flex items-center"
          >
            Login
          </Link>
          <Link
            href="/access"
            className="h-9 px-4 rounded-full text-sm font-medium text-white bg-black hover:bg-gray-800 transition-all inline-flex items-center"
          >
            Get access
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ─── Individual variant card ──────────────────────────────────────────────────
function VariantCard({
  blockId,
  variant,
  index,
}: {
  blockId: string;
  variant: Variant;
  index: number;
}) {
  const [mode, setMode] = useState<ViewMode>("preview");
  const code = getCodeSnippet(blockId, variant.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="mb-10"
    >
      {/* Card header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-gray-900">
              {variant.label}
            </h3>
            {variant.pro && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-400 text-amber-900">
                Pro
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">{variant.description}</p>
        </div>
        {/* Preview / Code toggle */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 shrink-0 ml-4">
          {(["preview", "code"] as ViewMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`relative px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                mode === m ? "text-black" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {mode === m && (
                <motion.div
                  layoutId={`tab-${variant.id}`}
                  className="absolute inset-0 bg-white rounded-md shadow-sm"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.3 }}
                />
              )}
              <span className="relative z-10 capitalize">{m}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {mode === "preview" ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {variant.pro ? (
              <div className="relative">
                <VariantPreview blockId={blockId} />
                {/* Pro blur overlay */}
                <div className="absolute inset-0 backdrop-blur-[3px] bg-white/60 rounded-xl flex flex-col items-center justify-center gap-3">
                  <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect
                        x="2"
                        y="6"
                        width="10"
                        height="7"
                        rx="1.5"
                        stroke="#111827"
                        strokeWidth="1.2"
                      />
                      <path
                        d="M4.5 6V4.5a2.5 2.5 0 015 0V6"
                        stroke="#111827"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="text-xs font-semibold text-gray-900">
                      Pro component
                    </span>
                  </div>
                  <Link
                    href="/access"
                    className="h-8 px-5 rounded-full text-xs font-medium text-white bg-black hover:bg-gray-800 transition-all inline-flex items-center"
                  >
                    Get access
                  </Link>
                </div>
              </div>
            ) : (
              <VariantPreview blockId={blockId} />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="code"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <CodeBlock code={code} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function BlockDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";

  // Find block metadata
  const allBlocks = [...MARKETING_BLOCKS, ...APP_BLOCKS, ...ECOMMERCE_BLOCKS];
  const block = allBlocks.find((b) => b.id === id);

  if (!block) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Block not found</p>
          <Link
            href="/blocks"
            className="text-sm font-medium text-black underline"
          >
            ← Back to blocks
          </Link>
        </div>
      </div>
    );
  }

  const variants = getVariants(id, block.count);
  const freeCount = variants.filter((v) => !v.pro).length;
  const proCount = variants.filter((v) => v.pro).length;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 pt-10 pb-24">
        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/blocks" className="hover:text-black transition-colors">
            Blocks
          </Link>
          <span>/</span>
          <span className="text-gray-600 capitalize">{block.label}</span>
        </div>

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-12"
        >
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <h1 className="text-3xl font-bold tracking-tight text-black">
                  {block.label} Blocks
                </h1>
                {block.new && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-black text-white">
                    New
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-base max-w-xl">
                {variants.length} ready-to-use {block.label.toLowerCase()}{" "}
                components built with shadcn/ui and Tailwind CSS. Copy &amp;
                paste into your project.
              </p>
              <div className="flex items-center gap-4 mt-4 text-sm">
                <span className="text-gray-600">
                  <strong className="text-black">{freeCount}</strong> Free
                </span>
                {proCount > 0 && (
                  <span className="text-gray-600">
                    <strong className="text-amber-600">{proCount}</strong> Pro
                  </span>
                )}
                <span className="text-gray-400">·</span>
                <span className="text-gray-500">
                  React · TypeScript · Tailwind
                </span>
              </div>
            </div>
            {/* Install command */}
            <div className="shrink-0">
              <p className="text-xs text-gray-500 mb-1.5">
                Install via shadcn CLI
              </p>
              <div className="flex items-center gap-2 bg-gray-950 rounded-lg px-4 py-2.5">
                <span className="text-gray-400 text-xs font-mono select-none">
                  $
                </span>
                <code className="text-white text-xs font-mono">
                  npx shadcn add bagui/{id}
                </code>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(`npx shadcn add bagui/${id}`)
                  }
                  aria-label="Copy install command"
                  className="ml-2 text-gray-500 hover:text-white transition-colors"
                >
                  <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                    <rect
                      x="1"
                      y="3"
                      width="8"
                      height="8"
                      rx="1.5"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                    <path
                      d="M3 3V2a1 1 0 011-1h6a1 1 0 011 1v7a1 1 0 01-1 1H9"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Divider ── */}
        <div className="border-t border-gray-100 mb-10" />

        {/* ── Variant list ── */}
        {variants.map((variant, i) => (
          <VariantCard
            key={variant.id}
            blockId={id}
            variant={variant}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}
