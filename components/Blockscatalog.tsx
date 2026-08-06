"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import registryJson from "@/public/r/registry.json";
import BlockPreview from "./BlockPreview";
import {
  BlockCategory,
  blockCategories,
  countRegistryItemsForCategory,
} from "@/lib/block-categories";

interface SectionBlock extends BlockCategory {
  count: number;
  available: boolean;
  route?: string;
}

const registryData = registryJson as { items: any[] };
const mockBlocks = blockCategories;

function countRegistryItemsForSection(sectionName: string) {
  return countRegistryItemsForCategory(sectionName, registryData.items);
}

// ─── Block Card ───────────────────────────────────────────────────────────────
function BlockCard({ block, index }: { block: SectionBlock; index: number }) {
  const cardContent = (
    <Link
      href={block.available && block.route ? `/blocks/${block.route}` : "#"}
      className="group block"
    >
      {/* Preview thumbnail */}
      <div className="relative mb-2 aspect-[16/9] overflow-hidden rounded-lg border border-border bg-card transition-all duration-200 group-hover:border-muted-foreground/60 group-hover:shadow-md">
        {/* SVG preview */}
        <div className="absolute inset-0">
          <BlockPreview blockType={block.slug} />
        </div>
        {/* overlay on hover */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/[0.03]" />
      </div>

      {/* Label + count */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground transition-colors group-hover:text-foreground">
          {block.title}
        </span>
        <span className="ml-2 whitespace-nowrap text-xs text-muted-foreground tabular-nums">
          {block.available
            ? `${block.count} block${block.count > 1 ? "s" : ""}`
            : "Coming"}
        </span>
      </div>
    </Link>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.03,
      }}
    >
      {cardContent}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CATALOG
// ═══════════════════════════════════════════════════════════════════════════════
const INITIAL_COUNT = 9;

export default function BlocksCatalog() {
  const [showAll, setShowAll] = React.useState(false);

  const blocks: SectionBlock[] = mockBlocks.map((section) => {
    const count = countRegistryItemsForSection(section.slug);
    return {
      ...section,
      count,
      available: count > 0,
      route: section.slug,
    };
  });

  const visibleBlocks = showAll ? blocks : blocks.slice(0, INITIAL_COUNT);

  return (
    <div className="w-full border-t border-border">
      <section className="px-6 md:px-12 lg:px-16">
        <div className="mx-auto max-w-7xl border-x border-border px-6 py-16 md:py-20">
          {/* Header */}
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Library
              </p>

              <h1
                className="mb-3 text-2xl font-bold leading-tight text-foreground md:text-3xl"
                style={{ letterSpacing: "-0.03em" }}
              >
                Explore our collection of UI blocks
              </h1>

              <p className="max-w-md text-base leading-7 text-muted-foreground">
                A growing collection of handcrafted React and shadcn/ui blocks
                designed to help you build modern interfaces faster.
              </p>
            </div>

            <Link
              href="/blocks"
              className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
            >
              Browse all blocks
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* Grid - 3 columns */}
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {visibleBlocks.map((block, index) => (
                <BlockCard key={block.slug} block={block} index={index} />
              ))}
            </div>

            {/* Show more */}
            {!showAll && (
              <div className="relative mt-8">
                <div className="flex flex-col items-center gap-2 pt-8">
                  <button
                    onClick={() => setShowAll(true)}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all shadow-sm hover:opacity-90 hover:shadow-md"
                  >
                    See all {blocks.length} blocks
                  </button>
                </div>
              </div>
            )}

            {/* Show less */}
            {showAll && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setShowAll(false)}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-muted-foreground hover:text-foreground"
                >
                  Show less
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
