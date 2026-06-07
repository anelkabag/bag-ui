"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/footer";

// ─── Types ────────────────────────────────────────────────────────────────────
type FilterType = "all" | "marketing" | "app" | "ecommerce";

// ─── Nav ──────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Blocks",    href: "/blocks" },
  { label: "Templates", href: "/templates" },
  { label: "Pricing",   href: "/pricing" },
  { label: "Docs",      href: "/docs" },
] as const;

// ─── Block catalog data ───────────────────────────────────────────────────────
const MARKETING_BLOCKS = [
  { id: "hero",        label: "Hero",        count: 12, pro: true,  new: true  },
  { id: "feature",     label: "Feature",     count: 8,  pro: false, new: false },
  { id: "pricing",     label: "Pricing",     count: 6,  pro: true,  new: true  },
  { id: "testimonial", label: "Testimonial", count: 5,  pro: false, new: false },
  { id: "cta",         label: "CTA",         count: 7,  pro: false, new: false },
  { id: "faq",         label: "FAQ",         count: 4,  pro: false, new: false },
  { id: "navbar",      label: "Navbar",      count: 3,  pro: true,  new: false },
  { id: "footer",      label: "Footer",      count: 5,  pro: false, new: false },
  { id: "blog",        label: "Blog",        count: 4,  pro: true,  new: false },
  { id: "team",        label: "Team",        count: 3,  pro: false, new: false },
  { id: "stats",       label: "Stats",       count: 4,  pro: false, new: false },
  { id: "contact",     label: "Contact",     count: 3,  pro: false, new: true  },
  { id: "gallery",     label: "Gallery",     count: 5,  pro: true,  new: false },
  { id: "logos",       label: "Logos",       count: 4,  pro: false, new: false },
  { id: "banner",      label: "Banner",      count: 3,  pro: false, new: false },
  { id: "signup",      label: "Sign Up",     count: 4,  pro: true,  new: false },
];

const APP_BLOCKS = [
  { id: "dashboard",    label: "Dashboard",    count: 6,  pro: true,  new: false },
  { id: "sidebar",      label: "Sidebar",      count: 5,  pro: false, new: false },
  { id: "data-table",   label: "Data Table",   count: 4,  pro: true,  new: false },
  { id: "chart-card",   label: "Chart Card",   count: 6,  pro: true,  new: true  },
  { id: "settings",     label: "Settings",     count: 3,  pro: false, new: false },
  { id: "user-profile", label: "User Profile", count: 4,  pro: false, new: false },
  { id: "onboarding",   label: "Onboarding",   count: 2,  pro: true,  new: false },
  { id: "todo-list",    label: "Todo List",    count: 3,  pro: false, new: false },
];

const ECOMMERCE_BLOCKS = [
  { id: "product-list",   label: "Product List",   count: 5,  pro: true,  new: false },
  { id: "product-detail", label: "Product Detail", count: 4,  pro: true,  new: false },
  { id: "shopping-cart",  label: "Shopping Cart",  count: 4,  pro: false, new: false },
  { id: "checkout",       label: "Checkout",       count: 3,  pro: true,  new: false },
  { id: "reviews",        label: "Reviews",        count: 3,  pro: false, new: true  },
  { id: "product-card",   label: "Product Card",   count: 5,  pro: false, new: false },
];

// Preview thumbnails — geometric placeholder patterns per block type
const PREVIEW_PATTERNS: Record<string, string> = {
  hero:           "bg-gradient-to-br from-gray-50 to-gray-100",
  feature:        "bg-gradient-to-br from-gray-50 to-gray-100",
  pricing:        "bg-gradient-to-br from-gray-50 to-gray-100",
  testimonial:    "bg-gradient-to-br from-gray-50 to-gray-100",
  cta:            "bg-gradient-to-br from-gray-50 to-gray-100",
  faq:            "bg-gradient-to-br from-gray-50 to-gray-100",
  navbar:         "bg-gradient-to-br from-gray-50 to-gray-100",
  footer:         "bg-gradient-to-br from-gray-50 to-gray-100",
  blog:           "bg-gradient-to-br from-gray-50 to-gray-100",
  team:           "bg-gradient-to-br from-gray-50 to-gray-100",
  stats:          "bg-gradient-to-br from-gray-50 to-gray-100",
  contact:        "bg-gradient-to-br from-gray-50 to-gray-100",
  gallery:        "bg-gradient-to-br from-gray-50 to-gray-100",
  logos:          "bg-gradient-to-br from-gray-50 to-gray-100",
  banner:         "bg-gradient-to-br from-gray-50 to-gray-100",
  signup:         "bg-gradient-to-br from-gray-50 to-gray-100",
  dashboard:      "bg-gradient-to-br from-gray-50 to-gray-100",
  sidebar:        "bg-gradient-to-br from-gray-50 to-gray-100",
  "data-table":   "bg-gradient-to-br from-gray-50 to-gray-100",
  "chart-card":   "bg-gradient-to-br from-gray-50 to-gray-100",
  settings:       "bg-gradient-to-br from-gray-50 to-gray-100",
  "user-profile": "bg-gradient-to-br from-gray-50 to-gray-100",
  onboarding:     "bg-gradient-to-br from-gray-50 to-gray-100",
  "todo-list":    "bg-gradient-to-br from-gray-50 to-gray-100",
};

