"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

import registryJson from "@/registry.json";
import { categoryMatchesItem, RegistryItem } from "@/lib/block-categories";
import { MARKETING_BLOCKS, APP_BLOCKS, ECOMMERCE_BLOCKS } from "../page";

// ─── Types ────────────────────────────────────────────────────────────────────

type ViewMode = "preview" | "code";
type PkgManager = "pnpm" | "npm" | "yarn" | "bun";

interface Variant {
  id: string;
  label: string;
  description: string;
  pro: boolean;
}

// ─── Registry helpers ─────────────────────────────────────────────────────────

const registry = registryJson as { items: RegistryItem[] };

function itemMatchesBlock(blockId: string, item: RegistryItem) {
  const n = blockId.toLowerCase();
  if (item.name.toLowerCase() === n) return true;
  if (item.name.toLowerCase().startsWith(`${n}-`)) return true;
  return categoryMatchesItem(n, item);
}

function getVariants(id: string, count: number): Variant[] {
  const matched = registry.items.filter((item) => itemMatchesBlock(id, item));

  if (matched.length > 0) {
    return matched.map((item) => ({
      id: item.name,
      label: item.title || item.name,
      description: item.description || `Ready-to-use ${id} component`,
      pro: false,
    }));
  }

  return Array.from({ length: count }, (_, i) => ({
    id: `${id}-${String(i + 1).padStart(2, "0")}`,
    label: `${id
        .split("-")
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(" ")} ${String(i + 1).padStart(2, "0")}`,
    description: `Variant ${i + 1}`,
    pro: i > 1,
  }));
}

// ─── Install command helper ───────────────────────────────────────────────────

const PKG_MANAGERS: PkgManager[] = ["pnpm", "npm", "yarn", "bun"];

function getInstallCmd(pkg: PkgManager, variantId: string) {
  const registry = `bagui/${variantId}`;
  switch (pkg) {
    case "pnpm":
      return `pnpm dlx shadcn@latest add ${registry}`;
    case "yarn":
      return `yarn dlx shadcn@latest add ${registry}`;
    case "bun":
      return `bunx --bun shadcn@latest add ${registry}`;
    default:
      return `npx shadcn@latest add ${registry}`;
  }
}

// ─── Code snippet ─────────────────────────────────────────────────────────────

function getCodeSnippet(variantId: string) {
  const name = variantId
      .split("-")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join("");
  return `import { ${name} } from "@/components/blocks/${variantId}";

export default function Page() {
  return (
    <main>
      <${name} />
    </main>
  );
}`;
}

// ─── useCopy hook ─────────────────────────────────────────────────────────────

function useCopy(timeout = 1500) {
  const [copied, setCopied] = useState(false);
  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), timeout);
  };
  return { copied, copy };
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const CopyIcon = () => (
    <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
      <rect x="1" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1" />
      <path d="M3 3V2a1 1 0 011-1h6a1 1 0 011 1v7a1 1 0 01-1 1H9" stroke="currentColor" strokeWidth="1" />
    </svg>
);

const CheckIcon = () => (
    <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ExternalLinkIcon = () => (
    <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
      <path d="M5 2H2a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M7.5 1.5H10.5V4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.5 1.5L6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
);

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  return (
      <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="flex items-center justify-between px-6 h-14 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="BagUI Logo" width={20} height={20} priority />
              <span className="text-[15px] font-semibold tracking-tight text-black">
              Bag\Ui
            </span>
            </Link>
            <Link
                href="https://x.com/anelkabag"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-gray-400 hover:text-black transition-colors"
            >
              by Anelka Bag
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link
                href="/login"
                className="h-8 px-4 rounded-full text-sm font-medium text-black border border-gray-200 hover:bg-gray-50 transition-all inline-flex items-center"
            >
              Login
            </Link>
            <Link
                href="/access"
                className="h-8 px-4 rounded-full text-sm font-medium text-white bg-black hover:bg-gray-800 transition-all inline-flex items-center"
            >
              Get access
            </Link>
          </div>
        </div>
      </nav>
  );
}

// ─── Code block ──────────────────────────────────────────────────────────────

function CodeBlock({ code }: { code: string }) {
  const { copied, copy } = useCopy();
  return (
      <div className="relative rounded-xl border border-gray-200 bg-gray-950 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
          <span className="text-xs text-gray-500 font-mono">page.tsx</span>
          <button
              onClick={() => copy(code)}
              aria-label={copied ? "Copied" : "Copy code"}
              className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <pre className="p-5 overflow-x-auto">
        <code className="text-gray-300 font-mono text-[13px] leading-relaxed">{code}</code>
      </pre>
      </div>
  );
}

// ─── Iframe Preview ───────────────────────────────────────────────────────────

