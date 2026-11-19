"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import registryJson from "@/registry.json";
import {
  categoryMatchesItem,
  countRegistryItemsForCategory,
  RegistryItem,
} from "@/lib/block-categories";
import { getComponentAccessTier } from "@/lib/access";
import BlockPreview from "@/components/BlockPreview";
import AppShell from "@/components/shell/AppShell";
import PageHero from "@/components/shell/PageHero";

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

const BLOCK_CATEGORY_IDS = [
  ...MARKETING_BLOCKS_RAW,
  ...APP_BLOCKS_RAW,
  ...ECOMMERCE_BLOCKS_RAW,
].map((block) => block.id);

const availableComponents = registry.items.filter((item) =>
  BLOCK_CATEGORY_IDS.some((id) => categoryMatchesItem(id, item)),
);

const totalAvailable = availableComponents.length;
const totalPro = availableComponents.filter(
  (item) => getComponentAccessTier(item) === "pro",
).length;
const totalFree = totalAvailable - totalPro;

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
    <Link
      href={`/blocks/${id}`}
      className="group block rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="rounded-3xl border border-border bg-card p-3 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-muted-foreground/40 group-hover:shadow-lg">
        <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-background">
          <div className="absolute inset-0">
            <BlockPreview blockType={id} />
          </div>
          {isNew && (
            <span className="absolute left-3 top-3 rounded-full border border-border bg-background/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground backdrop-blur">
              New
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 px-1 pb-1">
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-semibold text-foreground">
              {label}
            </h3>
            <p className="mt-1 text-xs tabular-nums text-muted-foreground">
              {count} {count === 1 ? "block" : "blocks"}
            </p>
          </div>
          <ArrowUpRight
            size={16}
            className="shrink-0 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionTitle({
  id,
  count,
  children,
}: {
  id: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 mt-6 flex scroll-mt-8 items-center justify-between gap-4">
      <h2
        id={id}
        className="scroll-mt-8 text-xl font-semibold tracking-tight text-foreground"
      >
        {children}
      </h2>
      <span className="rounded-full border border-border px-3 py-1 text-xs tabular-nums text-muted-foreground">
        {count} {count === 1 ? "component" : "components"}
      </span>
    </div>
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
    <AppShell>
      <div className="min-h-full bg-background">
        <div className="mx-auto max-w-[1440px] pb-20">
          <PageHero
            firstLine="Build faster with"
            secondLine="ready-to-use"
            emphasis="blocks."
            className="pb-6"
          />

          <div className="mx-5 flex flex-col gap-4 py-0 sm:flex-row sm:items-center sm:justify-between md:mx-10">
            <div
              role="group"
              className="flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-full border border-border bg-muted/40 p-1"
              aria-label="Filter blocks by category"
            >
              {filters.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setActiveFilter(f.key)}
                  aria-pressed={activeFilter === f.key}
                  className={`relative isolate flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    activeFilter === f.key
                      ? "text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {activeFilter === f.key && (
                    <motion.span
                      layoutId="blocks-filter-indicator"
                      className="absolute inset-0 z-0 rounded-full bg-foreground"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 34,
                        mass: 0.7,
                      }}
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10">{f.label}</span>
                  <span
                    className={`relative z-10 text-xs tabular-nums ${
                      activeFilter === f.key
                        ? "text-background/70"
                        : "text-muted-foreground/70"
                    }`}
                  >{f.count}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between gap-5 sm:justify-end sm:gap-7">
              <div>
                <p className="text-lg font-semibold leading-none tracking-tight text-foreground">
                  {totalAvailable}
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Components
                </p>
              </div>
              <div>
                <p className="text-lg font-semibold leading-none tracking-tight text-foreground">
                  {totalFree}
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground">Free</p>
              </div>
              <div>
                <p className="text-lg font-semibold leading-none tracking-tight text-foreground">
                  {totalPro}
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground">Pro</p>
              </div>
            </div>
          </div>
          {/* ── Sections (Marketing / App / Ecommerce) ── */}
          <AnimatePresence mode="wait">
            {showMarketing && (
              <motion.section
                id="marketing"
                key="marketing"
                className="px-6 md:px-10"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <SectionTitle id="marketing" count={totalMarketing}>
                  Marketing blocks
                </SectionTitle>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-5">
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
                className="px-6 md:px-10"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <SectionTitle id="app" count={totalApp}>
                  App blocks
                </SectionTitle>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-5">
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
                className="px-6 md:px-10"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <SectionTitle id="ecommerce" count={totalEcommerce}>
                  Ecommerce blocks
                </SectionTitle>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-5">
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
      </div>
    </AppShell>
  );
}
