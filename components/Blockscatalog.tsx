"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import registryJson from "@/public/r/registry.json";
import {
  blockCategories,
  countRegistryItemsForCategory,
  RegistryItem,
} from "@/lib/block-categories";

interface RegistryFile {
  items: RegistryItem[];
}

interface SectionBlock {
  slug: string;
  title: string;
  type: string;
  description: string;
  count: number;
  available: boolean;
  route?: string;
}

const registryData = registryJson as RegistryFile;

const mockBlocks = blockCategories;

function countRegistryItemsForSection(sectionName: string) {
  return countRegistryItemsForCategory(sectionName, registryData.items);
}

// Preview components for each block type
function BlockPreview({ blockType }: { blockType: string }) {
  const previews: Record<string, React.ReactNode> = {
    contact: (
      <svg
        viewBox="0 0 280 200"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="280" height="200" fill="#f8f8f8" />
        {/* Form inputs */}
        <rect x="20" y="25" width="240" height="20" rx="4" fill="#e9e9e9" />
        <rect x="20" y="55" width="240" height="20" rx="4" fill="#e9e9e9" />
        <rect x="20" y="85" width="240" height="45" rx="4" fill="#e9e9e9" />
        {/* Submit button */}
        <rect x="20" y="145" width="100" height="32" rx="16" fill="#000" />
        <circle cx="70" cy="161" r="3" fill="#fff" />
      </svg>
    ),
    faqs: (
      <svg
        viewBox="0 0 280 200"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="280" height="200" fill="#f0f8ff" />
        {/* FAQ items */}
        <rect
          x="20"
          y="20"
          width="240"
          height="28"
          rx="6"
          fill="#fff"
          stroke="#ddd"
          strokeWidth="1"
        />
        <line x1="30" y1="34" x2="200" y2="34" stroke="#333" strokeWidth="2" />
        <circle cx="245" cy="34" r="4" fill="#1e90ff" />

        <rect
          x="20"
          y="60"
          width="240"
          height="28"
          rx="6"
          fill="#fff"
          stroke="#ddd"
          strokeWidth="1"
        />
        <line x1="30" y1="74" x2="200" y2="74" stroke="#333" strokeWidth="2" />
        <circle cx="245" cy="74" r="4" fill="#1e90ff" />

        <rect
          x="20"
          y="100"
          width="240"
          height="28"
          rx="6"
          fill="#fff"
          stroke="#ddd"
          strokeWidth="1"
        />
        <line
          x1="30"
          y1="114"
          x2="200"
          y2="114"
          stroke="#333"
          strokeWidth="2"
        />
        <circle cx="245" cy="114" r="4" fill="#ffa500" />
      </svg>
    ),
    footer: (
      <svg
        viewBox="0 0 280 200"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="280" height="200" fill="#1a1a1a" />
        {/* Column 1 */}
        <line x1="20" y1="25" x2="90" y2="25" stroke="#666" strokeWidth="2" />
        <line x1="20" y1="40" x2="80" y2="40" stroke="#444" strokeWidth="1" />
        <line x1="20" y1="52" x2="85" y2="52" stroke="#444" strokeWidth="1" />
        {/* Column 2 */}
        <line x1="120" y1="25" x2="190" y2="25" stroke="#666" strokeWidth="2" />
        <line x1="120" y1="40" x2="180" y2="40" stroke="#444" strokeWidth="1" />
        <line x1="120" y1="52" x2="185" y2="52" stroke="#444" strokeWidth="1" />
        {/* Column 3 */}
        <line x1="220" y1="25" x2="260" y2="25" stroke="#666" strokeWidth="2" />
        <line x1="220" y1="40" x2="260" y2="40" stroke="#444" strokeWidth="1" />
        {/* Icons at bottom */}
        <circle cx="40" cy="160" r="8" fill="#666" />
        <circle cx="75" cy="160" r="8" fill="#666" />
        <circle cx="110" cy="160" r="8" fill="#666" />
      </svg>
    ),
    carousel: (
      <svg
        viewBox="0 0 280 200"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="280" height="200" fill="#fafafa" />
        {/* Main image */}
        <rect x="20" y="20" width="240" height="130" rx="8" fill="#e0e0e0" />
        {/* Dots */}
        <circle cx="80" cy="170" r="5" fill="#333" />
        <circle cx="100" cy="170" r="5" fill="#ccc" />
        <circle cx="120" cy="170" r="5" fill="#ccc" />
      </svg>
    ),
    pricing: (
      <svg
        viewBox="0 0 280 200"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="280" height="200" fill="#f5f9ff" />
        {/* Pricing cards */}
        <rect
          x="15"
          y="30"
          width="75"
          height="140"
          rx="8"
          fill="#fff"
          stroke="#ddd"
          strokeWidth="1"
        />
        <line x1="22" y1="50" x2="82" y2="50" stroke="#333" strokeWidth="2" />
        <line x1="22" y1="65" x2="70" y2="65" stroke="#999" strokeWidth="1" />

        <rect x="102" y="20" width="75" height="160" rx="8" fill="#000" />
        <line x1="109" y1="40" x2="169" y2="40" stroke="#fff" strokeWidth="2" />
        <line x1="109" y1="55" x2="157" y2="55" stroke="#888" strokeWidth="1" />

        <rect
          x="189"
          y="30"
          width="75"
          height="140"
          rx="8"
          fill="#fff"
          stroke="#ddd"
          strokeWidth="1"
        />
        <line x1="196" y1="50" x2="256" y2="50" stroke="#333" strokeWidth="2" />
        <line x1="196" y1="65" x2="244" y2="65" stroke="#999" strokeWidth="1" />
      </svg>
    ),
    hero: (
        <svg viewBox="0 0 320 180" className="w-full h-full">
          <rect width="320" height="180" fill="#f9fafb"/>
          {/* nav */}
          <rect x="16" y="12" width="28" height="5" rx="2" fill="#d1d5db"/>
          <rect x="224" y="11" width="20" height="7" rx="3" fill="#d1d5db"/>
          <rect x="248" y="11" width="20" height="7" rx="3" fill="#d1d5db"/>
          <rect x="272" y="10" width="32" height="8" rx="4" fill="#111827"/>
          {/* badge */}
          <rect x="120" y="36" width="80" height="9" rx="4.5" fill="#e5e7eb"/>
          {/* headline */}
          <rect x="52" y="52" width="216" height="12" rx="3" fill="#111827"/>
          <rect x="76" y="68" width="168" height="12" rx="3" fill="#111827"/>
          {/* sub */}
          <rect x="80" y="88" width="160" height="6" rx="2" fill="#9ca3af"/>
          <rect x="96" y="98" width="128" height="6" rx="2" fill="#9ca3af"/>
          {/* buttons */}
          <rect x="96" y="114" width="56" height="16" rx="8" fill="#111827"/>
          <rect x="160" y="114" width="64" height="16" rx="8" fill="none" stroke="#d1d5db" strokeWidth="1.5"/>
          {/* image placeholder */}
          <rect x="40" y="144" width="240" height="28" rx="6" fill="#e5e7eb"/>
          <rect x="56" y="150" width="60" height="4" rx="2" fill="#d1d5db"/>
          <rect x="56" y="158" width="40" height="4" rx="2" fill="#d1d5db"/>
        </svg>
    ),
  };

  return previews[blockType] || previews.contact;
}

