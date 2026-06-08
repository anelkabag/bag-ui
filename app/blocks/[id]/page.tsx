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

// ─── Package manager icons (SVG) ───────────────────────────────────────────────

const PKG_ICONS: Record<PkgManager, React.ReactNode> = {
  pnpm: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-orange-500">
        <rect x="3" y="3" width="6" height="6" />
        <rect x="11" y="3" width="6" height="6" />
        <rect x="19" y="3" width="2" height="6" />
        <rect x="3" y="11" width="6" height="6" />
        <rect x="11" y="11" width="6" height="6" />
        <rect x="19" y="11" width="2" height="6" />
        <rect x="3" y="19" width="6" height="2" />
        <rect x="11" y="19" width="6" height="2" />
        <rect x="19" y="19" width="2" height="2" />
      </svg>
  ),
  npm: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-red-600">
        <path d="M1 8h22v10H1z" />
        <path d="M7 14v6h4v-4h2v4h4v-6" fill="white" />
      </svg>
  ),
  yarn: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5m-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11m3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5" />
      </svg>
  ),
  bun: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-gray-900">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5" />
      </svg>
  ),
};

// ─── Variant toolbar header (inline) ──────────────────────────────────────────

function VariantToolbarHeader({
                                variant,
                                variantId,
                                mode,
                                setMode,
                              }: {
  variant: Variant;
  variantId: string;
  mode: ViewMode;
  setMode: (m: ViewMode) => void;
}) {
  const [pkg, setPkg] = useState<PkgManager>("pnpm");
  const [openDropdown, setOpenDropdown] = useState(false);
  const { copied, copy } = useCopy();

  return (
      <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100"
      >
        {/* Left: Title and badge */}
        <div className="flex items-center gap-3 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {variant.label}
          </h3>
          <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide whitespace-nowrap ${
                  variant.pro
                      ? "bg-amber-100 text-amber-700 border border-amber-200"
                      : "bg-green-100 text-green-700 border border-green-200"
              }`}
          >
          {variant.pro ? "Pro" : "Free"}
        </span>
        </div>

        {/* Center: Icons, tabs, and actions */}
        <div className="flex items-center gap-3 flex-1 justify-center flex-wrap">
          {/* Preview icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
            <path d="M12 5H8a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2v-4" />
            <polyline points="14 5 14 3 10 3 10 5" />
          </svg>

          {/* Preview / Code tabs */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-md p-0.5">
            {(["preview", "code"] as ViewMode[]).map((m) => (
                <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`relative px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                        mode === m ? "text-black bg-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  <span className="capitalize">{m}</span>
                </button>
            ))}
          </div>

          {/* Copy prompt button */}
          <button
              onClick={() => copy(`bagui/${variantId}`)}
              className="flex items-center gap-1.5 h-7 px-3 rounded-md text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 transition-all"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            <span>Copy prompt</span>
          </button>

          {/* Block ID */}
          <code className="text-xs font-mono text-gray-500">@blockus/{variantId}</code>
        </div>

        {/* Right: Package manager dropdown */}
        <div className="relative">
          <button
              onClick={() => setOpenDropdown(!openDropdown)}
              className="flex items-center gap-2 h-7 px-2 rounded-md hover:bg-gray-100 transition-all border border-gray-200"
              title="Select package manager"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              {PKG_ICONS[pkg]}
            </div>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-500">
              <polyline points="3 5 6 8 9 5" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {openDropdown && (
              <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-max"
              >
                {PKG_MANAGERS.map((p) => (
                    <button
                        key={p}
                        onClick={() => {
                          setPkg(p);
                          setOpenDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center gap-2 transition-colors ${
                            pkg === p
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                    >
                      <div className="w-4 h-4 flex items-center justify-center">
                        {PKG_ICONS[p]}
                      </div>
                      <span>{p}</span>
                      {pkg === p && <CheckIcon />}
                    </button>
                ))}
              </motion.div>
          )}
        </div>
      </motion.div>
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
        {/* Toolbar header on one line */}
        <VariantToolbarHeader
            variant={variant}
            variantId={variant.id}
            mode={mode}
            setMode={setMode}
        />

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