// ─── Inline SVG previews per category (lightweight skeleton mockups) ──────────
function BlockPreview({ id }: { id: string }) {
  const previews: Record<string, React.ReactNode> = {
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
    feature: (
        <svg viewBox="0 0 320 180" className="w-full h-full">
          <rect width="320" height="180" fill="#f9fafb"/>
          <rect x="96" y="20" width="128" height="10" rx="3" fill="#111827"/>
          <rect x="112" y="34" width="96" height="6" rx="2" fill="#9ca3af"/>
          {[0,1,2,3,4,5].map(i => (
              <g key={i} transform={`translate(${16 + (i%3)*100}, ${60 + Math.floor(i/3)*56})`}>
                <rect width="88" height="48" rx="6" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
                <rect x="8" y="10" width="16" height="16" rx="4" fill="#e5e7eb"/>
                <rect x="32" y="12" width="48" height="5" rx="2" fill="#374151"/>
                <rect x="32" y="21" width="40" height="4" rx="2" fill="#9ca3af"/>
                <rect x="32" y="29" width="36" height="4" rx="2" fill="#9ca3af"/>
              </g>
          ))}
        </svg>
    ),
    pricing: (
        <svg viewBox="0 0 320 180" className="w-full h-full">
          <rect width="320" height="180" fill="#f9fafb"/>
          <rect x="108" y="16" width="104" height="10" rx="3" fill="#111827"/>
          <rect x="120" y="30" width="80" height="6" rx="2" fill="#9ca3af"/>
          {[0,1,2].map(i => (
              <g key={i} transform={`translate(${16 + i*100}, 50)`}>
                <rect width="88" height="116" rx="8" fill={i===1 ? "#111827" : "#fff"} stroke={i===1 ? "none" : "#e5e7eb"} strokeWidth="1"/>
                <rect x="12" y="12" width="48" height="7" rx="2" fill={i===1 ? "#fff" : "#374151"}/>
                <rect x="12" y="24" width="32" height="5" rx="2" fill={i===1 ? "#9ca3af" : "#9ca3af"}/>
                <rect x="12" y="38" width="36" height="10" rx="2" fill={i===1 ? "#fff" : "#111827"}/>
                <rect x="12" y="54" width="64" height="3" rx="1.5" fill={i===1 ? "#6b7280" : "#d1d5db"}/>
                <rect x="12" y="62" width="56" height="3" rx="1.5" fill={i===1 ? "#6b7280" : "#d1d5db"}/>
                <rect x="12" y="70" width="60" height="3" rx="1.5" fill={i===1 ? "#6b7280" : "#d1d5db"}/>
                <rect x="12" y="78" width="52" height="3" rx="1.5" fill={i===1 ? "#6b7280" : "#d1d5db"}/>
                <rect x="12" y="92" width="64" height="16" rx="8" fill={i===1 ? "#fff" : "#111827"}/>
              </g>
          ))}
        </svg>
    ),
    dashboard: (
        <svg viewBox="0 0 320 180" className="w-full h-full">
          <rect width="320" height="180" fill="#f9fafb"/>
          {/* sidebar */}
          <rect x="0" y="0" width="56" height="180" fill="#f3f4f6"/>
          <rect x="8" y="12" width="40" height="8" rx="4" fill="#d1d5db"/>
          {[0,1,2,3,4].map(i=><rect key={i} x="8" y={30+i*20} width="40" height="7" rx="3.5" fill={i===0?"#e5e7eb":"none"} stroke={i===0?"none":"none"}/>)}
          {[0,1,2,3,4].map(i=><rect key={i} x="12" y={32+i*20} width="24" height="4" rx="2" fill={i===0?"#374151":"#9ca3af"}/>)}
          {/* main */}
          <rect x="64" y="12" width="80" height="7" rx="2" fill="#111827"/>
          {[0,1,2,3].map(i=>(
              <g key={i} transform={`translate(${64+i*65}, 28)`}>
                <rect width="58" height="32" rx="5" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
                <rect x="6" y="7" width="24" height="4" rx="2" fill="#9ca3af"/>
                <rect x="6" y="16" width="32" height="6" rx="2" fill="#111827"/>
              </g>
          ))}
          <rect x="64" y="70" width="172" height="100" rx="6" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
          <rect x="72" y="78" width="60" height="5" rx="2" fill="#374151"/>
          {[0,1,2,3,4].map(i=>(
              <rect key={i} x="72" y={92+i*12} width={60+i*12} height="6" rx="2" fill={`hsl(${220},${13+i*3}%,${88-i*4}%)`}/>
          ))}
          <rect x="244" y="70" width="64" height="100" rx="6" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
          {[0,1,2,3,4,5].map(i=><rect key={i} x="252" y={80+i*14} width="48" height="5" rx="2" fill="#e5e7eb"/>)}
        </svg>
    ),
    testimonial: (
        <svg viewBox="0 0 320 180" className="w-full h-full">
          <rect width="320" height="180" fill="#f9fafb"/>
          <rect x="108" y="16" width="104" height="9" rx="3" fill="#111827"/>
          {[0,1,2].map(i=>(
              <g key={i} transform={`translate(${16+i*102}, 40)`}>
                <rect width="92" height="124" rx="8" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
                <text x="10" y="22" fontSize="24" fill="#e5e7eb">"</text>
                <rect x="10" y="32" width="72" height="4" rx="2" fill="#9ca3af"/>
                <rect x="10" y="40" width="64" height="4" rx="2" fill="#9ca3af"/>
                <rect x="10" y="48" width="68" height="4" rx="2" fill="#9ca3af"/>
                <rect x="10" y="56" width="56" height="4" rx="2" fill="#9ca3af"/>
                {/* avatar */}
                <circle cx="20" cy="96" r="10" fill="#e5e7eb"/>
                <rect x="36" y="90" width="44" height="5" rx="2" fill="#374151"/>
                <rect x="36" y="99" width="32" height="4" rx="2" fill="#9ca3af"/>
                {/* stars */}
                {[0,1,2,3,4].map(s=><rect key={s} x={10+s*12} y="111" width="8" height="4" rx="1" fill="#fbbf24"/>)}
              </g>
          ))}
        </svg>
    ),
    navbar: (
        <svg viewBox="0 0 320 180" className="w-full h-full">
          <rect width="320" height="180" fill="#f9fafb"/>
          {/* multiple navbar variants */}
          {[0,1,2].map(i=>(
              <g key={i} transform={`translate(0, ${16+i*52})`}>
                <rect x="16" y="0" width="288" height="36" rx="8" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
                <rect x="28" y="13" width="32" height="10" rx="3" fill="#111827"/>
                <rect x="100" y="15" width="24" height="6" rx="2" fill="#9ca3af"/>
                <rect x="132" y="15" width="24" height="6" rx="2" fill="#9ca3af"/>
                <rect x="164" y="15" width="24" height="6" rx="2" fill="#9ca3af"/>
                <rect x="196" y="15" width="24" height="6" rx="2" fill="#9ca3af"/>
                <rect x="256" y="12" width="36" height="12" rx="6" fill={i===0?"#111827":"none"} stroke={i===0?"none":"#d1d5db"} strokeWidth="1"/>
              </g>
          ))}
        </svg>
    ),
    "product-list": (
        <svg viewBox="0 0 320 180" className="w-full h-full">
          <rect width="320" height="180" fill="#f9fafb"/>
          {[0,1,2,3].map(i=>(
              <g key={i} transform={`translate(${16+i*76}, 24)`}>
                <rect width="68" height="140" rx="6" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
                <rect x="4" y="4" width="60" height="72" rx="4" fill="#f3f4f6"/>
                <rect x="8" y="84" width="52" height="5" rx="2" fill="#374151"/>
                <rect x="8" y="93" width="40" height="4" rx="2" fill="#9ca3af"/>
                <rect x="8" y="106" width="28" height="7" rx="2" fill="#111827"/>
                <rect x="8" y="120" width="52" height="12" rx="6" fill="#111827"/>
              </g>
          ))}
        </svg>
    ),
    "chart-card": (
        <svg viewBox="0 0 320 180" className="w-full h-full">
          <rect width="320" height="180" fill="#f9fafb"/>
          {[0,1].map(row=>[0,1].map(col=>(
              <g key={`${row}-${col}`} transform={`translate(${16+col*156}, ${12+row*84})`}>
                <rect width="140" height="72" rx="6" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
                <rect x="10" y="10" width="60" height="5" rx="2" fill="#374151"/>
                <rect x="10" y="20" width="40" height="8" rx="2" fill="#111827"/>
                {/* mini bar chart */}
                {[0,1,2,3,4,5,6].map(b=>(
                    <rect key={b} x={10+b*16} y={58-(b%3===0?20:b%3===1?28:16)} width="10" rx="2" height={b%3===0?20:b%3===1?28:16} fill={b===5?"#111827":"#e5e7eb"}/>
                ))}
              </g>
          )))}
        </svg>
    ),
    cta: (
        <svg viewBox="0 0 320 180" className="w-full h-full">
          <rect width="320" height="180" fill="#f9fafb"/>
          {[0,1].map(i=>(
              <g key={i} transform={`translate(16, ${16+i*80})`}>
                <rect width="288" height="64" rx="10" fill={i===0?"#111827":"#fff"} stroke={i===0?"none":"#e5e7eb"} strokeWidth="1"/>
                <rect x="16" y="14" width="120" height="9" rx="3" fill={i===0?"#fff":"#111827"}/>
                <rect x="16" y="28" width="96" height="6" rx="2" fill={i===0?"#6b7280":"#9ca3af"}/>
                <rect x="192" y="22" width="80" height="20" rx="10" fill={i===0?"#fff":"#111827"}/>
                <rect x="208" y="29" width="48" height="6" rx="2" fill={i===0?"#111827":"#fff"}/>
              </g>
          ))}
        </svg>
    ),
    stats: (
        <svg viewBox="0 0 320 180" className="w-full h-full">
          <rect width="320" height="180" fill="#f9fafb"/>
          {[0,1,2,3].map(i=>(
              <g key={i} transform={`translate(${16+i*76}, 40)`}>
                <rect width="68" height="96" rx="6" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
                <rect x="10" y="12" width="28" height="5" rx="2" fill="#9ca3af"/>
                <rect x="10" y="22" width="48" height="14" rx="3" fill="#111827"/>
                <rect x="10" y="42" width="36" height="4" rx="2" fill="#9ca3af"/>
                {/* sparkline */}
                <polyline points="10,76 22,66 34,70 46,60 58,64" fill="none" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
          ))}
        </svg>
    ),
    faq: (
        <svg viewBox="0 0 320 180" className="w-full h-full">
          <rect width="320" height="180" fill="#f9fafb"/>
          <rect x="88" y="16" width="144" height="9" rx="3" fill="#111827"/>
          {[0,1,2,3,4].map(i=>(
              <g key={i} transform={`translate(24, ${36+i*28})`}>
                <rect width="272" height="22" rx="5" fill={i===1?"#f3f4f6":"#fff"} stroke="#e5e7eb" strokeWidth="1"/>
                <rect x="10" y="8" width={80+i*10} height="5" rx="2" fill="#374151"/>
                <rect x={i===1?10:248} y={i===1?16:8} width={i===1?180:16} height={i===1?4:5} rx="2" fill={i===1?"#9ca3af":"#9ca3af"}/>
              </g>
          ))}
        </svg>
    ),
    footer: (
        <svg viewBox="0 0 320 180" className="w-full h-full">
          <rect width="320" height="180" fill="#f9fafb"/>
          <rect x="0" y="80" width="320" height="100" fill="#111827"/>
          <rect x="20" y="92" width="48" height="8" rx="3" fill="#fff"/>
          <rect x="20" y="104" width="80" height="4" rx="2" fill="#6b7280"/>
          <rect x="20" y="112" width="72" height="4" rx="2" fill="#6b7280"/>
          <rect x="20" y="120" width="64" height="4" rx="2" fill="#6b7280"/>
          {[1,2,3].map(col=>(
              <g key={col} transform={`translate(${96+col*60}, 92)`}>
                <rect width="40" height="5" rx="2" fill="#9ca3af"/>
                {[0,1,2,3].map(r=><rect key={r} x="0" y={12+r*10} width="36" height="4" rx="2" fill="#4b5563"/>)}
              </g>
          ))}
          <rect x="20" y="158" width="280" height="1" fill="#374151"/>
          <rect x="20" y="164" width="96" height="4" rx="2" fill="#4b5563"/>
        </svg>
    ),
    sidebar: (
        <svg viewBox="0 0 320 180" className="w-full h-full">
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
        </svg>
    ),
    checkout: (
        <svg viewBox="0 0 320 180" className="w-full h-full">
          <rect width="320" height="180" fill="#f9fafb"/>
          <rect x="16" y="16" width="176" height="148" rx="8" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
          <rect x="200" y="16" width="104" height="148" rx="8" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
          <rect x="28" y="28" width="80" height="7" rx="2" fill="#111827"/>
          {["Card number","Expiry","CVV","Name"].map((f,i)=>(
              <g key={f} transform={`translate(28, ${46+i*26})`}>
                <rect width="152" height="5" rx="2" fill="#d1d5db"/>
                <rect y="9" width="152" height="14" rx="4" fill="#f3f4f6" stroke="#e5e7eb" strokeWidth="1"/>
              </g>
          ))}
          <rect x="28" y="152" width="152" height="4" rx="2" fill="#9ca3af"/>
          <rect x="212" y="28" width="80" height="7" rx="2" fill="#111827"/>
          {[0,1,2].map(i=>(
              <g key={i} transform={`translate(212, ${46+i*26})`}>
                <rect width="40" height="28" rx="4" fill="#f3f4f6"/>
                <rect x="48" y="8" width="40" height="5" rx="2" fill="#374151"/>
                <rect x="48" y="17" width="28" height="4" rx="2" fill="#9ca3af"/>
              </g>
          ))}
          <rect x="212" y="138" width="80" height="20" rx="10" fill="#111827"/>
        </svg>
    ),
  };

  const fallback = (
      <svg viewBox="0 0 320 180" className="w-full h-full">
        <rect width="320" height="180" fill="#f9fafb"/>
        <rect x="24" y="24" width="272" height="12" rx="4" fill="#e5e7eb"/>
        <rect x="24" y="44" width="200" height="8" rx="4" fill="#e5e7eb"/>
        <rect x="24" y="60" width="240" height="8" rx="4" fill="#e5e7eb"/>
        {[0,1,2].map(i=>(
            <rect key={i} x={24+i*92} y="88" width="84" height="72" rx="8" fill="#e5e7eb"/>
        ))}
      </svg>
  );

  return previews[id] ?? fallback;
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  return (
      <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-8 h-14 max-w-7xl mx-auto">
            <div className="flex items-center gap-2 shrink-0">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/logo.png"
                        alt="BagUI Logo"
                        width={20}
                        height={20}
                        className="shrink-0"
                        priority
                    />
                    <span className="text-[15px] font-semibold tracking-tight text-black">
        Bag\Ui
      </span>
                </Link>
                <Link
                    href="https://x.com/anelkabag"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] text-gray-400 hover:text-black transition-colors"
                >
                    by Anelka Bag
                </Link>
            </div>
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-medium transition-colors ${
                        item.href === "/blocks"
                            ? "text-black font-semibold"
                            : "text-gray-500 hover:text-black"
                    }`}
                >
                  {item.label}
                </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="h-9 px-4 rounded-full text-sm font-medium text-black border border-gray-300 hover:bg-gray-50 transition-all inline-flex items-center">
              Login
            </Link>
            <Link href="/access" className="h-9 px-4 rounded-full text-sm font-medium text-white bg-black hover:bg-gray-800 transition-all inline-flex items-center">
              Get access
            </Link>
          </div>
        </div>
      </nav>
  );
}

// ─── Block Card ───────────────────────────────────────────────────────────────
function BlockCard({ id, label, count, pro, new: isNew }: {
  id: string; label: string; count: number; pro: boolean; new: boolean;
}) {
  return (
      <Link href={`/blocks/${id}`} className="group block">
        {/* Preview thumbnail */}
        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 aspect-[16/9] mb-3 transition-all duration-200 group-hover:border-gray-400 group-hover:shadow-md">
          <div className="absolute inset-0 scale-[0.85] origin-top-left" style={{transform:"scale(1)"}}>
            <BlockPreview id={id}/>
          </div>
          {/* overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/4 transition-colors duration-200"/>
          {/* badges */}
          <div className="absolute top-2.5 left-2.5 flex gap-1.5">
            {isNew && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black text-white">
                            New
                        </span>
            )}
            {pro && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-400 text-amber-900">
                            Pro
                        </span>
            )}
          </div>
        </div>
        {/* Label + count */}
        <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 group-hover:text-black transition-colors">
                    {label}
                </span>
          <span className="text-xs text-gray-400 tabular-nums">
                    {count} block{count > 1 ? "s" : ""}
                </span>
        </div>
      </Link>
  );
}

// ─── Section heading with anchor ─────────────────────────────────────────────
function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
      <h2
          id={id}
          className="text-xl font-semibold text-gray-900 mb-6 mt-14 scroll-mt-20 flex items-center gap-2 group"
      >
        <a href={`#${id}`} className="opacity-0 group-hover:opacity-30 transition-opacity text-gray-900 text-base">#</a>
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
  const totalApp       = APP_BLOCKS.reduce((s, b) => s + b.count, 0);
  const totalEcommerce = ECOMMERCE_BLOCKS.reduce((s, b) => s + b.count, 0);
  const totalAll       = totalMarketing + totalApp + totalEcommerce;

  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: "all",        label: "All",        count: totalAll },
    { key: "marketing",  label: "Marketing",  count: totalMarketing },
    { key: "app",        label: "App",         count: totalApp },
    { key: "ecommerce",  label: "Ecommerce",  count: totalEcommerce },
  ];

  const showMarketing = activeFilter === "all" || activeFilter === "marketing";
  const showApp       = activeFilter === "all" || activeFilter === "app";
  const showEcommerce = activeFilter === "all" || activeFilter === "ecommerce";

  return (
      <div className="min-h-screen bg-white">
        <Navbar/>

        <div className="max-w-7xl mx-auto px-6 pt-10 pb-20">

          {/* ── Breadcrumb ── */}
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-10">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-600">Blocks</span>
          </div>

          {/* ── Hero ── */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-black mb-3">
              Bag/UI Blocks —{" "}
              <span className="text-gray-400">{totalAll}+ Free &amp; Pro</span>
            </h1>
            <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
              Browse and install production-ready React sections built with shadcn/ui and Tailwind CSS.
              Copy &amp; paste or install directly with the Shadcn CLI.
            </p>
          </div>

          {/* ── Filter tabs ── */}
          <div className="flex items-center gap-1 mb-2 border-b border-gray-100 pb-0">
            {filters.map((f) => (
                <button
                    key={f.key}
                    onClick={() => setActiveFilter(f.key)}
                    className={`relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors ${
                        activeFilter === f.key
                            ? "text-black"
                            : "text-gray-500 hover:text-gray-800"
                    }`}
                >
                  {f.label}
                  <span className={`text-xs tabular-nums ${activeFilter === f.key ? "text-gray-500" : "text-gray-400"}`}>
                                {f.count}
                            </span>
                  {activeFilter === f.key && (
                      <motion.div
                          layoutId="filter-underline"
                          className="absolute bottom-0 left-0 right-0 h-[2px] bg-black"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                      />
                  )}
                </button>
            ))}
          </div>

          {/* ── Anchor shortcuts ── */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 py-4 text-sm text-gray-400 mb-4">
            {showMarketing && (
                <a href="#marketing" className="hover:text-black transition-colors">Marketing</a>
            )}
            {showMarketing && (showApp || showEcommerce) && <span>/</span>}
            {showApp && (
                <a href="#app" className="hover:text-black transition-colors">App</a>
            )}
            {showApp && showEcommerce && <span>/</span>}
            {showEcommerce && (
                <a href="#ecommerce" className="hover:text-black transition-colors">Ecommerce</a>
            )}
          </div>

          {/* ── Marketing ── */}
          {showMarketing && (
              <section id="marketing">
                <SectionTitle id="marketing">Marketing Blocks</SectionTitle>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
                  {MARKETING_BLOCKS.map((b) => (
                      <BlockCard key={b.id} {...b}/>
                  ))}
                </div>
              </section>
          )}

          {/* ── App ── */}
          {showApp && (
              <section id="app">
                <SectionTitle id="app">App Blocks</SectionTitle>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
                  {APP_BLOCKS.map((b) => (
                      <BlockCard key={b.id} {...b}/>
                  ))}
                </div>
              </section>
          )}

          {/* ── Ecommerce ── */}
          {showEcommerce && (
              <section id="ecommerce">
                <SectionTitle id="ecommerce">Ecommerce Blocks</SectionTitle>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
                  {ECOMMERCE_BLOCKS.map((b) => (
                      <BlockCard key={b.id} {...b}/>
                  ))}
                </div>
              </section>
          )}
        </div>

        <Footer/>
      </div>
  );
}