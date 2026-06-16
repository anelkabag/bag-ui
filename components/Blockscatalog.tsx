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
          <rect width="320" height="180" fill="#f9fafb"/>
          <rect x="16" y="12" width="28" height="5" rx="2" fill="#d1d5db"/>
          <rect x="224" y="11" width="20" height="7" rx="3" fill="#d1d5db"/>
          <rect x="248" y="11" width="20" height="7" rx="3" fill="#d1d5db"/>
          <rect x="272" y="10" width="32" height="8" rx="4" fill="#111827"/>
          <rect x="120" y="36" width="80" height="9" rx="4.5" fill="#e5e7eb"/>
          <rect x="52" y="52" width="216" height="12" rx="3" fill="#111827"/>
          <rect x="76" y="68" width="168" height="12" rx="3" fill="#111827"/>
          <rect x="80" y="88" width="160" height="6" rx="2" fill="#9ca3af"/>
          <rect x="96" y="98" width="128" height="6" rx="2" fill="#9ca3af"/>
          <rect x="96" y="114" width="56" height="16" rx="8" fill="#111827"/>
          <rect x="160" y="114" width="64" height="16" rx="8" fill="none" stroke="#d1d5db" strokeWidth="1.5"/>
          <rect x="40" y="144" width="240" height="28" rx="6" fill="#e5e7eb"/>
          <rect x="56" y="150" width="60" height="4" rx="2" fill="#d1d5db"/>
          <rect x="56" y="158" width="40" height="4" rx="2" fill="#d1d5db"/>
        </svg>
    ),

    // ── Feature ──────────────────────────────────────────────────────────────
    feature: (
        <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
          <rect width="320" height="180" fill="#f9fafb"/>
          <rect x="96" y="14" width="128" height="9" rx="3" fill="#111827"/>
          <rect x="112" y="27" width="96" height="5" rx="2" fill="#9ca3af"/>
          {[0,1,2,3,4,5].map(i=>(
              <g key={i} transform={`translate(${14+(i%3)*100},${50+Math.floor(i/3)*60})`}>
                <rect width="90" height="52" rx="6" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
                <rect x="8" y="9" width="16" height="16" rx="4" fill="#e5e7eb"/>
                <rect x="32" y="11" width="48" height="5" rx="2" fill="#374151"/>
                <rect x="32" y="20" width="40" height="4" rx="2" fill="#9ca3af"/>
                <rect x="32" y="28" width="44" height="4" rx="2" fill="#9ca3af"/>
                <rect x="8" y="38" width="28" height="6" rx="3" fill="#f3f4f6"/>
              </g>
          ))}
        </svg>
    ),

    // ── Pricing ──────────────────────────────────────────────────────────────
    pricing: (
        <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
          <rect width="320" height="180" fill="#f9fafb"/>
          <rect x="108" y="12" width="104" height="10" rx="3" fill="#111827"/>
          <rect x="120" y="26" width="80" height="5" rx="2" fill="#9ca3af"/>
          {[0,1,2].map(i=>(
              <g key={i} transform={`translate(${14+i*100},46)`}>
                <rect width="88" height="120" rx="8" fill={i===1?"#111827":"#fff"} stroke={i===1?"none":"#e5e7eb"} strokeWidth="1"/>
                <rect x="10" y="12" width="48" height="7" rx="2" fill={i===1?"#fff":"#374151"}/>
                <rect x="10" y="24" width="32" height="4" rx="2" fill="#6b7280"/>
                <rect x="10" y="36" width="40" height="10" rx="2" fill={i===1?"#fff":"#111827"}/>
                {[0,1,2,3].map(r=>(
                    <g key={r} transform={`translate(10,${54+r*12})`}>
                      <rect width="6" height="6" rx="1" fill={i===1?"#4b5563":"#e5e7eb"}/>
                      <rect x="10" y="1" width={40-r*4} height="4" rx="2" fill={i===1?"#6b7280":"#d1d5db"}/>
                    </g>
                ))}
                <rect x="10" y="100" width="68" height="14" rx="7" fill={i===1?"#fff":"#111827"}/>
              </g>
          ))}
        </svg>
    ),

    // ── Testimonial ──────────────────────────────────────────────────────────
    testimonial: (
        <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
          <rect width="320" height="180" fill="#f9fafb"/>
          <rect x="108" y="14" width="104" height="8" rx="3" fill="#111827"/>
          {[0,1,2].map(i=>(
              <g key={i} transform={`translate(${10+i*102},36)`}>
                <rect width="92" height="128" rx="8" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
                <rect x="10" y="14" width="12" height="12" rx="2" fill="#e5e7eb"/>
                <rect x="10" y="32" width="72" height="4" rx="2" fill="#9ca3af"/>
                <rect x="10" y="40" width="64" height="4" rx="2" fill="#9ca3af"/>
                <rect x="10" y="48" width="68" height="4" rx="2" fill="#9ca3af"/>
                <rect x="10" y="56" width="52" height="4" rx="2" fill="#9ca3af"/>
                <circle cx="20" cy="92" r="10" fill="#e5e7eb"/>
                <rect x="36" y="86" width="44" height="5" rx="2" fill="#374151"/>
                <rect x="36" y="95" width="32" height="3" rx="1.5" fill="#9ca3af"/>
                {[0,1,2,3,4].map(s=><rect key={s} x={10+s*11} y="109" width="8" height="4" rx="1" fill="#fbbf24"/>)}
              </g>
          ))}
        </svg>
    ),

    // ── CTA ──────────────────────────────────────────────────────────────────
    cta: (
        <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
          <rect width="320" height="180" fill="#f9fafb"/>
          {[0,1].map(i=>(
              <g key={i} transform={`translate(16,${16+i*84})`}>
                <rect width="288" height="68" rx="10" fill={i===0?"#111827":"#fff"} stroke={i===0?"none":"#e5e7eb"} strokeWidth="1"/>
                <rect x="16" y="14" width="120" height="9" rx="3" fill={i===0?"#fff":"#111827"}/>
                <rect x="16" y="28" width="96" height="5" rx="2" fill={i===0?"#6b7280":"#9ca3af"}/>
                <rect x="192" y="22" width="80" height="22" rx="11" fill={i===0?"#fff":"#111827"}/>
                <rect x="208" y="30" width="48" height="5" rx="2" fill={i===0?"#111827":"#fff"}/>
              </g>
          ))}
        </svg>
    ),

    // ── FAQ ──────────────────────────────────────────────────────────────────
    faq: (
        <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
          <rect width="320" height="180" fill="#f9fafb"/>
          <rect x="88" y="16" width="144" height="9" rx="3" fill="#111827"/>
          <rect x="108" y="29" width="104" height="5" rx="2" fill="#9ca3af"/>
          {[0,1,2,3,4].map(i=>(
              <g key={i} transform={`translate(24,${48+i*26})`}>
                <rect width="272" height="20" rx="5" fill={i===1?"#f3f4f6":"#fff"} stroke="#e5e7eb" strokeWidth="1"/>
                <rect x="10" y="7" width={72+i*10} height="5" rx="2" fill="#374151"/>
                {i===1
                    ? <rect x="10" y="14" width="200" height="3" rx="1.5" fill="#9ca3af"/>
                    : <rect x="250" y="7" width="12" height="5" rx="2" fill="#9ca3af"/>
                }
              </g>
          ))}
        </svg>
    ),

    // ── Navbar ───────────────────────────────────────────────────────────────
    navbar: (
        <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
          <rect width="320" height="180" fill="#f9fafb"/>
          {[0,1,2].map(i=>(
              <g key={i} transform={`translate(0,${16+i*54})`}>
                <rect x="16" y="0" width="288" height="38" rx="8" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
                <rect x="28" y="14" width="32" height="10" rx="3" fill="#111827"/>
                <rect x="100" y="16" width="24" height="6" rx="2" fill="#9ca3af"/>
                <rect x="132" y="16" width="24" height="6" rx="2" fill="#9ca3af"/>
                <rect x="164" y="16" width="24" height="6" rx="2" fill="#9ca3af"/>
                <rect x="196" y="16" width="24" height="6" rx="2" fill="#9ca3af"/>
                <rect x="256" y="13" width="36" height="12" rx="6" fill={i===0?"#111827":"none"} stroke={i===0?"none":"#d1d5db"} strokeWidth="1"/>
              </g>
          ))}
        </svg>
    ),

    // ── Footer ───────────────────────────────────────────────────────────────
    footer: (
        <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
          <rect width="320" height="180" fill="#f9fafb"/>
          <rect x="16" y="12" width="288" height="72" rx="6" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
          <rect x="28" y="24" width="60" height="6" rx="2" fill="#d1d5db"/>
          <rect x="28" y="36" width="232" height="5" rx="2" fill="#e5e7eb"/>
          <rect x="28" y="46" width="200" height="5" rx="2" fill="#e5e7eb"/>
          <rect x="0" y="96" width="320" height="84" fill="#111827"/>
          <rect x="20" y="106" width="44" height="7" rx="3" fill="#fff"/>
          <rect x="20" y="118" width="72" height="3" rx="1.5" fill="#4b5563"/>
          <rect x="20" y="126" width="64" height="3" rx="1.5" fill="#4b5563"/>
          <rect x="20" y="134" width="56" height="3" rx="1.5" fill="#4b5563"/>
          {[1,2,3].map(col=>(
              <g key={col} transform={`translate(${108+col*56},106)`}>
                <rect width="40" height="4" rx="2" fill="#9ca3af"/>
                {[0,1,2,3].map(r=><rect key={r} x="0" y={10+r*9} width="36" height="3" rx="1.5" fill="#4b5563"/>)}
              </g>
          ))}
          <rect x="20" y="168" width="280" height="1" fill="#374151"/>
        </svg>
    ),

    // ── Blog ─────────────────────────────────────────────────────────────────
    blog: (
        <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
          <rect width="320" height="180" fill="#f9fafb"/>
          <rect x="16" y="12" width="180" height="156" rx="8" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
          <rect x="24" y="20" width="164" height="72" rx="5" fill="#f3f4f6"/>
          <rect x="24" y="100" width="60" height="5" rx="2" fill="#9ca3af"/>
          <rect x="24" y="110" width="148" height="8" rx="3" fill="#111827"/>
          <rect x="24" y="122" width="140" height="4" rx="2" fill="#9ca3af"/>
          <rect x="24" y="130" width="120" height="4" rx="2" fill="#9ca3af"/>
          <circle cx="34" cy="150" r="8" fill="#e5e7eb"/>
          <rect x="48" y="146" width="60" height="4" rx="2" fill="#374151"/>
          <rect x="48" y="154" width="44" height="3" rx="1.5" fill="#9ca3af"/>
          {[0,1].map(i=>(
              <g key={i} transform={`translate(204,${12+i*80})`}>
                <rect width="100" height="72" rx="8" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
                <rect x="8" y="8" width="84" height="32" rx="4" fill="#f3f4f6"/>
                <rect x="8" y="46" width="84" height="5" rx="2" fill="#374151"/>
                <rect x="8" y="55" width="68" height="4" rx="2" fill="#9ca3af"/>
              </g>
          ))}
        </svg>
    ),

    // ── Team ─────────────────────────────────────────────────────────────────
    team: (
        <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
          <rect width="320" height="180" fill="#f9fafb"/>
          <rect x="96" y="14" width="128" height="9" rx="3" fill="#111827"/>
          <rect x="112" y="27" width="96" height="5" rx="2" fill="#9ca3af"/>
          {[0,1,2].map(i=>(
              <g key={i} transform={`translate(${16+i*102},50)`}>
                <rect width="88" height="116" rx="8" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
                <circle cx="44" cy="36" r="24" fill="#f3f4f6"/>
                <circle cx="44" cy="28" r="12" fill="#e5e7eb"/>
                <ellipse cx="44" cy="54" rx="20" ry="12" fill="#e5e7eb"/>
                <rect x="12" y="76" width="64" height="7" rx="2" fill="#111827"/>
                <rect x="20" y="88" width="48" height="5" rx="2" fill="#9ca3af"/>
                <rect x="24" y="98" width="40" height="4" rx="2" fill="#d1d5db"/>
                <rect x="28" y="106" width="32" height="4" rx="2" fill="#d1d5db"/>
              </g>
          ))}
        </svg>
    ),

    // ── Stats ────────────────────────────────────────────────────────────────
    stats: (
        <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
          <rect width="320" height="180" fill="#f9fafb"/>
          <rect x="88" y="16" width="144" height="9" rx="3" fill="#111827"/>
          <rect x="112" y="30" width="96" height="5" rx="2" fill="#9ca3af"/>
          {[0,1,2,3].map(i=>(
              <g key={i} transform={`translate(${14+i*76},52)`}>
                <rect width="68" height="104" rx="6" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
                <rect x="10" y="12" width="28" height="4" rx="2" fill="#9ca3af"/>
                <rect x="10" y="21" width="48" height="14" rx="3" fill="#111827"/>
                <rect x="10" y="40" width="36" height="3" rx="1.5" fill="#9ca3af"/>
                <polyline points="10,82 20,70 30,75 42,62 58,66" fill="none" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="8" y="88" width="52" height="8" rx="2" fill="#f3f4f6"/>
              </g>
          ))}
        </svg>
    ),

    // ── Contact ──────────────────────────────────────────────────────────────
    contact: (
        <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
          <rect width="320" height="180" fill="#f9fafb"/>
          <rect x="16" y="20" width="100" height="140" rx="8" fill="#111827"/>
          <rect x="28" y="32" width="60" height="8" rx="3" fill="#fff"/>
          <rect x="28" y="46" width="76" height="4" rx="2" fill="#6b7280"/>
          <rect x="28" y="54" width="68" height="4" rx="2" fill="#6b7280"/>
          {[0,1,2].map(i=>(
              <g key={i} transform={`translate(28,${76+i*22})`}>
                <circle cx="7" cy="7" r="7" fill="#1f2937"/>
                <rect x="20" y="3" width="48" height="4" rx="2" fill="#9ca3af"/>
                <rect x="20" y="10" width="36" height="3" rx="1.5" fill="#6b7280"/>
              </g>
          ))}
          <rect x="128" y="20" width="176" height="140" rx="8" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
          <rect x="140" y="32" width="80" height="7" rx="2" fill="#111827"/>
          {[0,1,2,3].map(i=>(
              <g key={i} transform={`translate(140,${50+i*24})`}>
                <rect width="152" height="4" rx="2" fill="#d1d5db"/>
                <rect y="7" width="152" height="12" rx="4" fill="#f3f4f6" stroke="#e5e7eb" strokeWidth="1"/>
              </g>
          ))}
          <rect x="140" y="150" width="60" height="14" rx="7" fill="#111827"/>
        </svg>
    ),

    // ── Gallery ──────────────────────────────────────────────────────────────
    gallery: (
        <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
          <rect width="320" height="180" fill="#f9fafb"/>
          <rect x="12" y="12" width="88" height="80" rx="6" fill="#e5e7eb"/>
          <rect x="12" y="100" width="88" height="68" rx="6" fill="#d1d5db"/>
          <rect x="108" y="12" width="88" height="52" rx="6" fill="#d1d5db"/>
          <rect x="108" y="72" width="88" height="96" rx="6" fill="#e5e7eb"/>
          <rect x="204" y="12" width="104" height="100" rx="6" fill="#e5e7eb"/>
          <rect x="204" y="120" width="104" height="48" rx="6" fill="#d1d5db"/>
          <circle cx="56" cy="52" r="12" fill="#c4c4c4" opacity="0.5"/>
          <circle cx="152" cy="38" r="10" fill="#c4c4c4" opacity="0.5"/>
          <circle cx="256" cy="62" r="14" fill="#c4c4c4" opacity="0.5"/>
        </svg>
    ),

    // ── Logos ────────────────────────────────────────────────────────────────
    logos: (
        <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
          <rect width="320" height="180" fill="#f9fafb"/>
          <rect x="88" y="20" width="144" height="8" rx="3" fill="#111827"/>
          <rect x="112" y="33" width="96" height="5" rx="2" fill="#9ca3af"/>
          {/* logo row 1 */}
          {[0,1,2,3,4].map(i=>(
              <g key={i} transform={`translate(${16+i*60},56)`}>
                <rect width="52" height="28" rx="6" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
                <rect x="8" y="8" width="36" height="12" rx="3" fill="#e5e7eb"/>
              </g>
          ))}
          {/* logo row 2 — marquee style */}
          {[0,1,2,3,4].map(i=>(
              <g key={i} transform={`translate(${16+i*60},100)`}>
                <rect width="52" height="28" rx="6" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
                <rect x="10" y="9" width="32" height="10" rx="3" fill="#f3f4f6"/>
              </g>
          ))}
          <rect x="16" y="148" width="288" height="1" fill="#e5e7eb"/>
          <rect x="88" y="158" width="144" height="5" rx="2" fill="#e5e7eb"/>
        </svg>
    ),

    // ── Banner ───────────────────────────────────────────────────────────────
    banner: (
        <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
          <rect width="320" height="180" fill="#f9fafb"/>
          {/* top announcement bar */}
          <rect x="0" y="12" width="320" height="28" fill="#111827"/>
          <rect x="108" y="20" width="104" height="5" rx="2" fill="#9ca3af"/>
          <rect x="252" y="19" width="28" height="7" rx="3" fill="#374151"/>
          <rect x="40" y="19" width="6" height="6" rx="1" fill="#6b7280"/>
          {/* promo banner */}
          <rect x="16" y="56" width="288" height="64" rx="10" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
          <rect x="28" y="68" width="80" height="8" rx="3" fill="#111827"/>
          <rect x="28" y="81" width="120" height="5" rx="2" fill="#9ca3af"/>
          <rect x="28" y="90" width="96" height="5" rx="2" fill="#9ca3af"/>
          <rect x="196" y="68" width="96" height="40" rx="8" fill="#f3f4f6"/>
          <rect x="208" y="80" width="72" height="5" rx="2" fill="#e5e7eb"/>
          <rect x="208" y="90" width="56" height="5" rx="2" fill="#e5e7eb"/>
          {/* thin bar */}
          <rect x="16" y="136" width="288" height="20" rx="6" fill="#111827"/>
          <rect x="28" y="142" width="120" height="5" rx="2" fill="#6b7280"/>
          <rect x="220" y="140" width="56" height="10" rx="5" fill="#374151"/>
        </svg>
    ),

    // ── SignUp ──────────────────────────────────────────────────────────────
    signup: (
        <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
          <rect width="320" height="180" fill="#f9fafb"/>
          {/* left promo col */}
          <rect x="16" y="16" width="128" height="148" rx="8" fill="#111827"/>
          <rect x="28" y="28" width="72" height="9" rx="3" fill="#fff"/>
          <rect x="28" y="43" width="96" height="4" rx="2" fill="#6b7280"/>
          <rect x="28" y="51" width="88" height="4" rx="2" fill="#6b7280"/>
          {[0,1,2].map(i=>(
              <g key={i} transform={`translate(28,${72+i*20})`}>
                <circle cx="6" cy="6" r="6" fill="#1f2937"/>
                <rect x="18" y="3" width="64" height="4" rx="2" fill="#9ca3af"/>
              </g>
          ))}
          <rect x="28" y="144" width="96" height="12" rx="6" fill="#374151"/>
          {/* right form col */}
          <rect x="160" y="16" width="144" height="148" rx="8" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
          <rect x="172" y="28" width="80" height="8" rx="3" fill="#111827"/>
          <rect x="172" y="42" width="120" height="5" rx="2" fill="#9ca3af"/>
          {[0,1,2].map(i=>(
              <g key={i} transform={`translate(172,${58+i*26})`}>
                <rect width="120" height="4" rx="2" fill="#d1d5db"/>
                <rect y="7" width="120" height="14" rx="4" fill="#f3f4f6" stroke="#e5e7eb" strokeWidth="1"/>
              </g>
          ))}
          <rect x="172" y="144" width="120" height="14" rx="7" fill="#111827"/>
        </svg>
    ),

    // ── Dashboard ────────────────────────────────────────────────────────────
    dashboard: (
        <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
          <rect width="320" height="180" fill="#f9fafb"/>
          <rect x="0" y="0" width="56" height="180" fill="#f3f4f6"/>
          <rect x="8" y="12" width="40" height="8" rx="4" fill="#d1d5db"/>
          {[0,1,2,3,4].map(i=>(
              <g key={i}>
                <rect x="8" y={30+i*20} width="40" height="7" rx="3.5" fill={i===0?"#e5e7eb":"none"}/>
                <rect x="12" y={32+i*20} width="24" height="4" rx="2" fill={i===0?"#374151":"#9ca3af"}/>
              </g>
          ))}
          <rect x="64" y="12" width="80" height="7" rx="2" fill="#111827"/>
          {[0,1,2,3].map(i=>(
              <g key={i} transform={`translate(${64+i*65},28)`}>
                <rect width="58" height="32" rx="5" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
                <rect x="6" y="7" width="24" height="4" rx="2" fill="#9ca3af"/>
                <rect x="6" y="16" width="32" height="6" rx="2" fill="#111827"/>
              </g>
          ))}
          <rect x="64" y="70" width="172" height="100" rx="6" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
          <rect x="72" y="78" width="60" height="5" rx="2" fill="#374151"/>
          {[0,1,2,3,4].map(i=>(
              <rect key={i} x="72" y={92+i*12} width={60+i*12} height="6" rx="2" fill={`hsl(220,${13+i*3}%,${88-i*4}%)`}/>
          ))}
          <rect x="244" y="70" width="64" height="100" rx="6" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
          {[0,1,2,3,4,5].map(i=>(
              <rect key={i} x="252" y={80+i*14} width="48" height="5" rx="2" fill="#e5e7eb"/>
          ))}
        </svg>
    ),

    // ── Sidebar ──────────────────────────────────────────────────────────────
    sidebar: (
        <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
          <rect width="320" height="180" fill="#f9fafb"/>
          <rect width="72" height="180" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
          <rect x="8" y="12" width="56" height="8" rx="3" fill="#111827"/>
          <rect x="8" y="30" width="4" height="4" rx="1" fill="#374151"/>
          <rect x="16" y="31" width="40" height="4" rx="2" fill="#374151"/>
          {[0,1,2,3,4,5].map(i=>(
              <g key={i}>
                <rect x="8" y={44+i*16} width="4" height="4" rx="1" fill="#9ca3af"/>
                <rect x="16" y={45+i*16} width={32-i*2} height="4" rx="2" fill="#9ca3af"/>
              </g>
          ))}
          <rect x="80" y="12" width="120" height="8" rx="3" fill="#111827"/>
          <rect x="80" y="28" width="228" height="140" rx="6" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
          {[0,1,2].map(i=>(
              <rect key={i} x="92" y={40+i*20} width={140-i*20} height="5" rx="2" fill="#e5e7eb"/>
          ))}
        </svg>
    ),

    // ── Data Table ───────────────────────────────────────────────────────────
    "data-table": (
        <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
          <rect width="320" height="180" fill="#f9fafb"/>
          <rect x="16" y="12" width="288" height="156" rx="8" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
          {/* header */}
          <rect x="16" y="12" width="288" height="24" rx="8" fill="#f3f4f6"/>
          <rect x="16" y="28" width="288" height="8" fill="#f3f4f6"/>
          {[0,1,2,3,4].map(i=>(
              <rect key={i} x={28+i*56} y="20" width={44} height="5" rx="2" fill="#9ca3af"/>
          ))}
          {/* rows */}
          {[0,1,2,3,4,5].map(row=>(
              <g key={row} transform={`translate(0,${36+row*22})`}>
                <rect x="16" width="288" height="22" fill={row%2===0?"#fff":"#fafafa"}/>
                {[0,1,2,3,4].map(col=>(
                    <rect key={col} x={28+col*56} y="8" width={col===0?36:col===4?28:44} height="5" rx="2" fill={col===4?"#e5e7eb":"#d1d5db"}/>
                ))}
              </g>
          ))}
        </svg>
    ),

    // ── Chart Card ───────────────────────────────────────────────────────────
    "chart-card": (
        <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
          <rect width="320" height="180" fill="#f9fafb"/>
          {[0,1].map(row=>[0,1].map(col=>(
              <g key={`${row}-${col}`} transform={`translate(${14+col*156},${10+row*86})`}>
                <rect width="140" height="74" rx="6" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
                <rect x="10" y="10" width="60" height="5" rx="2" fill="#374151"/>
                <rect x="10" y="20" width="40" height="8" rx="2" fill="#111827"/>
                {[0,1,2,3,4,5,6].map(b=>(
                    <rect key={b} x={10+b*16} y={58-(b%3===0?20:b%3===1?28:16)} width="10" rx="2"
                          height={b%3===0?20:b%3===1?28:16}
                          fill={b===5?"#111827":"#e5e7eb"}/>
                ))}
              </g>
          )))}
        </svg>
    ),

    // ── Settings ─────────────────────────────────────────────────────────────
    settings: (
        <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
          <rect width="320" height="180" fill="#f9fafb"/>
          {/* left nav */}
          <rect x="16" y="16" width="72" height="148" rx="8" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
          {[0,1,2,3,4].map(i=>(
              <g key={i} transform={`translate(24,${28+i*24})`}>
                <rect width="56" height="16" rx="4" fill={i===0?"#f3f4f6":"none"}/>
                <rect x="6" y="5" width="32" height="5" rx="2" fill={i===0?"#374151":"#9ca3af"}/>
              </g>
          ))}
          {/* right panel */}
          <rect x="100" y="16" width="204" height="148" rx="8" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
          <rect x="112" y="28" width="80" height="8" rx="3" fill="#111827"/>
          <rect x="112" y="42" width="180" height="1" fill="#e5e7eb"/>
          {[0,1,2,3].map(i=>(
              <g key={i} transform={`translate(112,${52+i*24})`}>
                <rect width="120" height="4" rx="2" fill="#d1d5db"/>
                <rect y="9" width="180" height="12" rx="4" fill="#f3f4f6" stroke="#e5e7eb" strokeWidth="1"/>
              </g>
          ))}
          {/* toggle */}
          <rect x="112" y="152" width="36" height="18" rx="9" fill="#111827"/>
          <circle cx="122" cy="161" r="7" fill="#fff"/>
          <rect x="160" y="156" width="60" height="5" rx="2" fill="#374151"/>
        </svg>
    ),

    // ── User Profile ─────────────────────────────────────────────────────────
    "user-profile": (
        <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
          <rect width="320" height="180" fill="#f9fafb"/>
          {/* cover */}
          <rect x="16" y="16" width="288" height="64" rx="8" fill="#e5e7eb"/>
          {/* avatar */}
          <circle cx="72" cy="80" r="28" fill="#f3f4f6" stroke="#fff" strokeWidth="4"/>
          <circle cx="72" cy="72" r="14" fill="#e5e7eb"/>
          <ellipse cx="72" cy="96" rx="20" ry="12" fill="#e5e7eb"/>
          {/* name */}
          <rect x="110" y="88" width="80" height="9" rx="3" fill="#111827"/>
          <rect x="110" y="102" width="60" height="5" rx="2" fill="#9ca3af"/>
          {/* stats */}
          {[0,1,2].map(i=>(
              <g key={i} transform={`translate(${16+i*100},114)`}>
                <rect width="88" height="32" rx="6" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
                <rect x="10" y="8" width="32" height="8" rx="2" fill="#111827"/>
                <rect x="10" y="19" width="44" height="4" rx="2" fill="#9ca3af"/>
              </g>
          ))}
        </svg>
    ),

    // ── Onboarding ───────────────────────────────────────────────────────────
    onboarding: (
        <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
          <rect width="320" height="180" fill="#f9fafb"/>
          <rect x="64" y="16" width="192" height="148" rx="12" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
          {/* steps */}
          <rect x="84" y="28" width="176" height="6" rx="3" fill="#e5e7eb"/>
          <rect x="84" y="28" width="88" height="6" rx="3" fill="#111827"/>
          {[0,1,2].map(i=>(
              <g key={i} transform={`translate(${84+i*60},26)`}>
                <circle cx="8" cy="8" r="8" fill={i===0?"#111827":i===1?"#d1d5db":"#f3f4f6"} stroke={i===2?"#e5e7eb":"none"} strokeWidth="1"/>
                <rect x="4" y="6" width="8" height="4" rx="1" fill={i===0?"#fff":"#9ca3af"}/>
              </g>
          ))}
          <rect x="84" y="52" width="128" height="9" rx="3" fill="#111827"/>
          <rect x="84" y="66" width="152" height="5" rx="2" fill="#9ca3af"/>
          <rect x="84" y="75" width="136" height="5" rx="2" fill="#9ca3af"/>
          {[0,1].map(i=>(
              <g key={i} transform={`translate(84,${92+i*28})`}>
                <rect width="152" height="4" rx="2" fill="#d1d5db"/>
                <rect y="7" width="152" height="16" rx="5" fill="#f3f4f6" stroke="#e5e7eb" strokeWidth="1"/>
              </g>
          ))}
          <rect x="84" y="152" width="72" height="4" rx="2" fill="#9ca3af"/>
          <rect x="168" y="148" width="68" height="14" rx="7" fill="#111827"/>
        </svg>
    ),

    // ── Todo List ────────────────────────────────────────────────────────────
    "todo-list": (
        <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
          <rect width="320" height="180" fill="#f9fafb"/>
          <rect x="40" y="16" width="240" height="148" rx="10" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
          <rect x="56" y="28" width="80" height="8" rx="3" fill="#111827"/>
          <rect x="56" y="42" width="208" height="14" rx="5" fill="#f3f4f6"/>
          <rect x="64" y="46" width="128" height="5" rx="2" fill="#9ca3af"/>
          <rect x="240" y="44" width="16" height="9" rx="4" fill="#111827"/>
          {[0,1,2,3,4].map(i=>(
              <g key={i} transform={`translate(56,${64+i*20})`}>
                <rect width="16" height="16" rx="4" fill={i<=1?"#111827":"#fff"} stroke={i<=1?"none":"#d1d5db"} strokeWidth="1"/>
                {i<=1 && <polyline points="3,8 7,12 13,4" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>}
                <rect x="24" y="5" width={80+i*8} height="5" rx="2" fill={i<=1?"#d1d5db":"#374151"} opacity={i<=1?0.6:1}/>
                <rect x={116+i*8} y="4" width="28" height="7" rx="3" fill="#f3f4f6"/>
              </g>
          ))}
        </svg>
    ),

    // ── Product List ─────────────────────────────────────────────────────────
    "product-list": (
        <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
          <rect width="320" height="180" fill="#f9fafb"/>
          {[0,1,2,3].map(i=>(
              <g key={i} transform={`translate(${14+i*76},12)`}>
                <rect width="68" height="152" rx="6" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
                <rect x="4" y="4" width="60" height="76" rx="4" fill="#f3f4f6"/>
                <rect x="8" y="88" width="52" height="5" rx="2" fill="#374151"/>
                <rect x="8" y="97" width="40" height="4" rx="2" fill="#9ca3af"/>
                <rect x="8" y="110" width="28" height="7" rx="2" fill="#111827"/>
                <rect x="8" y="124" width="52" height="14" rx="7" fill="#111827"/>
              </g>
          ))}
        </svg>
    ),

    // ── Product Detail ───────────────────────────────────────────────────────
    "product-detail": (
        <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
          <rect width="320" height="180" fill="#f9fafb"/>
          {/* image col */}
          <rect x="16" y="16" width="140" height="148" rx="8" fill="#f3f4f6"/>
          <rect x="24" y="24" width="124" height="112" rx="6" fill="#e5e7eb"/>
          <circle cx="86" cy="80" r="20" fill="#d1d5db" opacity="0.6"/>
          {/* thumbnails */}
          {[0,1,2].map(i=>(
              <rect key={i} x={24+i*44} y="144" width="36" height="16" rx="4" fill={i===0?"#d1d5db":"#ececec"}/>
          ))}
          {/* info col */}
          <rect x="168" y="16" width="136" height="148" rx="8" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
          <rect x="180" y="28" width="112" height="9" rx="3" fill="#111827"/>
          <rect x="180" y="42" width="80" height="5" rx="2" fill="#9ca3af"/>
          <rect x="180" y="52" width="60" height="10" rx="3" fill="#111827"/>
          {[0,1,2,3].map(i=>(
              <g key={i} transform={`translate(180,${72+i*14})`}>
                <rect width="6" height="6" rx="1" fill="#e5e7eb"/>
                <rect x="10" y="1" width={60-i*8} height="4" rx="2" fill="#d1d5db"/>
              </g>
          ))}
          <rect x="180" y="136" width="112" height="16" rx="8" fill="#111827"/>
          <rect x="180" y="156" width="112" height="4" rx="2" fill="#9ca3af"/>
        </svg>
    ),

    // ── Shopping Cart ────────────────────────────────────────────────────────
    "shopping-cart": (
        <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
          <rect width="320" height="180" fill="#f9fafb"/>
          {/* cart items col */}
          <rect x="16" y="16" width="176" height="148" rx="8" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
          <rect x="28" y="28" width="72" height="7" rx="2" fill="#111827"/>
          {[0,1,2].map(i=>(
              <g key={i} transform={`translate(28,${46+i*34})`}>
                <rect width="40" height="28" rx="4" fill="#f3f4f6"/>
                <rect x="48" y="4" width="80" height="5" rx="2" fill="#374151"/>
                <rect x="48" y="14" width="56" height="4" rx="2" fill="#9ca3af"/>
                <rect x="48" y="22" width="36" height="4" rx="2" fill="#111827"/>
                <rect x="136" y="10" width="16" height="8" rx="2" fill="#f3f4f6" stroke="#e5e7eb" strokeWidth="1"/>
              </g>
          ))}
          {/* summary col */}
          <rect x="204" y="16" width="100" height="148" rx="8" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
          <rect x="216" y="28" width="76" height="6" rx="2" fill="#111827"/>
          {[0,1,2].map(i=>(
              <g key={i} transform={`translate(216,${44+i*18})`}>
                <rect width="48" height="4" rx="2" fill="#9ca3af"/>
                <rect x="56" y="0" width="20" height="4" rx="2" fill="#374151"/>
              </g>
          ))}
          <rect x="216" y="104" width="76" height="1" fill="#e5e7eb"/>
          <rect x="216" y="112" width="48" height="5" rx="2" fill="#111827"/>
          <rect x="264" y="112" width="28" height="5" rx="2" fill="#111827"/>
          <rect x="216" y="128" width="76" height="18" rx="9" fill="#111827"/>
        </svg>
    ),

    // ── Checkout ─────────────────────────────────────────────────────────────
    checkout: (
        <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
          <rect width="320" height="180" fill="#f9fafb"/>
          <rect x="16" y="12" width="176" height="156" rx="8" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
          <rect x="200" y="12" width="104" height="156" rx="8" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
          <rect x="28" y="24" width="80" height="7" rx="2" fill="#111827"/>
          {[0,1,2,3].map(i=>(
              <g key={i} transform={`translate(28,${42+i*26})`}>
                <rect width="152" height="4" rx="2" fill="#d1d5db"/>
                <rect y="7" width="152" height="14" rx="4" fill="#f3f4f6" stroke="#e5e7eb" strokeWidth="1"/>
              </g>
          ))}
          <rect x="28" y="152" width="152" height="14" rx="7" fill="#111827"/>
          <rect x="212" y="24" width="80" height="7" rx="2" fill="#111827"/>
          {[0,1,2].map(i=>(
              <g key={i} transform={`translate(212,${42+i*28})`}>
                <rect width="40" height="28" rx="4" fill="#f3f4f6"/>
                <rect x="48" y="8" width="40" height="5" rx="2" fill="#374151"/>
                <rect x="48" y="17" width="28" height="3" rx="1.5" fill="#9ca3af"/>
              </g>
          ))}
          <rect x="212" y="136" width="80" height="1" fill="#e5e7eb"/>
          <rect x="212" y="144" width="80" height="7" rx="2" fill="#111827"/>
          <rect x="212" y="155" width="80" height="5" rx="2" fill="#9ca3af"/>
        </svg>
    ),

    // ── Reviews ──────────────────────────────────────────────────────────────
    reviews: (
        <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
          <rect width="320" height="180" fill="#f9fafb"/>
          {/* score panel */}
          <rect x="16" y="16" width="88" height="148" rx="8" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
          <rect x="28" y="32" width="64" height="28" rx="4" fill="#111827"/>
          <rect x="36" y="38" width="48" height="16" rx="2" fill="#111827"/>
          <rect x="40" y="40" width="40" height="12" rx="2" fill="#fff" opacity="0.15"/>
          <rect x="28" y="68" width="64" height="5" rx="2" fill="#9ca3af"/>
          {[0,1,2,3,4].map(s=>(
              <g key={s} transform={`translate(28,${82+s*16})`}>
                <rect width="6" height="6" rx="1" fill="#fbbf24"/>
                <rect x="12" y="1" width={52-s*6} height="4" rx="2" fill="#e5e7eb"/>
                <rect x={66-s*6} y="1" width="12" height="4" rx="2" fill="#9ca3af"/>
              </g>
          ))}
          {/* review cards */}
          {[0,1].map(i=>(
              <g key={i} transform={`translate(116,${16+i*80})`}>
                <rect width="188" height="68" rx="8" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
                <circle cx="20" cy="20" r="12" fill="#e5e7eb"/>
                <rect x="38" y="13" width="72" height="5" rx="2" fill="#374151"/>
                <rect x="38" y="22" width="52" height="4" rx="2" fill="#9ca3af"/>
                {[0,1,2,3,4].map(s=><rect key={s} x={38+s*12} y="30" width="8" height="4" rx="1" fill="#fbbf24"/>)}
                <rect x="12" y="44" width="164" height="4" rx="2" fill="#d1d5db"/>
                <rect x="12" y="52" width="144" height="4" rx="2" fill="#e5e7eb"/>
              </g>
          ))}
        </svg>
    ),

    // ── Product Card ─────────────────────────────────────────────────────────
    "product-card": (
        <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
          <rect width="320" height="180" fill="#f9fafb"/>
          {[0,1,2].map(i=>(
              <g key={i} transform={`translate(${16+i*100},16)`}>
                <rect width="88" height="148" rx="8" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
                <rect x="4" y="4" width="80" height="80" rx="6" fill="#f3f4f6"/>
                <circle cx="44" cy="44" r="16" fill="#e5e7eb" opacity="0.7"/>
                <rect x="8" y="92" width="72" height="6" rx="2" fill="#374151"/>
                <rect x="8" y="102" width="52" height="4" rx="2" fill="#9ca3af"/>
                {[0,1,2,3,4].map(s=><rect key={s} x={8+s*10} y="112" width="7" height="4" rx="1" fill="#fbbf24"/>)}
                <rect x="8" y="122" width="36" height="8" rx="2" fill="#111827"/>
                <rect x="8" y="136" width="72" height="8" rx="4" fill="#111827"/>
              </g>
          ))}
        </svg>
    ),
  };

  // ── Fallback ───────────────────────────────────────────────────────────────
  const fallback = (
      <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
        <rect width="320" height="180" fill="#f9fafb"/>
        <rect x="88" y="20" width="144" height="10" rx="4" fill="#e5e7eb"/>
        <rect x="112" y="36" width="96" height="6" rx="3" fill="#e5e7eb"/>
        {[0,1,2].map(i=>(
            <g key={i} transform={`translate(${16+i*100},60)`}>
              <rect width="88" height="100" rx="8" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
              <rect x="8" y="8" width="72" height="48" rx="4" fill="#f3f4f6"/>
              <rect x="8" y="64" width="56" height="5" rx="2" fill="#d1d5db"/>
              <rect x="8" y="74" width="44" height="4" rx="2" fill="#e5e7eb"/>
              <rect x="8" y="84" width="72" height="10" rx="5" fill="#e5e7eb"/>
            </g>
        ))}
      </svg>
  );

  return previews[blockType] ?? fallback;
}

