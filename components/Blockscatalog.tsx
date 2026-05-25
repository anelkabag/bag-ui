"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import registryJson from "@/registry.json";
import { FancyButton } from "@/registry/default/ui/fancy-button";

interface RegistryItem {
    name: string;
    type: string;
    title: string;
    description: string;
    dependencies?: string[];
    files: { path: string; type: string }[];
}

interface RegistryFile {
    items: RegistryItem[];
}

const registryData = registryJson as RegistryFile;
const latestRegistryItems = (registryData.items ?? []).slice(-5).reverse();

function ComponentPreview({ item }: { item: RegistryItem }) {
    const PreviewComponent = item.name === "fancy-button" ? FancyButton : undefined;

    if (PreviewComponent) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <PreviewComponent />
            </div>
        );
    }

    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-24 h-10 rounded-xl bg-gray-200 animate-pulse" />
        </div>
    );
}

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
                <div className="flex items-center gap-[5px]">
                    <span className="w-[11px] h-[11px] rounded-full bg-[#d8d8d8]" />
                    <span className="w-[11px] h-[11px] rounded-full bg-[#d8d8d8]" />
                    <span className="w-[11px] h-[11px] rounded-full bg-[#d8d8d8]" />
                </div>
            </div>

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
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle, rgba(0,0,0,0.055) 1px, transparent 1px)",
                        backgroundSize: "22px 22px",
                    }}
                />
                <div className="relative z-10 h-full" style={{ minHeight: "320px" }}>
                    <ComponentPreview item={item} />
                </div>
            </div>

            <div className="px-5 py-4">
                <p className="text-sm text-black/60 leading-relaxed mb-3" style={{ letterSpacing: "-0.01em" }}>
                    {item.description}
                </p>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
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
            </div>
        </motion.div>
    );
}

export default function BlocksCatalog() {
    return (
        <section className="min-h-screen bg-white px-6 md:px-12 lg:px-16 py-16">
            <div className="flex items-start justify-between mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                    <p className="text-[11px] font-semibold tracking-[0.12em] text-black/30 mb-3 uppercase">
                        Catalog
                    </p>
                    <h1
                        className="text-4xl md:text-5xl font-bold text-black mb-3"
                        style={{ letterSpacing: "-0.03em", lineHeight: 1.1 }}
                    >
                        A taste of what's inside
                    </h1>
                    <p className="text-black/40 text-sm md:text-base max-w-md leading-relaxed">
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
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-black/50 hover:text-black transition-colors"
                    >
                        See all blocks <span>↗</span>
                    </Link>
                </motion.div>
            </div>

            {latestRegistryItems.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                    <p className="text-black/25 text-sm">No components in registry yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {latestRegistryItems.map((item, i) => (
                        <ComponentCard key={item.name} item={item} index={i} />
                    ))}
                </div>
            )}
        </section>
    );
}