function BlockCard({ block, index }: { block: SectionBlock; index: number }) {
  const cardContent = (
    <div
      className={`bg-white rounded-2xl overflow-hidden border border-[#f0f0f0] shadow-sm transition-all duration-300 h-full flex flex-col ${block.available ? "hover:shadow-lg" : "opacity-80"}`}
    >
      {/* Preview Area */}
      <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden relative">
        <div className="w-full h-full p-6">
          <BlockPreview blockType={block.slug} />
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>

      {/* Content Area */}
      <div className="flex-1 p-5 flex flex-col">
        <h3 className="text-lg font-bold text-slate-950 mb-1">{block.title}</h3>
        <p className="text-sm text-slate-500 mb-4 flex-1">
          {block.description}
        </p>

        {/* Block count */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-xs font-semibold uppercase tracking-wider">
            {block.available ? (
              <span className="text-slate-400">
                {block.count} block{block.count > 1 ? "s" : ""}
              </span>
            ) : (
              <span className="text-black/80">Block 0 — Coming Soon</span>
            )}
          </span>
          <ArrowUpRight
            size={16}
            className={`transition-colors ${block.available ? "text-slate-400 group-hover:text-slate-900" : "text-slate-300"}`}
          />
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -4 }}
      className="group"
    >
      {block.available && block.route ? (
        <Link href={`/blocks/${block.route}`}>{cardContent}</Link>
      ) : (
        cardContent
      )}
    </motion.div>
  );
}

export default function BlocksCatalog() {
  const blocks = mockBlocks.map((section) => {
    const count = countRegistryItemsForSection(section.slug);
    return {
      ...section,
      count,
      available: count > 0,
      route: section.slug,
    };
  });

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="px-6 md:px-12 lg:px-16 py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
            <div>
              <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">
                Catalog
              </p>
              <h1
                className="text-5xl md:text-6xl font-bold text-slate-950 leading-tight mb-5"
                style={{ letterSpacing: "-0.02em" }}
              >
                A taste of what's inside
              </h1>
              <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
                Three categories at launch, every block crafted by hand and free
                while we warm up. Pick a category to start browsing.
              </p>
            </div>

            {/* See all blocks link */}
            <Link
              href="/blocks"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-950 hover:text-slate-700 transition-colors whitespace-nowrap"
            >
              See all blocks <ArrowUpRight size={16} className="mt-0.5" />
            </Link>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blocks.map((block, index) => (
              <BlockCard key={block.slug} block={block} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