// ─── Block Card ───────────────────────────────────────────────────────────────
function BlockCard({ block, index }: { block: SectionBlock; index: number }) {
  const cardContent = (
      <div
          className={`bg-white rounded-2xl overflow-hidden border border-[#f0f0f0] shadow-sm transition-all duration-300 h-full flex flex-col ${
              block.available ? "hover:shadow-lg" : "opacity-80"
          }`}
      >
        {/* Preview Area */}
        <div className="aspect-video bg-gray-50 overflow-hidden relative">
          <BlockPreview blockType={block.slug} />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        </div>

        {/* Content Area */}
        <div className="flex-1 p-5 flex flex-col">
          <h3 className="text-lg font-bold text-slate-950 mb-1">{block.title}</h3>
          <p className="text-sm text-slate-500 mb-4 flex-1">{block.description}</p>

          {/* Block count + arrow */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-xs font-semibold uppercase tracking-wider">
            {block.available ? (
                <span className="text-slate-400">
                {block.count} block{block.count > 1 ? "s" : ""}
              </span>
            ) : (
                <span className="text-black/80">Coming Soon</span>
            )}
          </span>
            <ArrowUpRight
                size={16}
                className={`transition-colors ${
                    block.available
                        ? "text-slate-400 group-hover:text-slate-900"
                        : "text-slate-300"
                }`}
            />
          </div>
        </div>
      </div>
  );

  return (
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
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
  const hiddenCount = blocks.length - INITIAL_COUNT;

  return (
      <div className=" w-full border-t border-gray-200">
        <section className="px-6 md:px-12 lg:px-16">
          <div className="max-w-7xl mx-auto px-6 border-x border-gray-200 py-16 md:py-20">
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
              <Link
                  href="/blocks"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-950 hover:text-slate-700 transition-colors whitespace-nowrap"
              >
                See all blocks <ArrowUpRight size={16} className="mt-0.5" />
              </Link>
            </div>

            {/* Grid */}
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleBlocks.map((block, index) => (
                    <BlockCard key={block.slug} block={block} index={index} />
                ))}
              </div>

              {/* Show more */}
              {!showAll && (
                  <div className="relative mt-0">
                    {/* fade overlay */}
                    <div className="absolute -top-36 left-0 right-0 h-36 bg-gradient-to-b from-transparent to-white pointer-events-none" />
                    <div className="flex flex-col items-center gap-2 pt-8">
                      <button
                          onClick={() => setShowAll(true)}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white text-sm font-semibold hover:bg-gray-800 transition-all shadow-sm hover:shadow-md cursor-pointer"
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
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 text-sm font-medium text-gray-500 hover:text-black hover:border-gray-400 transition-colors"
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