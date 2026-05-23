"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RegistryItem {
    name: string;
    type: string;
    title: string;
    description: string;
    dependencies?: string[];
    files: { path: string; type: string }[];
}

const registry: RegistryItem[] = [
    {
        name: "fancy-button",
        type: "registry:ui",
        title: "Fancy Button",
        description: "Animated premium button",
        dependencies: ["framer-motion"],
        files: [{ path: "registry/default/ui/fancy-button.tsx", type: "registry:ui" }],
    },
    // ← ajoute tes futurs composants ici
];

// ─── Live preview par composant ───────────────────────────────────────────────

function ComponentPreview({ name }: { name: string }) {
    const [hovered, setHovered] = useState(false);

    if (name === "fancy-button") {
        return (
            <div
                className="w-full h-full flex items-center justify-center"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <motion.button
                    animate={hovered ? { scale: 1.05 } : { scale: 1 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-white select-none"
                    style={{
                        background: "#0f0f0f",
                        letterSpacing: "-0.01em",
                        boxShadow: hovered
                            ? "0 12px 40px rgba(0,0,0,0.22)"
                            : "0 2px 12px rgba(0,0,0,0.10)",
                        transition: "box-shadow 0.25s",
                    }}
                >
                    <motion.span animate={hovered ? { x: 2 } : { x: 0 }} transition={{ duration: 0.2 }}>
                        Get started
                    </motion.span>
                    <motion.span
                        animate={hovered ? { x: 5, opacity: 1 } : { x: 0, opacity: 0.5 }}
                        transition={{ duration: 0.2 }}
                    >
                        →
                    </motion.span>
                </motion.button>
            </div>
        );
    }

    // Fallback générique
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-24 h-10 rounded-xl bg-gray-200 animate-pulse" />
        </div>
    );
}

// ─── Card individuelle (frame Framer-style) ───────────────────────────────────

function ComponentCard({ item, index }: { item: RegistryItem; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col rounded-2xl overflow-hidden"
            style={{
                background: "#fff",
                border: "1px solid #e8e8e8",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
        >
            {/* ── Top chrome bar ── */}
            <div
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: "1px solid #efefef" }}
            >
                <div className="flex items-center gap-2">
          <span
              className="text-[15px] font-bold text-black"
              style={{ letterSpacing: "-0.03em" }}
          >
            {item.title}.
          </span>
                    <span
                        className="text-[15px] font-normal text-black/35"
                        style={{ letterSpacing: "-0.02em" }}
                    >
            /ui
          </span>
                </div>
                {/* 3 dots — gris comme sur la photo */}
                <div className="flex items-center gap-[5px]">
                    <span className="w-[11px] h-[11px] rounded-full bg-[#d8d8d8]" />
                    <span className="w-[11px] h-[11px] rounded-full bg-[#d8d8d8]" />
                    <span className="w-[11px] h-[11px] rounded-full bg-[#d8d8d8]" />
                </div>
            </div>

            {/* ── Preview zone — grande hauteur, coins arrondis intérieurs ── */}
            <div
                className="relative overflow-hidden"
                style={{
                    background: "#f7f7f7",
                    minHeight: "320px",
                    margin: "10px",
                    borderRadius: "12px",
                    border: "1px solid #efefef",
                }}
            >
                {/* Dot grid subtile */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle, rgba(0,0,0,0.055) 1px, transparent 1px)",
                        backgroundSize: "22px 22px",
                    }}
                />
                <div className="relative z-10 h-full" style={{ minHeight: "320px" }}>
                    <ComponentPreview name={item.name} />
                </div>
            </div>

            {/* ── Bottom label ── */}
            <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-black" style={{ letterSpacing: "-0.02em" }}>
            {item.title}
          </span>
                    {item.dependencies?.map((dep) => (
                        <span
                            key={dep}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-md"
                            style={{
                                background: "#f0f0f0",
                                color: "#888",
                                letterSpacing: "0.03em",
                            }}
                        >
              {dep}
            </span>
                    ))}
                </div>
                <Link
                    href={`/blocks/${item.name}`}
                    className="text-[11px] font-semibold text-black/40 hover:text-black transition-colors"
                    style={{ letterSpacing: "0.06em" }}
                >
                    VIEW ↗
                </Link>
            </div>
        </motion.div>
    );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function BlocksCatalog() {
    return (
        <section className="min-h-screen bg-[#0a0a0a] px-6 md:px-12 lg:px-16 py-16">
            {/* En-tête */}
            <div className="flex items-start justify-between mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                    <p className="text-[11px] font-semibold tracking-[0.12em] text-white/30 mb-3 uppercase">
                        Catalog
                    </p>
                    <h1
                        className="text-4xl md:text-5xl font-bold text-white mb-3"
                        style={{ letterSpacing: "-0.03em", lineHeight: 1.1 }}
                    >
                        A taste of what's inside
                    </h1>
                    <p className="text-white/40 text-sm md:text-base max-w-md leading-relaxed">
                        Every block crafted by hand and free while we warm up.
                        Pick a component to start browsing.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.55, delay: 0.15 }}
                    className="hidden md:block pt-1"
                >
                    <Link
                        href="/blocks"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-white/50 hover:text-white transition-colors"
                    >
                        See all blocks <span>↗</span>
                    </Link>
                </motion.div>
            </div>

            {/* Grille 2 colonnes */}
            {registry.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                    <p className="text-white/25 text-sm">No components in registry yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {registry.map((item, i) => (
                        <ComponentCard key={item.name} item={item} index={i} />
                    ))}
                </div>
            )}

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-10 text-center text-[11px] text-white/20 tracking-widest"
            >
                {registry.length} COMPONENT{registry.length !== 1 ? "S" : ""} IN REGISTRY
            </motion.p>
        </section>
    );
}