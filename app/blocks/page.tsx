"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import registryJson from "@/registry.json";
import {
  categoryMatchesItem,
  countRegistryItemsForCategory,
  RegistryItem,
} from "@/lib/block-categories";
import { Footer } from "@/components/footer";
import Navbar from "@/components/navbar";
import { getComponentAccessTier } from "@/lib/access";
import BlockPreview from "@/components/BlockPreview";

// ─── Types ────────────────────────────────────────────────────────────────────
type FilterType = "all" | "marketing" | "app" | "ecommerce";

type AccessTier = "free" | "pro";

type BlockItem = {
  id: string;
  label: string;
  count: number;
  pro: boolean;
  access?: AccessTier;
  new: boolean;
  description?: string;
};

const registry = registryJson as { items: RegistryItem[] };

function getBlockCount(blockId: string) {
  return countRegistryItemsForCategory(blockId, registry.items);
}

function getBlockAccess(blockId: string): AccessTier {
  return registry.items.some(
    (item) =>
      categoryMatchesItem(blockId, item) &&
      getComponentAccessTier(item) === "pro",
  )
    ? "pro"
    : "free";
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Blocks", href: "/blocks" },
  { label: "Templates", href: "/templates" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
] as const;

// ─── Block catalog data ───────────────────────────────────────────────────────
const MARKETING_BLOCKS_RAW: BlockItem[] = [
  { id: "hero", label: "Hero", count: 12, pro: true, new: true },
  { id: "feature", label: "Feature", count: 8, pro: false, new: false },
  { id: "pricing", label: "Pricing", count: 6, pro: true, new: true },
  { id: "testimonial", label: "Testimonial", count: 5, pro: false, new: false },
  { id: "cta", label: "CTA", count: 7, pro: false, new: false },
  { id: "faq", label: "FAQ", count: 4, pro: false, new: false },
  { id: "navbar", label: "Navbar", count: 3, pro: true, new: false },
  { id: "footer", label: "Footer", count: 5, pro: false, new: false },
  { id: "blog", label: "Blog", count: 4, pro: true, new: false },
  { id: "team", label: "Team", count: 3, pro: false, new: false },
  { id: "stats", label: "Stats", count: 4, pro: false, new: false },
  { id: "contact", label: "Contact", count: 3, pro: false, new: true },
  { id: "gallery", label: "Gallery", count: 5, pro: true, new: false },
  { id: "logos", label: "Logos", count: 4, pro: false, new: false },
  { id: "banner", label: "Banner", count: 3, pro: false, new: false },
  { id: "signup", label: "SignUp", count: 4, pro: true, new: false },
];

export const MARKETING_BLOCKS = MARKETING_BLOCKS_RAW.map((block) => ({
  ...block,
  count: getBlockCount(block.id),
  access: getBlockAccess(block.id),
}));

const APP_BLOCKS_RAW: BlockItem[] = [
  { id: "dashboard", label: "Dashboard", count: 6, pro: true, new: false },
  { id: "sidebar", label: "Sidebar", count: 5, pro: false, new: false },
  { id: "data-table", label: "Data Table", count: 4, pro: true, new: false },
  { id: "chart-card", label: "Chart Card", count: 6, pro: true, new: true },
  { id: "settings", label: "Settings", count: 3, pro: false, new: false },
  {
    id: "user-profile",
    label: "User Profile",
    count: 4,
    pro: false,
    new: false,
  },
  { id: "onboarding", label: "Onboarding", count: 2, pro: true, new: false },
  { id: "todo-list", label: "Todo List", count: 3, pro: false, new: false },
];

export const APP_BLOCKS = APP_BLOCKS_RAW.map((block) => ({
  ...block,
  count: getBlockCount(block.id),
  access: getBlockAccess(block.id),
}));

const ECOMMERCE_BLOCKS_RAW: BlockItem[] = [
  {
    id: "product-list",
    label: "Product List",
    count: 5,
    pro: true,
    new: false,
  },
  {
    id: "product-detail",
    label: "Product Detail",
    count: 4,
    pro: true,
    new: false,
  },
  {
    id: "shopping-cart",
    label: "Shopping Cart",
    count: 4,
    pro: false,
    new: false,
  },
  { id: "checkout", label: "Checkout", count: 3, pro: true, new: false },
  { id: "reviews", label: "Reviews", count: 3, pro: false, new: true },
  {
    id: "product-card",
    label: "Product Card",
    count: 5,
    pro: false,
    new: false,
  },
];

export const ECOMMERCE_BLOCKS = ECOMMERCE_BLOCKS_RAW.map((block) => ({
  ...block,
  count: getBlockCount(block.id),
  access: getBlockAccess(block.id),
}));

// ─── Block Card ───────────────────────────────────────────────────────────────
function BlockCard({
  id,
  label,
  count,
  new: isNew,
}: {
  id: string;
  label: string;
  count: number;
  new: boolean;
}) {
  return (
    <Link href={`/blocks/${id}`} className="group block">
      {/* Preview thumbnail */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-muted aspect-[16/9] mb-3 transition-all duration-200 group-hover:border-muted-foreground/60 group-hover:shadow-md">
        {/* SVG preview — fills the full container, scales with it */}
        <div className="absolute inset-0">
          <BlockPreview blockType={id} />
        </div>
        {/* overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.03] transition-colors duration-200" />
      </div>
      {/* Label + count */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground transition-colors group-hover:text-foreground">
          {label}
        </span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {count} block{count > 1 ? "s" : ""}
        </span>
      </div>
    </Link>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionTitle({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="text-xl font-semibold text-foreground mb-6 mt-14 scroll-mt-20 flex items-center gap-2 group"
    >
      <a
        href={`#${id}`}
        className="opacity-0 group-hover:opacity-30 transition-opacity text-foreground text-base"
      >
        #
      </a>
      {children}
    </h2>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function BlocksPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const totalMarketing = MARKETING_BLOCKS.reduce((s, b) => s + b.count, 0);
  const totalApp = APP_BLOCKS.reduce((s, b) => s + b.count, 0);
  const totalEcommerce = ECOMMERCE_BLOCKS.reduce((s, b) => s + b.count, 0);
  const totalAll = totalMarketing + totalApp + totalEcommerce;

  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: "all", label: "All", count: totalAll },
    { key: "marketing", label: "Marketing", count: totalMarketing },
    { key: "app", label: "App", count: totalApp },
    { key: "ecommerce", label: "Ecommerce", count: totalEcommerce },
  ];

  const showMarketing = activeFilter === "all" || activeFilter === "marketing";
  const showApp = activeFilter === "all" || activeFilter === "app";
  const showEcommerce = activeFilter === "all" || activeFilter === "ecommerce";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 pt-6 sm:pt-10 pb-16 sm:pb-20 border-x border-border">
        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6 sm:mb-10">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">Blocks</span>
        </div>

        {/* ── Hero ── */}
        <div className="mb-6 sm:mb-10">
          <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2 sm:mb-3 leading-tight ">
            Bag/UI Blocks —{" "}
            <span className="text-muted-foreground">
              {totalAll}+ Free &amp; Pro
            </span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-2xl">
            Browse and install production-ready React sections built with
            shadcn/ui and Tailwind CSS. Copy &amp; paste or install directly
            with the Shadcn CLI.
          </p>
        </div>

        {/* ── Filter tabs ── */}
        <div className="flex items-center gap-0 mb-2 border-b border-border pb-0 overflow-x-auto scrollbar-none">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`relative flex items-center gap-1 px-2.5 xs:px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap flex-shrink-0 ${
                activeFilter === f.key
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground/80"
              }`}
            >
              {f.label}
              <span
                className={`text-[10px] sm:text-xs tabular-nums ${
                  activeFilter === f.key
                    ? "text-muted-foreground"
                    : "text-muted-foreground/60"
                }`}
              >
                {f.count}
              </span>
              {activeFilter === f.key && (
                <motion.div
                  layoutId="filter-underline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* ── Anchor shortcuts ── */}
        <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1 py-3 sm:py-4 text-xs sm:text-sm text-muted-foreground">
          {showMarketing && (
            <a
              href="#marketing"
              className="hover:text-foreground transition-colors"
            >
              Marketing
            </a>
          )}
          {showMarketing && (showApp || showEcommerce) && <span>/</span>}
          {showApp && (
            <a href="#app" className="hover:text-foreground transition-colors">
              App
            </a>
          )}
          {showApp && showEcommerce && <span>/</span>}
          {showEcommerce && (
            <a
              href="#ecommerce"
              className="hover:text-foreground transition-colors"
            >
              Ecommerce
            </a>
          )}
        </div>

        {/* ── Sections (Marketing / App / Ecommerce) ── */}
        <AnimatePresence mode="wait">
          {showMarketing && (
            <motion.section
              id="marketing"
              key="marketing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <SectionTitle id="marketing">Marketing Blocks</SectionTitle>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                {MARKETING_BLOCKS.map((b, i) => (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <BlockCard {...b} />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {showApp && (
            <motion.section
              id="app"
              key="app"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <SectionTitle id="app">App Blocks</SectionTitle>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                {APP_BLOCKS.map((b, i) => (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <BlockCard {...b} />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {showEcommerce && (
            <motion.section
              id="ecommerce"
              key="ecommerce"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <SectionTitle id="ecommerce">Ecommerce Blocks</SectionTitle>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                {ECOMMERCE_BLOCKS.map((b, i) => (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <BlockCard {...b} />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
}
