"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import registryJson from "@/registry.json";
import { RegistryItem } from "@/lib/block-categories";
import { getComponentAccessTier } from "@/lib/access";
import { ComponentPreview } from "@/components/component-preview";
import { Footer } from "@/components/footer";
import Navbar from "@/components/navbar";
import { Check, ChevronDown } from "lucide-react";
import PnpmLogo from "@/public/assets/pnpm.svg";
import YarnLogo from "@/public/assets/yarn.svg";

// ─── Types ────────────────────────────────────────────────────────────────────
type AccessTier = "free" | "pro";
type PkgManager = "pnpm" | "npm" | "yarn" | "bun";

const registry = registryJson as { items: RegistryItem[] };

// ─── Récupération directe des items "ui" (pas de regroupement par catégorie) ──
function getUiComponents(): RegistryItem[] {
  return registry.items.filter((item) => item.type === "registry:ui");
}

export const UI_COMPONENTS = getUiComponents();

// ─── Package manager + install command ────────────────────────────────────────
const PKG_MANAGERS: PkgManager[] = ["pnpm", "npm", "yarn", "bun"];

function getInstallCmd(pkg: PkgManager, name: string) {
  const reg = `@bagui/${name}`;
  switch (pkg) {
    case "pnpm":
      return `pnpm dlx shadcn@latest add ${reg}`;
    case "yarn":
      return `yarn dlx shadcn@latest add ${reg}`;
    case "bun":
      return `bunx --bun shadcn@latest add ${reg}`;
    default:
      return `npx shadcn@latest add ${reg}`;
  }
}

const PKG_ICONS: Record<PkgManager, React.ReactNode> = {
  pnpm: <Image src={PnpmLogo} alt="pnpm" width={14} height={14} />,
  npm: (
      <svg viewBox="0 0 128 128" width={14} height={14}>
        <path
            fill="#cb3837"
            d="M2 38.5h124v43.71H64v7.29H36.44v-7.29H2zm6.89 36.43h13.78V53.07h6.89v21.86h6.89V45.79H8.89zm34.44-29.14v36.42h13.78v-7.28h13.78V45.79zm13.78 7.29H64v14.56h-6.89zm20.67-7.29v29.14h13.78V53.07h6.89v21.86h6.89V53.07h6.89v21.86h6.89V45.79z"
        />
      </svg>
  ),
  yarn: <Image src={YarnLogo} alt="yarn" width={14} height={14} />,
  bun: (
      <svg viewBox="0 0 128 128" width={14} height={14}>
        <path
            fill="#fbf0df"
            d="M116.8 65.08c0 23.467-25.072 42.49-56 42.49s-56-19.023-56-42.49c0-14.55 9.6-27.401 24.352-35.023C43.904 22.435 53.088 14.628 60.8 14.628S75.104 21 92.448 30.058C107.2 37.677 116.8 50.53 116.8 65.08Z"
        />
        <path d="M60.8 111.443c-33.088 0-60-20.798-60-46.363 0-15.429 9.888-29.823 26.448-38.448C55.904 15.629 55.6 10.771 60.8 10.771c5.2 0 8.992 1.852 14.24 4.845 16.56 8.625 30.16 22.464 30.16 49.041 0 25.565-26.912 46.363-60 46.363z" />
      </svg>
  ),
};

// ─── Bouton CLI (pkg manager + copy) ──────────────────────────────────────────
function CliButton({ item }: { item: RegistryItem }) {
  const [pkg, setPkg] = useState<PkgManager>("npm");
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const cmd = getInstallCmd(pkg, item.name);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(cmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard indisponible, on ignore silencieusement
    }
  };

  return (
      <div className="relative flex-shrink-0" onMouseLeave={() => setOpen(false)}>
        <div className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white pl-3 pr-1.5 py-1.5 text-xs font-mono text-gray-500 hover:border-gray-300 transition-colors ">
          <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 hover:text-black transition-colors cursor-pointer"
              aria-label="Copy install command"
          >
            {copied ? (
                <Check size={13} className="text-green-600" />
            ) : (
                <span className="text-gray-400">{">_"}</span>
            )}
            <span className="max-w-[80px] truncate">
            {copied ? "Copied!" : `@bagui/${item.name}`}
          </span>
          </button>

          <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen((o) => !o);
              }}
              className="flex items-center gap-1 pl-1.5 border-l border-gray-200 hover:text-black transition-colors cursor-pointer"
              aria-label="Change package manager"
          >
          <span className="w-3.5 h-3.5 flex items-center justify-center">
            {PKG_ICONS[pkg]}
          </span>
            <ChevronDown size={12} />
          </button>
        </div>

        {open && (
            <div className="absolute right-0 top-full mt-1 z-20 min-w-[110px] rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden">
              {PKG_MANAGERS.map((p) => (
                  <button
                      key={p}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setPkg(p);
                        setOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors ${
                          pkg === p
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
              <span className="w-3.5 h-3.5 flex items-center justify-center">
                {PKG_ICONS[p]}
              </span>
                    {p}
                    {pkg === p && <Check size={11} className="ml-auto" />}
                  </button>
              ))}
            </div>
        )}
      </div>
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
          <CliButton item={item} />
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