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

// ─── Rich SVG previews ────────────────────────────────────────────────────────
function BlockPreview({ blockType }: { blockType: string }) {
  const previews: Record<string, React.ReactNode> = {
    // ── Hero ─────────────────────────────────────────────────────────────────
    hero: (
      <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
        <rect width="320" height="180" fill="var(--background)" />
        <rect x="16" y="12" width="28" height="5" rx="2" fill="var(--border)" />
        <rect
          x="224"
          y="11"
          width="20"
          height="7"
          rx="3"
          fill="var(--border)"
        />
        <rect
          x="248"
          y="11"
          width="20"
          height="7"
          rx="3"
          fill="var(--border)"
        />
        <rect
          x="272"
          y="10"
          width="32"
          height="8"
          rx="4"
          fill="var(--foreground)"
        />
        <rect
          x="120"
          y="36"
          width="80"
          height="9"
          rx="4.5"
          fill="var(--muted)"
        />
        <rect
          x="52"
          y="52"
          width="216"
          height="12"
          rx="3"
          fill="var(--foreground)"
        />
        <rect
          x="76"
          y="68"
          width="168"
          height="12"
          rx="3"
          fill="var(--foreground)"
        />
        <rect
          x="80"
          y="88"
          width="160"
          height="6"
          rx="2"
          fill="var(--muted-foreground)"
        />
        <rect
          x="96"
          y="98"
          width="128"
          height="6"
          rx="2"
          fill="var(--muted-foreground)"
        />
        <rect
          x="96"
          y="114"
          width="56"
          height="16"
          rx="8"
          fill="var(--foreground)"
        />
        <rect
          x="160"
          y="114"
          width="64"
          height="16"
          rx="8"
          fill="none"
          stroke="var(--border)"
          strokeWidth="1.5"
        />
        <rect
          x="40"
          y="144"
          width="240"
          height="28"
          rx="6"
          fill="var(--muted)"
        />
        <rect
          x="56"
          y="150"
          width="60"
          height="4"
          rx="2"
          fill="var(--border)"
        />
        <rect
          x="56"
          y="158"
          width="40"
          height="4"
          rx="2"
          fill="var(--border)"
        />
      </svg>
    ),

    // ── Feature ──────────────────────────────────────────────────────────────
    feature: (
      <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
        <rect width="320" height="180" fill="var(--background)" />
        <rect
          x="96"
          y="14"
          width="128"
          height="9"
          rx="3"
          fill="var(--foreground)"
        />
        <rect
          x="112"
          y="27"
          width="96"
          height="5"
          rx="2"
          fill="var(--muted-foreground)"
        />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g
            key={i}
            transform={`translate(${14 + (i % 3) * 100},${50 + Math.floor(i / 3) * 60})`}
          >
            <rect
              width="90"
              height="52"
              rx="6"
              fill="var(--card)"
              stroke="var(--border)"
              strokeWidth="1"
            />
            <rect
              x="8"
              y="9"
              width="16"
              height="16"
              rx="4"
              fill="var(--muted)"
            />
            <rect
              x="32"
              y="11"
              width="48"
              height="5"
              rx="2"
              fill="var(--muted-foreground)"
            />
            <rect
              x="32"
              y="20"
              width="40"
              height="4"
              rx="2"
              fill="var(--muted-foreground)"
            />
            <rect
              x="32"
              y="28"
              width="44"
              height="4"
              rx="2"
              fill="var(--muted-foreground)"
            />
            <rect
              x="8"
              y="38"
              width="28"
              height="6"
              rx="3"
              fill="var(--secondary)"
            />
          </g>
        ))}
      </svg>
    ),

    // ── Pricing ──────────────────────────────────────────────────────────────
    pricing: (
      <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
        <rect width="320" height="180" fill="var(--background)" />
        <rect
          x="108"
          y="12"
          width="104"
          height="10"
          rx="3"
          fill="var(--foreground)"
        />
        <rect
          x="120"
          y="26"
          width="80"
          height="5"
          rx="2"
          fill="var(--muted-foreground)"
        />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${14 + i * 100},46)`}>
            <rect
              width="88"
              height="120"
              rx="8"
              fill={i === 1 ? "var(--foreground)" : "var(--card)"}
              stroke={i === 1 ? "none" : "var(--muted)"}
              strokeWidth="1"
            />
            <rect
              x="10"
              y="12"
              width="48"
              height="7"
              rx="2"
              fill={i === 1 ? "var(--card)" : "var(--muted-foreground)"}
            />
            <rect
              x="10"
              y="24"
              width="32"
              height="4"
              rx="2"
              fill="var(--muted-foreground)"
            />
            <rect
              x="10"
              y="36"
              width="40"
              height="10"
              rx="2"
              fill={i === 1 ? "var(--card)" : "var(--foreground)"}
            />
            {[0, 1, 2, 3].map((r) => (
              <g key={r} transform={`translate(10,${54 + r * 12})`}>
                <rect
                  width="6"
                  height="6"
                  rx="1"
                  fill={i === 1 ? "var(--muted-foreground)" : "var(--muted)"}
                />
                <rect
                  x="10"
                  y="1"
                  width={40 - r * 4}
                  height="4"
                  rx="2"
                  fill={i === 1 ? "var(--muted-foreground)" : "var(--border)"}
                />
              </g>
            ))}
            <rect
              x="10"
              y="100"
              width="68"
              height="14"
              rx="7"
              fill={i === 1 ? "var(--card)" : "var(--foreground)"}
            />
          </g>
        ))}
      </svg>
    ),

    // ── Testimonial ──────────────────────────────────────────────────────────
    testimonial: (
      <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
        <rect width="320" height="180" fill="var(--background)" />
        <rect
          x="108"
          y="14"
          width="104"
          height="8"
          rx="3"
          fill="var(--foreground)"
        />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${10 + i * 102},36)`}>
            <rect
              width="92"
              height="128"
              rx="8"
              fill="var(--card)"
              stroke="var(--border)"
              strokeWidth="1"
            />
            <rect
              x="10"
              y="14"
              width="12"
              height="12"
              rx="2"
              fill="var(--muted)"
            />
            <rect
              x="10"
              y="32"
              width="72"
              height="4"
              rx="2"
              fill="var(--muted-foreground)"
            />
            <rect
              x="10"
              y="40"
              width="64"
              height="4"
              rx="2"
              fill="var(--muted-foreground)"
            />
            <rect
              x="10"
              y="48"
              width="68"
              height="4"
              rx="2"
              fill="var(--muted-foreground)"
            />
            <rect
              x="10"
              y="56"
              width="52"
              height="4"
              rx="2"
              fill="var(--muted-foreground)"
            />
            <circle cx="20" cy="92" r="10" fill="var(--muted)" />
            <rect
              x="36"
              y="86"
              width="44"
              height="5"
              rx="2"
              fill="var(--muted-foreground)"
            />
            <rect
              x="36"
              y="95"
              width="32"
              height="3"
              rx="1.5"
              fill="var(--muted-foreground)"
            />
            {[0, 1, 2, 3, 4].map((s) => (
              <rect
                key={s}
                x={10 + s * 11}
                y="109"
                width="8"
                height="4"
                rx="1"
                fill="var(--chart-4)"
              />
            ))}
          </g>
        ))}
      </svg>
    ),

    // ── CTA ──────────────────────────────────────────────────────────────────
    cta: (
      <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
        <rect width="320" height="180" fill="var(--background)" />
        {[0, 1].map((i) => (
          <g key={i} transform={`translate(16,${16 + i * 84})`}>
            <rect
              width="288"
              height="68"
              rx="10"
              fill={i === 0 ? "var(--foreground)" : "var(--card)"}
              stroke={i === 0 ? "none" : "var(--muted)"}
              strokeWidth="1"
            />
            <rect
              x="16"
              y="14"
              width="120"
              height="9"
              rx="3"
              fill={i === 0 ? "var(--card)" : "var(--foreground)"}
            />
            <rect
              x="16"
              y="28"
              width="96"
              height="5"
              rx="2"
              fill={
                i === 0 ? "var(--muted-foreground)" : "var(--muted-foreground)"
              }
            />
            <rect
              x="192"
              y="22"
              width="80"
              height="22"
              rx="11"
              fill={i === 0 ? "var(--card)" : "var(--foreground)"}
            />
            <rect
              x="208"
              y="30"
              width="48"
              height="5"
              rx="2"
              fill={i === 0 ? "var(--foreground)" : "var(--card)"}
            />
          </g>
        ))}
      </svg>
    ),

    // ── FAQ ──────────────────────────────────────────────────────────────────
    faq: (
      <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
        <rect width="320" height="180" fill="var(--background)" />
        <rect
          x="88"
          y="16"
          width="144"
          height="9"
          rx="3"
          fill="var(--foreground)"
        />
        <rect
          x="108"
          y="29"
          width="104"
          height="5"
          rx="2"
          fill="var(--muted-foreground)"
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} transform={`translate(24,${48 + i * 26})`}>
            <rect
              width="272"
              height="20"
              rx="5"
              fill={i === 1 ? "var(--secondary)" : "var(--card)"}
              stroke="var(--border)"
              strokeWidth="1"
            />
            <rect
              x="10"
              y="7"
              width={72 + i * 10}
              height="5"
              rx="2"
              fill="var(--muted-foreground)"
            />
            {i === 1 ? (
              <rect
                x="10"
                y="14"
                width="200"
                height="3"
                rx="1.5"
                fill="var(--muted-foreground)"
              />
            ) : (
              <rect
                x="250"
                y="7"
                width="12"
                height="5"
                rx="2"
                fill="var(--muted-foreground)"
              />
            )}
          </g>
        ))}
      </svg>
    ),

    // ── Navbar ───────────────────────────────────────────────────────────────
    navbar: (
      <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
        <rect width="320" height="180" fill="var(--background)" />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(0,${16 + i * 54})`}>
            <rect
              x="16"
              y="0"
              width="288"
              height="38"
              rx="8"
              fill="var(--card)"
              stroke="var(--border)"
              strokeWidth="1"
            />
            <rect
              x="28"
              y="14"
              width="32"
              height="10"
              rx="3"
              fill="var(--foreground)"
            />
            <rect
              x="100"
              y="16"
              width="24"
              height="6"
              rx="2"
              fill="var(--muted-foreground)"
            />
            <rect
              x="132"
              y="16"
              width="24"
              height="6"
              rx="2"
              fill="var(--muted-foreground)"
            />
            <rect
              x="164"
              y="16"
              width="24"
              height="6"
              rx="2"
              fill="var(--muted-foreground)"
            />
            <rect
              x="196"
              y="16"
              width="24"
              height="6"
              rx="2"
              fill="var(--muted-foreground)"
            />
            <rect
              x="256"
              y="13"
              width="36"
              height="12"
              rx="6"
              fill={i === 0 ? "var(--foreground)" : "none"}
              stroke={i === 0 ? "none" : "var(--border)"}
              strokeWidth="1"
            />
          </g>
        ))}
      </svg>
    ),

    // ── Footer ───────────────────────────────────────────────────────────────
    footer: (
      <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
        <rect width="320" height="180" fill="var(--background)" />
        <rect
          x="16"
          y="12"
          width="288"
          height="72"
          rx="6"
          fill="var(--card)"
          stroke="var(--border)"
          strokeWidth="1"
        />
        <rect x="28" y="24" width="60" height="6" rx="2" fill="var(--border)" />
        <rect x="28" y="36" width="232" height="5" rx="2" fill="var(--muted)" />
        <rect x="28" y="46" width="200" height="5" rx="2" fill="var(--muted)" />
        <rect x="0" y="96" width="320" height="84" fill="var(--foreground)" />
        <rect x="20" y="106" width="44" height="7" rx="3" fill="var(--card)" />
        <rect
          x="20"
          y="118"
          width="72"
          height="3"
          rx="1.5"
          fill="var(--muted-foreground)"
        />
        <rect
          x="20"
          y="126"
          width="64"
          height="3"
          rx="1.5"
          fill="var(--muted-foreground)"
        />
        <rect
          x="20"
          y="134"
          width="56"
          height="3"
          rx="1.5"
          fill="var(--muted-foreground)"
        />
        {[1, 2, 3].map((col) => (
          <g key={col} transform={`translate(${108 + col * 56},106)`}>
            <rect width="40" height="4" rx="2" fill="var(--muted-foreground)" />
            {[0, 1, 2, 3].map((r) => (
              <rect
                key={r}
                x="0"
                y={10 + r * 9}
                width="36"
                height="3"
                rx="1.5"
                fill="var(--muted-foreground)"
              />
            ))}
          </g>
        ))}
        <rect
          x="20"
          y="168"
          width="280"
          height="1"
          fill="var(--muted-foreground)"
        />
      </svg>
    ),

    // ── Blog ─────────────────────────────────────────────────────────────────
    blog: (
      <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
        <rect width="320" height="180" fill="var(--background)" />
        <rect
          x="16"
          y="12"
          width="180"
          height="156"
          rx="8"
          fill="var(--card)"
          stroke="var(--border)"
          strokeWidth="1"
        />
        <rect
          x="24"
          y="20"
          width="164"
          height="72"
          rx="5"
          fill="var(--secondary)"
        />
        <rect
          x="24"
          y="100"
          width="60"
          height="5"
          rx="2"
          fill="var(--muted-foreground)"
        />
        <rect
          x="24"
          y="110"
          width="148"
          height="8"
          rx="3"
          fill="var(--foreground)"
        />
        <rect
          x="24"
          y="122"
          width="140"
          height="4"
          rx="2"
          fill="var(--muted-foreground)"
        />
        <rect
          x="24"
          y="130"
          width="120"
          height="4"
          rx="2"
          fill="var(--muted-foreground)"
        />
        <circle cx="34" cy="150" r="8" fill="var(--muted)" />
        <rect
          x="48"
          y="146"
          width="60"
          height="4"
          rx="2"
          fill="var(--muted-foreground)"
        />
        <rect
          x="48"
          y="154"
          width="44"
          height="3"
          rx="1.5"
          fill="var(--muted-foreground)"
        />
        {[0, 1].map((i) => (
          <g key={i} transform={`translate(204,${12 + i * 80})`}>
            <rect
              width="100"
              height="72"
              rx="8"
              fill="var(--card)"
              stroke="var(--border)"
              strokeWidth="1"
            />
            <rect
              x="8"
              y="8"
              width="84"
              height="32"
              rx="4"
              fill="var(--secondary)"
            />
            <rect
              x="8"
              y="46"
              width="84"
              height="5"
              rx="2"
              fill="var(--muted-foreground)"
            />
            <rect
              x="8"
              y="55"
              width="68"
              height="4"
              rx="2"
              fill="var(--muted-foreground)"
            />
          </g>
        ))}
      </svg>
    ),

    // ── Team ─────────────────────────────────────────────────────────────────
    team: (
      <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
        <rect width="320" height="180" fill="var(--background)" />
        <rect
          x="96"
          y="14"
          width="128"
          height="9"
          rx="3"
          fill="var(--foreground)"
        />
        <rect
          x="112"
          y="27"
          width="96"
          height="5"
          rx="2"
          fill="var(--muted-foreground)"
        />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${16 + i * 102},50)`}>
            <rect
              width="88"
              height="116"
              rx="8"
              fill="var(--card)"
              stroke="var(--border)"
              strokeWidth="1"
            />
            <circle cx="44" cy="36" r="24" fill="var(--secondary)" />
            <circle cx="44" cy="28" r="12" fill="var(--muted)" />
            <ellipse cx="44" cy="54" rx="20" ry="12" fill="var(--muted)" />
            <rect
              x="12"
              y="76"
              width="64"
              height="7"
              rx="2"
              fill="var(--foreground)"
            />
            <rect
              x="20"
              y="88"
              width="48"
              height="5"
              rx="2"
              fill="var(--muted-foreground)"
            />
            <rect
              x="24"
              y="98"
              width="40"
              height="4"
              rx="2"
              fill="var(--border)"
            />
            <rect
              x="28"
              y="106"
              width="32"
              height="4"
              rx="2"
              fill="var(--border)"
            />
          </g>
        ))}
      </svg>
    ),

    // ── Stats ────────────────────────────────────────────────────────────────
    stats: (
      <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
        <rect width="320" height="180" fill="var(--background)" />
        <rect
          x="88"
          y="16"
          width="144"
          height="9"
          rx="3"
          fill="var(--foreground)"
        />
        <rect
          x="112"
          y="30"
          width="96"
          height="5"
          rx="2"
          fill="var(--muted-foreground)"
        />
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${14 + i * 76},52)`}>
            <rect
              width="68"
              height="104"
              rx="6"
              fill="var(--card)"
              stroke="var(--border)"
              strokeWidth="1"
            />
            <rect
              x="10"
              y="12"
              width="28"
              height="4"
              rx="2"
              fill="var(--muted-foreground)"
            />
            <rect
              x="10"
              y="21"
              width="48"
              height="14"
              rx="3"
              fill="var(--foreground)"
            />
            <rect
              x="10"
              y="40"
              width="36"
              height="3"
              rx="1.5"
              fill="var(--muted-foreground)"
            />
            <polyline
              points="10,82 20,70 30,75 42,62 58,66"
              fill="none"
              stroke="var(--foreground)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="8"
              y="88"
              width="52"
              height="8"
              rx="2"
              fill="var(--secondary)"
            />
          </g>
        ))}
      </svg>
    ),

    // ── Contact ──────────────────────────────────────────────────────────────
    contact: (
      <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
        <rect width="320" height="180" fill="var(--background)" />
        <rect
          x="16"
          y="20"
          width="100"
          height="140"
          rx="8"
          fill="var(--foreground)"
        />
        <rect x="28" y="32" width="60" height="8" rx="3" fill="var(--card)" />
        <rect
          x="28"
          y="46"
          width="76"
          height="4"
          rx="2"
          fill="var(--muted-foreground)"
        />
        <rect
          x="28"
          y="54"
          width="68"
          height="4"
          rx="2"
          fill="var(--muted-foreground)"
        />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(28,${76 + i * 22})`}>
            <circle cx="7" cy="7" r="7" fill="var(--foreground)" />
            <rect
              x="20"
              y="3"
              width="48"
              height="4"
              rx="2"
              fill="var(--muted-foreground)"
            />
            <rect
              x="20"
              y="10"
              width="36"
              height="3"
              rx="1.5"
              fill="var(--muted-foreground)"
            />
          </g>
        ))}
        <rect
          x="128"
          y="20"
          width="176"
          height="140"
          rx="8"
          fill="var(--card)"
          stroke="var(--border)"
          strokeWidth="1"
        />
        <rect
          x="140"
          y="32"
          width="80"
          height="7"
          rx="2"
          fill="var(--foreground)"
        />
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(140,${50 + i * 24})`}>
            <rect width="152" height="4" rx="2" fill="var(--border)" />
            <rect
              y="7"
              width="152"
              height="12"
              rx="4"
              fill="var(--secondary)"
              stroke="var(--border)"
              strokeWidth="1"
            />
          </g>
        ))}
        <rect
          x="140"
          y="150"
          width="60"
          height="14"
          rx="7"
          fill="var(--foreground)"
        />
      </svg>
    ),

    // ── Gallery ──────────────────────────────────────────────────────────────
    gallery: (
      <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
        <rect width="320" height="180" fill="var(--background)" />
        <rect x="12" y="12" width="88" height="80" rx="6" fill="var(--muted)" />
        <rect
          x="12"
          y="100"
          width="88"
          height="68"
          rx="6"
          fill="var(--border)"
        />
        <rect
          x="108"
          y="12"
          width="88"
          height="52"
          rx="6"
          fill="var(--border)"
        />
        <rect
          x="108"
          y="72"
          width="88"
          height="96"
          rx="6"
          fill="var(--muted)"
        />
        <rect
          x="204"
          y="12"
          width="104"
          height="100"
          rx="6"
          fill="var(--muted)"
        />
        <rect
          x="204"
          y="120"
          width="104"
          height="48"
          rx="6"
          fill="var(--border)"
        />
        <circle cx="56" cy="52" r="12" fill="var(--border)" opacity="0.5" />
        <circle cx="152" cy="38" r="10" fill="var(--border)" opacity="0.5" />
        <circle cx="256" cy="62" r="14" fill="var(--border)" opacity="0.5" />
      </svg>
    ),

    // ── Logos ────────────────────────────────────────────────────────────────
    logos: (
      <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
        <rect width="320" height="180" fill="var(--background)" />
        <rect
          x="88"
          y="20"
          width="144"
          height="8"
          rx="3"
          fill="var(--foreground)"
        />
        <rect
          x="112"
          y="33"
          width="96"
          height="5"
          rx="2"
          fill="var(--muted-foreground)"
        />
        {/* logo row 1 */}
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} transform={`translate(${16 + i * 60},56)`}>
            <rect
              width="52"
              height="28"
              rx="6"
              fill="var(--card)"
              stroke="var(--border)"
              strokeWidth="1"
            />
            <rect
              x="8"
              y="8"
              width="36"
              height="12"
              rx="3"
              fill="var(--muted)"
            />
          </g>
        ))}
        {/* logo row 2 — marquee style */}
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} transform={`translate(${16 + i * 60},100)`}>
            <rect
              width="52"
              height="28"
              rx="6"
              fill="var(--card)"
              stroke="var(--border)"
              strokeWidth="1"
            />
            <rect
              x="10"
              y="9"
              width="32"
              height="10"
              rx="3"
              fill="var(--secondary)"
            />
          </g>
        ))}
        <rect x="16" y="148" width="288" height="1" fill="var(--muted)" />
        <rect
          x="88"
          y="158"
          width="144"
          height="5"
          rx="2"
          fill="var(--muted)"
        />
      </svg>
    ),

    // ── Banner ───────────────────────────────────────────────────────────────
    banner: (
      <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
        <rect width="320" height="180" fill="var(--background)" />
        {/* top announcement bar */}
        <rect x="0" y="12" width="320" height="28" fill="var(--foreground)" />
        <rect
          x="108"
          y="20"
          width="104"
          height="5"
          rx="2"
          fill="var(--muted-foreground)"
        />
        <rect
          x="252"
          y="19"
          width="28"
          height="7"
          rx="3"
          fill="var(--muted-foreground)"
        />
        <rect
          x="40"
          y="19"
          width="6"
          height="6"
          rx="1"
          fill="var(--muted-foreground)"
        />
        {/* promo banner */}
        <rect
          x="16"
          y="56"
          width="288"
          height="64"
          rx="10"
          fill="var(--card)"
          stroke="var(--border)"
          strokeWidth="1"
        />
        <rect
          x="28"
          y="68"
          width="80"
          height="8"
          rx="3"
          fill="var(--foreground)"
        />
        <rect
          x="28"
          y="81"
          width="120"
          height="5"
          rx="2"
          fill="var(--muted-foreground)"
        />
        <rect
          x="28"
          y="90"
          width="96"
          height="5"
          rx="2"
          fill="var(--muted-foreground)"
        />
        <rect
          x="196"
          y="68"
          width="96"
          height="40"
          rx="8"
          fill="var(--secondary)"
        />
        <rect x="208" y="80" width="72" height="5" rx="2" fill="var(--muted)" />
        <rect x="208" y="90" width="56" height="5" rx="2" fill="var(--muted)" />
        {/* thin bar */}
        <rect
          x="16"
          y="136"
          width="288"
          height="20"
          rx="6"
          fill="var(--foreground)"
        />
        <rect
          x="28"
          y="142"
          width="120"
          height="5"
          rx="2"
          fill="var(--muted-foreground)"
        />
        <rect
          x="220"
          y="140"
          width="56"
          height="10"
          rx="5"
          fill="var(--muted-foreground)"
        />
      </svg>
    ),

    // ── SignUp ──────────────────────────────────────────────────────────────
    signup: (
      <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
        <rect width="320" height="180" fill="var(--background)" />
        {/* left promo col */}
        <rect
          x="16"
          y="16"
          width="128"
          height="148"
          rx="8"
          fill="var(--foreground)"
        />
        <rect x="28" y="28" width="72" height="9" rx="3" fill="var(--card)" />
        <rect
          x="28"
          y="43"
          width="96"
          height="4"
          rx="2"
          fill="var(--muted-foreground)"
        />
        <rect
          x="28"
          y="51"
          width="88"
          height="4"
          rx="2"
          fill="var(--muted-foreground)"
        />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(28,${72 + i * 20})`}>
            <circle cx="6" cy="6" r="6" fill="var(--foreground)" />
            <rect
              x="18"
              y="3"
              width="64"
              height="4"
              rx="2"
              fill="var(--muted-foreground)"
            />
          </g>
        ))}
        <rect
          x="28"
          y="144"
          width="96"
          height="12"
          rx="6"
          fill="var(--muted-foreground)"
        />
        {/* right form col */}
        <rect
          x="160"
          y="16"
          width="144"
          height="148"
          rx="8"
          fill="var(--card)"
          stroke="var(--border)"
          strokeWidth="1"
        />
        <rect
          x="172"
          y="28"
          width="80"
          height="8"
          rx="3"
          fill="var(--foreground)"
        />
        <rect
          x="172"
          y="42"
          width="120"
          height="5"
          rx="2"
          fill="var(--muted-foreground)"
        />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(172,${58 + i * 26})`}>
            <rect width="120" height="4" rx="2" fill="var(--border)" />
            <rect
              y="7"
              width="120"
              height="14"
              rx="4"
              fill="var(--secondary)"
              stroke="var(--border)"
              strokeWidth="1"
            />
          </g>
        ))}
        <rect
          x="172"
          y="144"
          width="120"
          height="14"
          rx="7"
          fill="var(--foreground)"
        />
      </svg>
    ),

    // ── Dashboard ────────────────────────────────────────────────────────────
    dashboard: (
      <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
        <rect width="320" height="180" fill="var(--background)" />
        <rect x="0" y="0" width="56" height="180" fill="var(--secondary)" />
        <rect x="8" y="12" width="40" height="8" rx="4" fill="var(--border)" />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <rect
              x="8"
              y={30 + i * 20}
              width="40"
              height="7"
              rx="3.5"
              fill={i === 0 ? "var(--muted)" : "none"}
            />
            <rect
              x="12"
              y={32 + i * 20}
              width="24"
              height="4"
              rx="2"
              fill={
                i === 0 ? "var(--muted-foreground)" : "var(--muted-foreground)"
              }
            />
          </g>
        ))}
        <rect
          x="64"
          y="12"
          width="80"
          height="7"
          rx="2"
          fill="var(--foreground)"
        />
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${64 + i * 65},28)`}>
            <rect
              width="58"
              height="32"
              rx="5"
              fill="var(--card)"
              stroke="var(--border)"
              strokeWidth="1"
            />
            <rect
              x="6"
              y="7"
              width="24"
              height="4"
              rx="2"
              fill="var(--muted-foreground)"
            />
            <rect
              x="6"
              y="16"
              width="32"
              height="6"
              rx="2"
              fill="var(--foreground)"
            />
          </g>
        ))}
        <rect
          x="64"
          y="70"
          width="172"
          height="100"
          rx="6"
          fill="var(--card)"
          stroke="var(--border)"
          strokeWidth="1"
        />
        <rect
          x="72"
          y="78"
          width="60"
          height="5"
          rx="2"
          fill="var(--muted-foreground)"
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x="72"
            y={92 + i * 12}
            width={60 + i * 12}
            height="6"
            rx="2"
            fill={`hsl(220,${13 + i * 3}%,${88 - i * 4}%)`}
          />
        ))}
        <rect
          x="244"
          y="70"
          width="64"
          height="100"
          rx="6"
          fill="var(--card)"
          stroke="var(--border)"
          strokeWidth="1"
        />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect
            key={i}
            x="252"
            y={80 + i * 14}
            width="48"
            height="5"
            rx="2"
            fill="var(--muted)"
          />
        ))}
      </svg>
    ),

    // ── Sidebar ──────────────────────────────────────────────────────────────
    sidebar: (
      <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
        <rect width="320" height="180" fill="var(--background)" />
        <rect
          width="72"
          height="180"
          fill="var(--card)"
          stroke="var(--border)"
          strokeWidth="1"
        />
        <rect
          x="8"
          y="12"
          width="56"
          height="8"
          rx="3"
          fill="var(--foreground)"
        />
        <rect
          x="8"
          y="30"
          width="4"
          height="4"
          rx="1"
          fill="var(--muted-foreground)"
        />
        <rect
          x="16"
          y="31"
          width="40"
          height="4"
          rx="2"
          fill="var(--muted-foreground)"
        />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i}>
            <rect
              x="8"
              y={44 + i * 16}
              width="4"
              height="4"
              rx="1"
              fill="var(--muted-foreground)"
            />
            <rect
              x="16"
              y={45 + i * 16}
              width={32 - i * 2}
              height="4"
              rx="2"
              fill="var(--muted-foreground)"
            />
          </g>
        ))}
        <rect
          x="80"
          y="12"
          width="120"
          height="8"
          rx="3"
          fill="var(--foreground)"
        />
        <rect
          x="80"
          y="28"
          width="228"
          height="140"
          rx="6"
          fill="var(--card)"
          stroke="var(--border)"
          strokeWidth="1"
        />
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x="92"
            y={40 + i * 20}
            width={140 - i * 20}
            height="5"
            rx="2"
            fill="var(--muted)"
          />
        ))}
      </svg>
    ),

    // ── Data Table ───────────────────────────────────────────────────────────
    "data-table": (
      <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
        <rect width="320" height="180" fill="var(--background)" />
        <rect
          x="16"
          y="12"
          width="288"
          height="156"
          rx="8"
          fill="var(--card)"
          stroke="var(--border)"
          strokeWidth="1"
        />
        {/* header */}
        <rect
          x="16"
          y="12"
          width="288"
          height="24"
          rx="8"
          fill="var(--secondary)"
        />
        <rect x="16" y="28" width="288" height="8" fill="var(--secondary)" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x={28 + i * 56}
            y="20"
            width={44}
            height="5"
            rx="2"
            fill="var(--muted-foreground)"
          />
        ))}
        {/* rows */}
        {[0, 1, 2, 3, 4, 5].map((row) => (
          <g key={row} transform={`translate(0,${36 + row * 22})`}>
            <rect
              x="16"
              width="288"
              height="22"
              fill={row % 2 === 0 ? "var(--card)" : "#fafafa"}
            />
            {[0, 1, 2, 3, 4].map((col) => (
              <rect
                key={col}
                x={28 + col * 56}
                y="8"
                width={col === 0 ? 36 : col === 4 ? 28 : 44}
                height="5"
                rx="2"
                fill={col === 4 ? "var(--muted)" : "var(--border)"}
              />
            ))}
          </g>
        ))}
      </svg>
    ),

    // ── Chart Card ───────────────────────────────────────────────────────────
    "chart-card": (
      <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
        <rect width="320" height="180" fill="var(--background)" />
        {[0, 1].map((row) =>
          [0, 1].map((col) => (
            <g
              key={`${row}-${col}`}
              transform={`translate(${14 + col * 156},${10 + row * 86})`}
            >
              <rect
                width="140"
                height="74"
                rx="6"
                fill="var(--card)"
                stroke="var(--border)"
                strokeWidth="1"
              />
              <rect
                x="10"
                y="10"
                width="60"
                height="5"
                rx="2"
                fill="var(--muted-foreground)"
              />
              <rect
                x="10"
                y="20"
                width="40"
                height="8"
                rx="2"
                fill="var(--foreground)"
              />
              {[0, 1, 2, 3, 4, 5, 6].map((b) => (
                <rect
                  key={b}
                  x={10 + b * 16}
                  y={58 - (b % 3 === 0 ? 20 : b % 3 === 1 ? 28 : 16)}
                  width="10"
                  rx="2"
                  height={b % 3 === 0 ? 20 : b % 3 === 1 ? 28 : 16}
                  fill={b === 5 ? "var(--foreground)" : "var(--muted)"}
                />
              ))}
            </g>
          )),
        )}
      </svg>
    ),

    // ── Settings ─────────────────────────────────────────────────────────────
    settings: (
      <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
        <rect width="320" height="180" fill="var(--background)" />
        {/* left nav */}
        <rect
          x="16"
          y="16"
          width="72"
          height="148"
          rx="8"
          fill="var(--card)"
          stroke="var(--border)"
          strokeWidth="1"
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} transform={`translate(24,${28 + i * 24})`}>
            <rect
              width="56"
              height="16"
              rx="4"
              fill={i === 0 ? "var(--secondary)" : "none"}
            />
            <rect
              x="6"
              y="5"
              width="32"
              height="5"
              rx="2"
              fill={
                i === 0 ? "var(--muted-foreground)" : "var(--muted-foreground)"
              }
            />
          </g>
        ))}
        {/* right panel */}
        <rect
          x="100"
          y="16"
          width="204"
          height="148"
          rx="8"
          fill="var(--card)"
          stroke="var(--border)"
          strokeWidth="1"
        />
        <rect
          x="112"
          y="28"
          width="80"
          height="8"
          rx="3"
          fill="var(--foreground)"
        />
        <rect x="112" y="42" width="180" height="1" fill="var(--muted)" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(112,${52 + i * 24})`}>
            <rect width="120" height="4" rx="2" fill="var(--border)" />
            <rect
              y="9"
              width="180"
              height="12"
              rx="4"
              fill="var(--secondary)"
              stroke="var(--border)"
              strokeWidth="1"
            />
          </g>
        ))}
        {/* toggle */}
        <rect
          x="112"
          y="152"
          width="36"
          height="18"
          rx="9"
          fill="var(--foreground)"
        />
        <circle cx="122" cy="161" r="7" fill="var(--card)" />
        <rect
          x="160"
          y="156"
          width="60"
          height="5"
          rx="2"
          fill="var(--muted-foreground)"
        />
      </svg>
    ),

    // ── User Profile ─────────────────────────────────────────────────────────
    "user-profile": (
      <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
        <rect width="320" height="180" fill="var(--background)" />
        {/* cover */}
        <rect
          x="16"
          y="16"
          width="288"
          height="64"
          rx="8"
          fill="var(--muted)"
        />
        {/* avatar */}
        <circle
          cx="72"
          cy="80"
          r="28"
          fill="var(--secondary)"
          stroke="var(--card)"
          strokeWidth="4"
        />
        <circle cx="72" cy="72" r="14" fill="var(--muted)" />
        <ellipse cx="72" cy="96" rx="20" ry="12" fill="var(--muted)" />
        {/* name */}
        <rect
          x="110"
          y="88"
          width="80"
          height="9"
          rx="3"
          fill="var(--foreground)"
        />
        <rect
          x="110"
          y="102"
          width="60"
          height="5"
          rx="2"
          fill="var(--muted-foreground)"
        />
        {/* stats */}
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${16 + i * 100},114)`}>
            <rect
              width="88"
              height="32"
              rx="6"
              fill="var(--card)"
              stroke="var(--border)"
              strokeWidth="1"
            />
            <rect
              x="10"
              y="8"
              width="32"
              height="8"
              rx="2"
              fill="var(--foreground)"
            />
            <rect
              x="10"
              y="19"
              width="44"
              height="4"
              rx="2"
              fill="var(--muted-foreground)"
            />
          </g>
        ))}
      </svg>
    ),

    // ── Onboarding ───────────────────────────────────────────────────────────
    onboarding: (
      <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
        <rect width="320" height="180" fill="var(--background)" />
        <rect
          x="64"
          y="16"
          width="192"
          height="148"
          rx="12"
          fill="var(--card)"
          stroke="var(--border)"
          strokeWidth="1"
        />
        {/* steps */}
        <rect x="84" y="28" width="176" height="6" rx="3" fill="var(--muted)" />
        <rect
          x="84"
          y="28"
          width="88"
          height="6"
          rx="3"
          fill="var(--foreground)"
        />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${84 + i * 60},26)`}>
            <circle
              cx="8"
              cy="8"
              r="8"
              fill={
                i === 0
                  ? "var(--foreground)"
                  : i === 1
                    ? "var(--border)"
                    : "var(--secondary)"
              }
              stroke={i === 2 ? "var(--muted)" : "none"}
              strokeWidth="1"
            />
            <rect
              x="4"
              y="6"
              width="8"
              height="4"
              rx="1"
              fill={i === 0 ? "var(--card)" : "var(--muted-foreground)"}
            />
          </g>
        ))}
        <rect
          x="84"
          y="52"
          width="128"
          height="9"
          rx="3"
          fill="var(--foreground)"
        />
        <rect
          x="84"
          y="66"
          width="152"
          height="5"
          rx="2"
          fill="var(--muted-foreground)"
        />
        <rect
          x="84"
          y="75"
          width="136"
          height="5"
          rx="2"
          fill="var(--muted-foreground)"
        />
        {[0, 1].map((i) => (
          <g key={i} transform={`translate(84,${92 + i * 28})`}>
            <rect width="152" height="4" rx="2" fill="var(--border)" />
            <rect
              y="7"
              width="152"
              height="16"
              rx="5"
              fill="var(--secondary)"
              stroke="var(--border)"
              strokeWidth="1"
            />
          </g>
        ))}
        <rect
          x="84"
          y="152"
          width="72"
          height="4"
          rx="2"
          fill="var(--muted-foreground)"
        />
        <rect
          x="168"
          y="148"
          width="68"
          height="14"
          rx="7"
          fill="var(--foreground)"
        />
      </svg>
    ),

    // ── Todo List ────────────────────────────────────────────────────────────
    "todo-list": (
      <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
        <rect width="320" height="180" fill="var(--background)" />
        <rect
          x="40"
          y="16"
          width="240"
          height="148"
          rx="10"
          fill="var(--card)"
          stroke="var(--border)"
          strokeWidth="1"
        />
        <rect
          x="56"
          y="28"
          width="80"
          height="8"
          rx="3"
          fill="var(--foreground)"
        />
        <rect
          x="56"
          y="42"
          width="208"
          height="14"
          rx="5"
          fill="var(--secondary)"
        />
        <rect
          x="64"
          y="46"
          width="128"
          height="5"
          rx="2"
          fill="var(--muted-foreground)"
        />
        <rect
          x="240"
          y="44"
          width="16"
          height="9"
          rx="4"
          fill="var(--foreground)"
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} transform={`translate(56,${64 + i * 20})`}>
            <rect
              width="16"
              height="16"
              rx="4"
              fill={i <= 1 ? "var(--foreground)" : "var(--card)"}
              stroke={i <= 1 ? "none" : "var(--border)"}
              strokeWidth="1"
            />
            {i <= 1 && (
              <polyline
                points="3,8 7,12 13,4"
                fill="none"
                stroke="var(--card)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            <rect
              x="24"
              y="5"
              width={80 + i * 8}
              height="5"
              rx="2"
              fill={i <= 1 ? "var(--border)" : "var(--muted-foreground)"}
              opacity={i <= 1 ? 0.6 : 1}
            />
            <rect
              x={116 + i * 8}
              y="4"
              width="28"
              height="7"
              rx="3"
              fill="var(--secondary)"
            />
          </g>
        ))}
      </svg>
    ),

    // ── Product List ─────────────────────────────────────────────────────────
    "product-list": (
      <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
        <rect width="320" height="180" fill="var(--background)" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${14 + i * 76},12)`}>
            <rect
              width="68"
              height="152"
              rx="6"
              fill="var(--card)"
              stroke="var(--border)"
              strokeWidth="1"
            />
            <rect
              x="4"
              y="4"
              width="60"
              height="76"
              rx="4"
              fill="var(--secondary)"
            />
            <rect
              x="8"
              y="88"
              width="52"
              height="5"
              rx="2"
              fill="var(--muted-foreground)"
            />
            <rect
              x="8"
              y="97"
              width="40"
              height="4"
              rx="2"
              fill="var(--muted-foreground)"
            />
            <rect
              x="8"
              y="110"
              width="28"
              height="7"
              rx="2"
              fill="var(--foreground)"
            />
            <rect
              x="8"
              y="124"
              width="52"
              height="14"
              rx="7"
              fill="var(--foreground)"
            />
          </g>
        ))}
      </svg>
    ),

    // ── Product Detail ───────────────────────────────────────────────────────
    "product-detail": (
      <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
        <rect width="320" height="180" fill="var(--background)" />
        {/* image col */}
        <rect
          x="16"
          y="16"
          width="140"
          height="148"
          rx="8"
          fill="var(--secondary)"
        />
        <rect
          x="24"
          y="24"
          width="124"
          height="112"
          rx="6"
          fill="var(--muted)"
        />
        <circle cx="86" cy="80" r="20" fill="var(--border)" opacity="0.6" />
        {/* thumbnails */}
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x={24 + i * 44}
            y="144"
            width="36"
            height="16"
            rx="4"
            fill={i === 0 ? "var(--border)" : "var(--secondary)"}
          />
        ))}
        {/* info col */}
        <rect
          x="168"
          y="16"
          width="136"
          height="148"
          rx="8"
          fill="var(--card)"
          stroke="var(--border)"
          strokeWidth="1"
        />
        <rect
          x="180"
          y="28"
          width="112"
          height="9"
          rx="3"
          fill="var(--foreground)"
        />
        <rect
          x="180"
          y="42"
          width="80"
          height="5"
          rx="2"
          fill="var(--muted-foreground)"
        />
        <rect
          x="180"
          y="52"
          width="60"
          height="10"
          rx="3"
          fill="var(--foreground)"
        />
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(180,${72 + i * 14})`}>
            <rect width="6" height="6" rx="1" fill="var(--muted)" />
            <rect
              x="10"
              y="1"
              width={60 - i * 8}
              height="4"
              rx="2"
              fill="var(--border)"
            />
          </g>
        ))}
        <rect
          x="180"
          y="136"
          width="112"
          height="16"
          rx="8"
          fill="var(--foreground)"
        />
        <rect
          x="180"
          y="156"
          width="112"
          height="4"
          rx="2"
          fill="var(--muted-foreground)"
        />
      </svg>
    ),

    // ── Shopping Cart ────────────────────────────────────────────────────────
    "shopping-cart": (
      <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
        <rect width="320" height="180" fill="var(--background)" />
        {/* cart items col */}
        <rect
          x="16"
          y="16"
          width="176"
          height="148"
          rx="8"
          fill="var(--card)"
          stroke="var(--border)"
          strokeWidth="1"
        />
        <rect
          x="28"
          y="28"
          width="72"
          height="7"
          rx="2"
          fill="var(--foreground)"
        />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(28,${46 + i * 34})`}>
            <rect width="40" height="28" rx="4" fill="var(--secondary)" />
            <rect
              x="48"
              y="4"
              width="80"
              height="5"
              rx="2"
              fill="var(--muted-foreground)"
            />
            <rect
              x="48"
              y="14"
              width="56"
              height="4"
              rx="2"
              fill="var(--muted-foreground)"
            />
            <rect
              x="48"
              y="22"
              width="36"
              height="4"
              rx="2"
              fill="var(--foreground)"
            />
            <rect
              x="136"
              y="10"
              width="16"
              height="8"
              rx="2"
              fill="var(--secondary)"
              stroke="var(--border)"
              strokeWidth="1"
            />
          </g>
        ))}
        {/* summary col */}
        <rect
          x="204"
          y="16"
          width="100"
          height="148"
          rx="8"
          fill="var(--card)"
          stroke="var(--border)"
          strokeWidth="1"
        />
        <rect
          x="216"
          y="28"
          width="76"
          height="6"
          rx="2"
          fill="var(--foreground)"
        />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(216,${44 + i * 18})`}>
            <rect width="48" height="4" rx="2" fill="var(--muted-foreground)" />
            <rect
              x="56"
              y="0"
              width="20"
              height="4"
              rx="2"
              fill="var(--muted-foreground)"
            />
          </g>
        ))}
        <rect x="216" y="104" width="76" height="1" fill="var(--muted)" />
        <rect
          x="216"
          y="112"
          width="48"
          height="5"
          rx="2"
          fill="var(--foreground)"
        />
        <rect
          x="264"
          y="112"
          width="28"
          height="5"
          rx="2"
          fill="var(--foreground)"
        />
        <rect
          x="216"
          y="128"
          width="76"
          height="18"
          rx="9"
          fill="var(--foreground)"
        />
      </svg>
    ),

    // ── Checkout ─────────────────────────────────────────────────────────────
    checkout: (
      <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
        <rect width="320" height="180" fill="var(--background)" />
        <rect
          x="16"
          y="12"
          width="176"
          height="156"
          rx="8"
          fill="var(--card)"
          stroke="var(--border)"
          strokeWidth="1"
        />
        <rect
          x="200"
          y="12"
          width="104"
          height="156"
          rx="8"
          fill="var(--card)"
          stroke="var(--border)"
          strokeWidth="1"
        />
        <rect
          x="28"
          y="24"
          width="80"
          height="7"
          rx="2"
          fill="var(--foreground)"
        />
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(28,${42 + i * 26})`}>
            <rect width="152" height="4" rx="2" fill="var(--border)" />
            <rect
              y="7"
              width="152"
              height="14"
              rx="4"
              fill="var(--secondary)"
              stroke="var(--border)"
              strokeWidth="1"
            />
          </g>
        ))}
        <rect
          x="28"
          y="152"
          width="152"
          height="14"
          rx="7"
          fill="var(--foreground)"
        />
        <rect
          x="212"
          y="24"
          width="80"
          height="7"
          rx="2"
          fill="var(--foreground)"
        />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(212,${42 + i * 28})`}>
            <rect width="40" height="28" rx="4" fill="var(--secondary)" />
            <rect
              x="48"
              y="8"
              width="40"
              height="5"
              rx="2"
              fill="var(--muted-foreground)"
            />
            <rect
              x="48"
              y="17"
              width="28"
              height="3"
              rx="1.5"
              fill="var(--muted-foreground)"
            />
          </g>
        ))}
        <rect x="212" y="136" width="80" height="1" fill="var(--muted)" />
        <rect
          x="212"
          y="144"
          width="80"
          height="7"
          rx="2"
          fill="var(--foreground)"
        />
        <rect
          x="212"
          y="155"
          width="80"
          height="5"
          rx="2"
          fill="var(--muted-foreground)"
        />
      </svg>
    ),

    // ── Reviews ──────────────────────────────────────────────────────────────
    reviews: (
      <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
        <rect width="320" height="180" fill="var(--background)" />
        {/* score panel */}
        <rect
          x="16"
          y="16"
          width="88"
          height="148"
          rx="8"
          fill="var(--card)"
          stroke="var(--border)"
          strokeWidth="1"
        />
        <rect
          x="28"
          y="32"
          width="64"
          height="28"
          rx="4"
          fill="var(--foreground)"
        />
        <rect
          x="36"
          y="38"
          width="48"
          height="16"
          rx="2"
          fill="var(--foreground)"
        />
        <rect
          x="40"
          y="40"
          width="40"
          height="12"
          rx="2"
          fill="var(--card)"
          opacity="0.15"
        />
        <rect
          x="28"
          y="68"
          width="64"
          height="5"
          rx="2"
          fill="var(--muted-foreground)"
        />
        {[0, 1, 2, 3, 4].map((s) => (
          <g key={s} transform={`translate(28,${82 + s * 16})`}>
            <rect width="6" height="6" rx="1" fill="var(--chart-4)" />
            <rect
              x="12"
              y="1"
              width={52 - s * 6}
              height="4"
              rx="2"
              fill="var(--muted)"
            />
            <rect
              x={66 - s * 6}
              y="1"
              width="12"
              height="4"
              rx="2"
              fill="var(--muted-foreground)"
            />
          </g>
        ))}
        {/* review cards */}
        {[0, 1].map((i) => (
          <g key={i} transform={`translate(116,${16 + i * 80})`}>
            <rect
              width="188"
              height="68"
              rx="8"
              fill="var(--card)"
              stroke="var(--border)"
              strokeWidth="1"
            />
            <circle cx="20" cy="20" r="12" fill="var(--muted)" />
            <rect
              x="38"
              y="13"
              width="72"
              height="5"
              rx="2"
              fill="var(--muted-foreground)"
            />
            <rect
              x="38"
              y="22"
              width="52"
              height="4"
              rx="2"
              fill="var(--muted-foreground)"
            />
            {[0, 1, 2, 3, 4].map((s) => (
              <rect
                key={s}
                x={38 + s * 12}
                y="30"
                width="8"
                height="4"
                rx="1"
                fill="var(--chart-4)"
              />
            ))}
            <rect
              x="12"
              y="44"
              width="164"
              height="4"
              rx="2"
              fill="var(--border)"
            />
            <rect
              x="12"
              y="52"
              width="144"
              height="4"
              rx="2"
              fill="var(--muted)"
            />
          </g>
        ))}
      </svg>
    ),

    // ── Product Card ─────────────────────────────────────────────────────────
    "product-card": (
      <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
        <rect width="320" height="180" fill="var(--background)" />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${16 + i * 100},16)`}>
            <rect
              width="88"
              height="148"
              rx="8"
              fill="var(--card)"
              stroke="var(--border)"
              strokeWidth="1"
            />
            <rect
              x="4"
              y="4"
              width="80"
              height="80"
              rx="6"
              fill="var(--secondary)"
            />
            <circle cx="44" cy="44" r="16" fill="var(--muted)" opacity="0.7" />
            <rect
              x="8"
              y="92"
              width="72"
              height="6"
              rx="2"
              fill="var(--muted-foreground)"
            />
            <rect
              x="8"
              y="102"
              width="52"
              height="4"
              rx="2"
              fill="var(--muted-foreground)"
            />
            {[0, 1, 2, 3, 4].map((s) => (
              <rect
                key={s}
                x={8 + s * 10}
                y="112"
                width="7"
                height="4"
                rx="1"
                fill="var(--chart-4)"
              />
            ))}
            <rect
              x="8"
              y="122"
              width="36"
              height="8"
              rx="2"
              fill="var(--foreground)"
            />
            <rect
              x="8"
              y="136"
              width="72"
              height="8"
              rx="4"
              fill="var(--foreground)"
            />
          </g>
        ))}
      </svg>
    ),
  };

  // ── Fallback ───────────────────────────────────────────────────────────────
  const fallback = (
    <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
      <rect width="320" height="180" fill="var(--background)" />
      <rect x="88" y="20" width="144" height="10" rx="4" fill="var(--muted)" />
      <rect x="112" y="36" width="96" height="6" rx="3" fill="var(--muted)" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${16 + i * 100},60)`}>
          <rect
            width="88"
            height="100"
            rx="8"
            fill="var(--card)"
            stroke="var(--border)"
            strokeWidth="1"
          />
          <rect
            x="8"
            y="8"
            width="72"
            height="48"
            rx="4"
            fill="var(--secondary)"
          />
          <rect
            x="8"
            y="64"
            width="56"
            height="5"
            rx="2"
            fill="var(--border)"
          />
          <rect x="8" y="74" width="44" height="4" rx="2" fill="var(--muted)" />
          <rect
            x="8"
            y="84"
            width="72"
            height="10"
            rx="5"
            fill="var(--muted)"
          />
        </g>
      ))}
    </svg>
  );

  return previews[blockType] ?? fallback;
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

  const blocks = mockBlocks.map((section) => {
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
                {/* fade overlay */}
                <div className="absolute -top-36 left-0 right-0 h-36 bg-gradient-to-b from-transparent to-white pointer-events-none" />
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
