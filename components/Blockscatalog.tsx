"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

// Mock data - replace with your actual registry data
const mockBlocks = [
  {
    name: "contact",
    title: "Contact",
    type: "block",
    count: 15,
    description: "Contact form and information section",
  },
  {
    name: "faqs",
    title: "FAQs",
    type: "block",
    count: 15,
    description: "Frequently asked questions accordion",
  },
  {
    name: "footer",
    title: "Footer",
    type: "block",
    count: 15,
    description: "Site footer with links and info",
  },
  {
    name: "carousel",
    title: "Carousel",
    type: "block",
    count: 12,
    description: "Image carousel/slider component",
  },
  {
    name: "pricing",
    title: "Pricing",
    type: "block",
    count: 14,
    description: "Pricing plans and comparison",
  },
  {
    name: "hero",
    title: "Hero",
    type: "block",
    count: 18,
    description: "Hero banner with call to action",
  },
];

// Preview components for each block type
function BlockPreview({ blockType }) {
  const previews = {
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
          <rect x="20" y="20" width="240" height="28" rx="6" fill="#fff" stroke="#ddd" strokeWidth="1" />
          <line x1="30" y1="34" x2="200" y2="34" stroke="#333" strokeWidth="2" />
          <circle cx="245" cy="34" r="4" fill="#1e90ff" />

          <rect x="20" y="60" width="240" height="28" rx="6" fill="#fff" stroke="#ddd" strokeWidth="1" />
          <line x1="30" y1="74" x2="200" y2="74" stroke="#333" strokeWidth="2" />
          <circle cx="245" cy="74" r="4" fill="#1e90ff" />

          <rect x="20" y="100" width="240" height="28" rx="6" fill="#fff" stroke="#ddd" strokeWidth="1" />
          <line x1="30" y1="114" x2="200" y2="114" stroke="#333" strokeWidth="2" />
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
          <rect x="15" y="30" width="75" height="140" rx="8" fill="#fff" stroke="#ddd" strokeWidth="1" />
          <line x1="22" y1="50" x2="82" y2="50" stroke="#333" strokeWidth="2" />
          <line x1="22" y1="65" x2="70" y2="65" stroke="#999" strokeWidth="1" />

          <rect x="102" y="20" width="75" height="160" rx="8" fill="#000" />
          <line x1="109" y1="40" x2="169" y2="40" stroke="#fff" strokeWidth="2" />
          <line x1="109" y1="55" x2="157" y2="55" stroke="#888" strokeWidth="1" />

          <rect x="189" y="30" width="75" height="140" rx="8" fill="#fff" stroke="#ddd" strokeWidth="1" />
          <line x1="196" y1="50" x2="256" y2="50" stroke="#333" strokeWidth="2" />
          <line x1="196" y1="65" x2="244" y2="65" stroke="#999" strokeWidth="1" />
        </svg>
    ),
    hero: (
        <svg
            viewBox="0 0 280 200"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#667eea" />
              <stop offset="100%" stopColor="#764ba2" />
            </linearGradient>
          </defs>
          <rect width="280" height="200" fill="url(#heroGrad)" />
          {/* Headline */}
          <line x1="20" y1="40" x2="180" y2="40" stroke="#fff" strokeWidth="3" />
          <line x1="20" y1="55" x2="200" y2="55" stroke="#fff" strokeWidth="3" />
          {/* Subtitle */}
          <line x1="20" y1="75" x2="250" y2="75" stroke="#fff" strokeWidth="1" opacity="0.7" />
          <line x1="20" y1="87" x2="240" y2="87" stroke="#fff" strokeWidth="1" opacity="0.7" />
          {/* CTA Button */}
          <rect x="20" y="120" width="120" height="40" rx="20" fill="#fff" />
          <line x1="35" y1="140" x2="95" y2="140" stroke="#667eea" strokeWidth="2" />
        </svg>
    ),
  };

  return previews[blockType] || previews.contact;
}

function BlockCard({ block, index }) {
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
        <Link href={`/blocks/${block.name}`}>
          <div className="bg-white rounded-2xl overflow-hidden border border-[#f0f0f0] shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col">
            {/* Preview Area */}
            <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden relative">
              <div className="w-full h-full p-6">
                <BlockPreview blockType={block.name} />
              </div>
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
            </div>

            {/* Content Area */}
            <div className="flex-1 p-5 flex flex-col">
              <h3 className="text-lg font-bold text-slate-950 mb-1">
                {block.title}
              </h3>
              <p className="text-sm text-slate-500 mb-4 flex-1">
                {block.description}
              </p>

              {/* Block count */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {block.count} blocks
              </span>
                <ArrowUpRight
                    size={16}
                    className="text-slate-400 group-hover:text-slate-900 transition-colors"
                />
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
  );
}

export default function BlocksCatalog() {
  const blocks = mockBlocks;

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
                See all blocks{" "}
                <ArrowUpRight size={16} className="mt-0.5" />
              </Link>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blocks.map((block, index) => (
                  <BlockCard key={block.name} block={block} index={index} />
              ))}
            </div>
          </div>
        </section>
      </div>
  );
}