function IframePreview({ variantId, blurred }: { variantId: string; blurred?: boolean }) {
  return (
      <div className="relative w-full rounded-xl border border-gray-200 overflow-hidden bg-white" style={{ height: 500 }}>
        <iframe
            src={`/preview/${variantId}`}
            title={`Preview of ${variantId}`}
            className="w-full h-full border-0"
            loading="lazy"
        />
        {blurred && (
            <div className="absolute inset-0 backdrop-blur-sm bg-white/70 flex flex-col items-center justify-center gap-3">
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="2" y="6" width="10" height="7" rx="1.5" stroke="#111827" strokeWidth="1.2" />
                  <path d="M4.5 6V4.5a2.5 2.5 0 015 0V6" stroke="#111827" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                <span className="text-xs font-semibold text-gray-900">Pro component</span>
              </div>
              <Link
                  href="/access"
                  className="h-8 px-5 rounded-full text-xs font-medium text-white bg-black hover:bg-gray-800 transition-all inline-flex items-center"
              >
                Get access →
              </Link>
            </div>
        )}
      </div>
  );
}

// ─── Variant toolbar (CLI + copy) ─────────────────────────────────────────────

function VariantToolbar({ variantId }: { variantId: string }) {
  const [pkg, setPkg] = useState<PkgManager>("pnpm");
  const cmd = getInstallCmd(pkg, variantId);
  const { copied, copy } = useCopy();

  return (
      <div className="flex flex-wrap items-center gap-2 mt-3">
        {/* Package manager tabs */}
        <div className="flex items-center bg-gray-100 rounded-lg p-0.5 text-xs font-medium">
          {PKG_MANAGERS.map((p) => (
              <button
                  key={p}
                  onClick={() => setPkg(p)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                      pkg === p ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {p}
              </button>
          ))}
        </div>

        {/* CLI command */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0 bg-gray-950 rounded-lg px-3 py-1.5">
          <span className="text-gray-500 text-xs font-mono select-none">$</span>
          <code className="text-white text-xs font-mono truncate">{cmd}</code>
          <button
              onClick={() => copy(cmd)}
              aria-label={copied ? "Copied" : "Copy command"}
              className="ml-auto shrink-0 text-gray-500 hover:text-white transition-colors"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
        </div>

        {/* Open in new tab */}
        <Link
            href={`/preview/${variantId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-black transition-all shrink-0"
        >
          <ExternalLinkIcon />
          Open in new tab
        </Link>
      </div>
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
  const code = getCodeSnippet(variant.id);

  return (
      <motion.div
          id={variant.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          className="mb-12 scroll-mt-20"
      >
        {/* Header row */}
        <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
          <div className="flex items-center gap-2">
            <a
                href={`#${variant.id}`}
                className="text-sm font-semibold text-gray-900 hover:underline underline-offset-2"
            >
              {variant.label}
            </a>
            <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${
                    variant.pro
                        ? "bg-amber-100 text-amber-700 border border-amber-200"
                        : "bg-gray-100 text-gray-500"
                }`}
            >
            {variant.pro ? "Pro" : "Free"}
          </span>
          </div>

          {/* Preview / Code toggle */}
          <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5">
            {(["preview", "code"] as ViewMode[]).map((m) => (
                <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`relative px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                        mode === m ? "text-black" : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  {mode === m && (
                      <motion.div
                          layoutId={`tab-${variant.id}`}
                          className="absolute inset-0 bg-white rounded-md shadow-sm"
                          transition={{ type: "spring", bounce: 0.15, duration: 0.28 }}
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
                <IframePreview variantId={variant.id} blurred={variant.pro} />
                <VariantToolbar variantId={variant.id} />
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

  const allBlocks = [...MARKETING_BLOCKS, ...APP_BLOCKS, ...ECOMMERCE_BLOCKS];
  const block = allBlocks.find((b) => b.id === id);

  if (!block) {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center space-y-3">
            <p className="text-gray-400 text-sm">Block not found.</p>
            <Link href="/blocks" className="text-sm font-medium text-black underline underline-offset-2">
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
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-8">
            <Link href="/blocks" className="hover:text-black transition-colors">
              All blocks
            </Link>
            <span>/</span>
            <span className="text-gray-600 capitalize">{block.label}</span>
          </div>

          {/* Page header */}
          <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-12"
          >
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <h1 className="text-3xl font-bold tracking-tight text-black">
                    {block.label}
                  </h1>
                  {block.new && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-black text-white">
                    New
                  </span>
                  )}
                </div>
                <p className="text-gray-500 text-sm max-w-xl leading-relaxed">
                  {block.description ||
                      `${block.label.toLowerCase()} sections. Ready to paste into your project.`}
                </p>
                <div className="flex items-center gap-3 mt-4 text-sm">
                <span className="text-gray-600">
                  <strong className="text-black">{freeCount}</strong> free
                </span>
                  {proCount > 0 && (
                      <>
                        <span className="text-gray-300">·</span>
                        <span className="text-gray-600">
                      <strong className="text-amber-600">{proCount}</strong> pro
                    </span>
                      </>
                  )}
                  <span className="text-gray-300">·</span>
                  <span className="text-gray-400 text-xs">React · TypeScript · Tailwind</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="border-t border-gray-100 mb-10" />

          {/* Variant list */}
          {variants.map((variant, i) => (
              <VariantCard key={variant.id} blockId={id} variant={variant} index={i} />
          ))}
        </div>
      </div>
  );
}