"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Lenis from "@studio-freight/lenis";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "pnpm" | "npm" | "bun" | "yarn";
type Section = { id: string; label: string };

// ─── Data ─────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
    { label: "Blocks", href: "/blocks" },
    { label: "Templates", href: "/templates" },
    { label: "Pricing", href: "/pricing" },
    { label: "Docs", href: "/docs" },
] as const;

const SECTIONS: Section[] = [
    { id: "introduction",      label: "Introduction" },
    { id: "requirements",      label: "Requirements" },
    { id: "register-namespace",label: "Register the namespace" },
    { id: "install-a-block",   label: "Install a free block" },
    { id: "pro-access",        label: "Pro access" },
    { id: "copy-prompt",       label: "Copy prompt" },
    { id: "customization",     label: "Customization" },
    { id: "dark-mode",         label: "Dark mode" },
    { id: "updates",           label: "Updates" },
    { id: "support",           label: "Support" },
];

const FOOTER_PRODUCT = [
    { label: "Blocks",     href: "/blocks" },
    { label: "Templates",  href: "/templates" },
    { label: "Pricing",    href: "/pricing" },
    { label: "Docs",       href: "/docs" },
    { label: "Changelog",  href: "/changelog" },
];
const FOOTER_MORE  = [{ label: "FAQ", href: "/#faq" }, { label: "Login", href: "/login" }];
const FOOTER_LEGAL = [
    { label: "License", href: "/license" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms",   href: "/terms" },
    { label: "Contact", href: "mailto:contact@bagui.dev" },
];

// ─── Code snippets ────────────────────────────────────────────────────────────
const INIT_CMDS: Record<Tab, string> = {
    pnpm: "pnpm dlx shadcn@latest init",
    npm:  "npx shadcn@latest init",
    bun:  "bunx shadcn@latest init",
    yarn: "yarn dlx shadcn@latest init",
};
const INSTALL_CMDS: Record<Tab, string> = {
    pnpm: "pnpm dlx shadcn@latest add @bagui/hero-01",
    npm:  "npx shadcn@latest add @bagui/hero-01",
    bun:  "bunx shadcn@latest add @bagui/hero-01",
    yarn: "yarn dlx shadcn@latest add @bagui/hero-01",
};
const UPDATE_CMDS: Record<Tab, string> = {
    pnpm: "pnpm dlx shadcn@latest add @bagui/hero-01",
    npm:  "npx shadcn@latest add @bagui/hero-01",
    bun:  "bunx shadcn@latest add @bagui/hero-01",
    yarn: "yarn dlx shadcn@latest add @bagui/hero-01",
};
const REGISTRY_JSON = `{
  "registries": {
    "@bagui": "https://bagui.vercel.app/r/{name}.json"
  }
}`;

// ═══════════════════════════════════════════════════════════════════════════════
// NAVBAR — ta navbar originale, inchangée
// ═══════════════════════════════════════════════════════════════════════════════

const Logo = () => (
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
);

const NavLink = ({
                     href,
                     label,
                     external,
                     size = "sm",
                     onClick,
                 }: {
    href: string;
    label: string;
    external?: boolean;
    size?: "sm" | "xs";
    onClick?: () => void;
}) => (
    <Link
        href={href}
        onClick={onClick}
        className={`relative ${size === "xs" ? "text-[13px]" : "text-sm"} ${
            href === "/docs" ? "text-black font-semibold" : "text-gray-500 font-medium"
        } hover:text-black transition-colors duration-150 group inline-flex items-baseline gap-0.5`}
    >
        {label}
        {external && (
            <sup className="text-[10px] text-gray-400 leading-none">↗</sup>
        )}
        <span className="absolute left-0 -bottom-[2px] h-[1.5px] w-0 group-hover:w-full transition-all duration-300 bg-black" />
    </Link>
);

const Sep = () => (
    <div className="hidden sm:block w-px h-5 self-center shrink-0 bg-gray-200" />
);

function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled]     = useState(false);
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
        lenisRef.current = lenis;
        const onScroll = ({ scroll }: { scroll: number }) => setScrolled(scroll > 40);
        lenis.on("scroll", onScroll);
        let rafId: number;
        const raf = (time: number) => { lenis.raf(time); rafId = requestAnimationFrame(raf); };
        rafId = requestAnimationFrame(raf);
        return () => { cancelAnimationFrame(rafId); lenis.off("scroll", onScroll); lenis.destroy(); };
    }, []);

    const transition = { duration: 0.45, ease: [0.4, 0, 0.2, 1] as const };
    const flatAnim = scrolled ? { y: -80, opacity: 0 } : { y: 0, opacity: 1 };
    const pillAnim = scrolled ? { y: 0,  opacity: 1 } : { y: -80, opacity: 0 };

    return (
        <>
            {/* ── Flat navbar ── */}
            <motion.div
                className="sticky top-0 z-50 w-full"
                initial={{ y: -60, opacity: 0 }}
                animate={flatAnim}
                transition={transition}
                style={{ pointerEvents: scrolled ? "none" : "auto" }}
            >
                <nav className="flex items-center justify-between px-8 h-14 bg-white border-b border-gray-100">
                    <Logo />
                    <div className="hidden md:flex items-center gap-7">
                        {NAV_LINKS.map((item, i) => (
                            <motion.div
                                key={item.href}
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                            >
                                <NavLink {...item} />
                            </motion.div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.42 }}
                            className="hidden sm:flex items-center gap-2"
                        >
                            <Link
                                href="/login"
                                className="h-9 px-4 rounded-full text-sm font-medium text-black border border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-all inline-flex items-center justify-center"
                            >
                                Login
                            </Link>
                            <Link
                                href="/access"
                                className="h-9 px-4 rounded-full text-sm font-medium text-white bg-black border border-black hover:bg-gray-800 transition-all inline-flex items-center justify-center"
                            >
                                Get access
                            </Link>
                        </motion.div>
                        <button
                            className="md:hidden p-2 text-black"
                            onClick={() => setMobileOpen((v) => !v)}
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? "✕" : "☰"}
                        </button>
                    </div>
                </nav>
            </motion.div>

            {/* ── Pill navbar ── */}
            <motion.div
                className="fixed top-0 inset-x-0 z-50 flex justify-center pt-[10px]"
                initial={{ y: -80, opacity: 0 }}
                animate={pillAnim}
                transition={transition}
                style={{ pointerEvents: scrolled ? "auto" : "none" }}
            >
                <div
                    className="flex items-center gap-4 px-5 py-[9px] rounded-full bg-white"
                    style={{
                        boxShadow: "0 4px 28px rgba(0,0,0,0.11)",
                        width: "min(760px, calc(100% - 32px))",
                        justifyContent: "space-between",
                    }}
                >
                    <Logo />
                    <Sep />
                    <div className="hidden md:flex items-center gap-6">
                        {NAV_LINKS.map((item) => (
                            <NavLink key={item.href} {...item} size="xs" />
                        ))}
                    </div>
                    <Sep />
                    <div className="flex items-center gap-2">
                        <Link
                            href="/login"
                            className="hidden sm:inline-flex h-8 px-4 rounded-full text-[13px] font-medium text-black border border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-all items-center justify-center"
                        >
                            Login
                        </Link>
                        <Link
                            href="/access"
                            className="inline-flex h-8 px-3 sm:px-4 rounded-full text-[12px] sm:text-[13px] font-medium whitespace-nowrap text-white bg-black border border-black hover:bg-gray-800 transition-all items-center justify-center"
                        >
                            Get access
                        </Link>
                        <button
                            className="md:hidden p-2 text-black"
                            onClick={() => setMobileOpen((v) => !v)}
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? "✕" : "☰"}
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* ── Mobile menu ── */}
            <motion.div
                className="md:hidden fixed inset-0 z-40 flex flex-col px-6 pt-24 pb-10 bg-white"
                initial={{ opacity: 0, y: -30 }}
                animate={mobileOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] as const }}
                style={{ pointerEvents: mobileOpen ? "auto" : "none" }}
            >
                <nav className="flex flex-col gap-1 flex-1">
                    {NAV_LINKS.map((item, i) => (
                        <motion.div
                            key={item.href}
                            initial={{ opacity: 0, x: -24 }}
                            animate={mobileOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
                            transition={{ duration: 0.35, delay: mobileOpen ? 0.08 * (i + 1) : 0 }}
                        >
                            <Link
                                href={item.href}
                                className="block text-[38px] font-extrabold tracking-tight leading-none py-3 text-black hover:opacity-60 transition-opacity"
                                onClick={() => setMobileOpen(false)}
                            >
                                {item.label}
                            </Link>
                        </motion.div>
                    ))}
                </nav>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={mobileOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.35, delay: mobileOpen ? 0.42 : 0 }}
                    className="flex flex-col gap-3"
                >
                    <Link
                        href="/login"
                        onClick={() => setMobileOpen(false)}
                        className="w-full py-4 rounded-xl border border-gray-300 text-black text-[14px] font-bold flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                        Login
                    </Link>
                    <Link
                        href="/access"
                        onClick={() => setMobileOpen(false)}
                        className="w-full py-4 rounded-xl bg-black text-white text-[14px] font-bold flex items-center justify-center hover:bg-gray-800 transition-colors"
                    >
                        Get access
                    </Link>
                </motion.div>
            </motion.div>
        </>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DOCS COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function CodeBlock({
                       tabs,
                       cmds,
                       mono = false,
                       content,
                   }: {
    tabs?: Tab[];
    cmds?: Record<Tab, string>;
    mono?: boolean;
    content?: string;
}) {
    const [active, setActive] = useState<Tab>("pnpm");
    const [copied, setCopied] = useState(false);
    const code = content ?? cmds?.[active] ?? "";

    const copy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    };

    return (
        <div className="rounded-xl border border-gray-100 bg-gray-50 overflow-hidden my-5 shadow-sm">
            {tabs && (
                <div className="flex items-center gap-0 border-b border-gray-100 px-1 pt-1 bg-white">
                    {tabs.map((t) => (
                        <button
                            key={t}
                            onClick={() => setActive(t)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-t transition-colors ${
                                active === t
                                    ? "text-black bg-gray-100"
                                    : "text-gray-400 hover:text-gray-700"
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            )}
            {!tabs && mono && (
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-white">
                    <span className="text-xs text-gray-400 font-mono">json</span>
                </div>
            )}
            <div className="relative group">
        <pre className="p-4 text-sm text-gray-700 font-mono leading-relaxed overflow-x-auto whitespace-pre">
          {code}
        </pre>
                <button
                    onClick={copy}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-gray-50 border border-gray-200 rounded-md px-2 py-1 text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1.5 shadow-sm"
                >
                    <AnimatePresence mode="wait">
                        {copied ? (
                            <motion.span
                                key="check"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-emerald-600"
                            >
                                ✓ Copied
                            </motion.span>
                        ) : (
                            <motion.span key="copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                Copy
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </div>
    );
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
    return (
        <h2
            id={id}
            className="text-gray-900 text-xl font-semibold mt-14 mb-4 scroll-mt-20 flex items-center gap-2 group"
        >
            <a href={`#${id}`} className="opacity-0 group-hover:opacity-30 transition-opacity text-gray-900 text-base">
                #
            </a>
            {children}
        </h2>
    );
}

function Prose({ children }: { children: React.ReactNode }) {
    return <p className="text-gray-500 text-[0.925rem] leading-7">{children}</p>;
}

// ─── Left sidebar ─────────────────────────────────────────────────────────────
function LeftSidebar({ active }: { active: string }) {
    return (
        <aside className="hidden xl:block sticky top-20 self-start">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3 px-3">
                Getting Started
            </p>
            <ul className="space-y-0.5">
                {SECTIONS.map((s) => (
                    <li key={s.id}>
                        <a
                            href={`#${s.id}`}
                            className={`block text-sm rounded-lg px-3 py-1.5 transition-colors ${
                                active === s.id
                                    ? "text-black bg-gray-100 font-medium"
                                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                            }`}
                        >
                            {s.label}
                        </a>
                    </li>
                ))}
            </ul>
        </aside>
    );
}

// ─── Right TOC ────────────────────────────────────────────────────────────────
function TOC({ active }: { active: string }) {
    return (
        <nav className="sticky top-20 hidden xl:block self-start">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                On this page
            </p>
            <ul className="space-y-1.5">
                {SECTIONS.map((s) => (
                    <li key={s.id}>
                        <a
                            href={`#${s.id}`}
                            className={`block text-[13px] transition-colors py-0.5 ${
                                active === s.id ? "text-black font-medium" : "text-gray-400 hover:text-gray-700"
                            }`}
                        >
                            {s.label}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
    return (
        <footer className="border-t border-gray-100 mt-24 py-16 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-3">
                            <Image src="/logo.png" alt="BagUI" width={16} height={16} />
                            <span className="text-black font-semibold text-sm">Bag\Ui</span>
                        </div>
                        <p className="text-gray-400 text-xs leading-relaxed max-w-[180px]">
                            Stop rebuilding the same sections. Drop in Bag/UI and ship.
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-4">Product</p>
                        <ul className="space-y-2.5">
                            {FOOTER_PRODUCT.map((l) => (
                                <li key={l.label}>
                                    <Link href={l.href} className="text-gray-500 hover:text-black text-sm transition-colors">{l.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-4">More</p>
                        <ul className="space-y-2.5">
                            {FOOTER_MORE.map((l) => (
                                <li key={l.label}>
                                    <Link href={l.href} className="text-gray-500 hover:text-black text-sm transition-colors">{l.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-4">Legal</p>
                        <ul className="space-y-2.5">
                            {FOOTER_LEGAL.map((l) => (
                                <li key={l.label}>
                                    <Link href={l.href} className="text-gray-500 hover:text-black text-sm transition-colors">{l.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-8 border-t border-gray-100">
                    <p className="text-gray-400 text-xs">© 2026 Bag/UI. Premium shadcn/ui blocks.</p>
                    <div className="flex items-center gap-3">
                        <a href="https://x.com/anelkabag" target="_blank" rel="noopener noreferrer"
                           className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black hover:border-gray-400 transition-all text-xs">
                            𝕏
                        </a>
                        <a href="https://github.com/bagui" target="_blank" rel="noopener noreferrer"
                           className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black hover:border-gray-400 transition-all text-xs">
                            ⌥
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DOCS PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function DocsPage() {
    const [activeSection, setActiveSection] = useState("introduction");
    const observerRef = useRef<IntersectionObserver | null>(null);
    const tabs: Tab[] = ["pnpm", "npm", "bun", "yarn"];

    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter((e) => e.isIntersecting);
                if (visible.length) setActiveSection(visible[0].target.id);
            },
            { rootMargin: "-20% 0% -70% 0%" }
        );
        SECTIONS.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observerRef.current?.observe(el);
        });
        return () => observerRef.current?.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* ── Your Navbar ── */}
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 pt-10 pb-10">
                {/* Breadcrumb */}
                <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-xs text-gray-400 mb-8"
                >
                    <Link href="/" className="hover:text-black transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-gray-600">Documentation</span>
                </motion.div>

                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-14 max-w-2xl"
                >
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-black mb-3 leading-tight">
                        Drop a block.{" "}
                        <span className="text-gray-400">Ship the page.</span>
                    </h1>
                    <p className="text-gray-500 text-base leading-relaxed">
                        Register the Bag/UI namespace once and every block is one CLI
                        command away — pnpm, npm, bun or yarn.
                    </p>
                </motion.div>

                {/* 3-col layout */}
                <div className="grid grid-cols-1 xl:grid-cols-[200px_1fr_180px] gap-12">
                    {/* Left sidebar */}
                    <LeftSidebar active={activeSection} />

                    {/* Main content */}
                    <main className="min-w-0">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                        >
                            {/* Introduction */}
                            <section id="introduction">
                                <SectionHeading id="introduction">Introduction</SectionHeading>
                                <Prose>
                                    Bag/UI is a curated catalog of production-ready React sections
                                    built with shadcn/ui and Tailwind CSS. Every block is served
                                    from a public shadcn registry endpoint — register the
                                    namespace once and any free block is one CLI command away.
                                </Prose>
                                <p className="text-gray-500 text-[0.925rem] leading-7 mt-3">
                                    Pro blocks live behind the same endpoint but require a personal API key.
                                    Sign in once you've purchased a plan to generate yours — see{" "}
                                    <a href="#pro-access" className="text-black underline underline-offset-2 hover:opacity-70 transition-opacity">
                                        Pro access
                                    </a>{" "}
                                    below.
                                </p>
                            </section>

                            {/* Requirements */}
                            <section id="requirements">
                                <SectionHeading id="requirements">Requirements</SectionHeading>
                                <Prose>
                                    Your project should already run React 19, Tailwind CSS v4 and shadcn/ui.
                                    If shadcn isn't initialized yet, run{" "}
                                    <code className="text-gray-800 bg-gray-100 rounded px-1.5 py-0.5 text-xs font-mono">init</code>{" "}
                                    from your project root and follow the prompts.
                                </Prose>
                                <CodeBlock cmds={INIT_CMDS} tabs={tabs} />
                            </section>

                            {/* Register namespace */}
                            <section id="register-namespace">
                                <SectionHeading id="register-namespace">Register the namespace</SectionHeading>
                                <Prose>
                                    Add the Bag/UI registry to your project's{" "}
                                    <code className="text-gray-800 bg-gray-100 rounded px-1.5 py-0.5 text-xs font-mono">components.json</code>{" "}
                                    so the shadcn CLI knows where to fetch the blocks from.
                                    You only do this once per project — no API key needed for free blocks.
                                </Prose>
                                <CodeBlock mono content={REGISTRY_JSON} />
                            </section>

                            {/* Install a block */}
                            <section id="install-a-block">
                                <SectionHeading id="install-a-block">Install a free block</SectionHeading>
                                <Prose>
                                    Once the registry is wired, install any free block by its id. The CLI
                                    fetches the source, pulls the missing shadcn primitives and writes the
                                    file under{" "}
                                    <code className="text-gray-800 bg-gray-100 rounded px-1.5 py-0.5 text-xs font-mono">components/blocks/</code>.
                                </Prose>
                                <CodeBlock cmds={INSTALL_CMDS} tabs={tabs} />
                                <ol className="mt-6 space-y-3">
                                    {[
                                        "Pick a block in /blocks and copy its id (e.g. hero-01).",
                                        "Run the install command above with your package manager of choice.",
                                        "Import the default export from components/blocks/<id>.tsx and render it.",
                                        "Replace the placeholder copy, links and brand colors.",
                                    ].map((step, i) => (
                                        <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-[10px] font-mono text-gray-400">
                        {i + 1}
                      </span>
                                            <span className="text-gray-500 text-sm leading-6">{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </section>

                            {/* Pro access */}
                            <section id="pro-access">
                                <SectionHeading id="pro-access">Pro access</SectionHeading>
                                <Prose>
                                    Pro blocks require an API key tied to a paid Bag/UI plan. After purchase,
                                    sign in, generate a token under Account → Registry token, and add it to
                                    your project.
                                </Prose>
                                <p className="text-gray-500 text-[0.925rem] leading-7 mt-3">
                                    Without a key, Pro install commands return{" "}
                                    <code className="text-gray-800 bg-gray-100 rounded px-1.5 py-0.5 text-xs font-mono">401</code>{" "}
                                    with a clear message — your project keeps working, those specific blocks just won't install.
                                </p>
                                <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-5 flex items-start gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white text-sm">
                                        ✦
                                    </div>
                                    <div>
                                        <p className="text-gray-900 text-sm font-semibold mb-1">Unlock all Pro blocks</p>
                                        <p className="text-gray-400 text-xs leading-relaxed">
                                            Pay once, own them forever — including everything we ship next.
                                        </p>
                                        <Link
                                            href="/pricing"
                                            className="inline-flex items-center gap-1 mt-3 text-xs text-white bg-black hover:bg-gray-800 rounded-lg px-3 py-1.5 transition-colors"
                                        >
                                            View pricing →
                                        </Link>
                                    </div>
                                </div>
                            </section>

                            {/* Copy prompt */}
                            <section id="copy-prompt">
                                <SectionHeading id="copy-prompt">Copy prompt</SectionHeading>
                                <Prose>
                                    Every block exposes a{" "}
                                    <strong className="text-gray-800 font-semibold">Copy prompt</strong>{" "}
                                    button next to the Preview and Code switcher. It produces an LLM-ready
                                    markdown brief — block id, live preview URL, full source, integration
                                    steps and constraints.
                                </Prose>
                                <p className="text-gray-500 text-[0.925rem] leading-7 mt-3">
                                    Paste it into Claude Code, Cursor, Copilot or any agent that takes
                                    markdown — it knows enough to add the block to your codebase without guessing.
                                </p>
                            </section>

                            {/* Customization */}
                            <section id="customization">
                                <SectionHeading id="customization">Customization</SectionHeading>
                                <Prose>
                                    Blocks ship in plain JSX with utility classes only. Change copy, swap icons
                                    from{" "}
                                    <code className="text-gray-800 bg-gray-100 rounded px-1.5 py-0.5 text-xs font-mono">lucide-react</code>,
                                    restyle with your own Tailwind tokens or refactor the markup — there is
                                    no abstraction in the way.
                                </Prose>
                                <p className="text-gray-500 text-[0.925rem] leading-7 mt-3">
                                    If you replace lucide-react with another icon library, search and replace
                                    the imports. The semantics are kept generic so other libraries plug in easily.
                                </p>
                            </section>

                            {/* Dark mode */}
                            <section id="dark-mode">
                                <SectionHeading id="dark-mode">Dark mode</SectionHeading>
                                <Prose>
                                    Every block reads the standard shadcn CSS variables (
                                    <code className="text-gray-800 bg-gray-100 rounded px-1.5 py-0.5 text-xs font-mono">--background</code>,{" "}
                                    <code className="text-gray-800 bg-gray-100 rounded px-1.5 py-0.5 text-xs font-mono">--foreground</code>,{" "}
                                    <code className="text-gray-800 bg-gray-100 rounded px-1.5 py-0.5 text-xs font-mono">--muted</code>
                                    , …). As long as your project toggles the{" "}
                                    <code className="text-gray-800 bg-gray-100 rounded px-1.5 py-0.5 text-xs font-mono">.dark</code>{" "}
                                    class on the{" "}
                                    <code className="text-gray-800 bg-gray-100 rounded px-1.5 py-0.5 text-xs font-mono">&lt;html&gt;</code>{" "}
                                    element, the blocks adapt automatically.
                                </Prose>
                            </section>

                            {/* Updates */}
                            <section id="updates">
                                <SectionHeading id="updates">Updates</SectionHeading>
                                <Prose>
                                    When a block gets a fix or a refresh, the registry endpoint serves the new
                                    source at the same URL. Re-run the install command to pull the latest
                                    version, or watch the changelog for high-level summaries.
                                </Prose>
                                <CodeBlock cmds={UPDATE_CMDS} tabs={tabs} />
                            </section>

                            {/* Support */}
                            <section id="support">
                                <SectionHeading id="support">Support</SectionHeading>
                                <Prose>
                                    Stuck on something? Email{" "}
                                    <a href="mailto:contact@bagui.dev" className="text-black underline underline-offset-2 hover:opacity-70 transition-opacity">
                                        contact@bagui.dev
                                    </a>{" "}
                                    — Pro accounts get priority replies, free users still get an answer when time allows.
                                </Prose>
                                <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-6">
                                    <h3 className="text-gray-900 text-sm font-semibold mb-2">Still stuck?</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        Drop us an email at{" "}
                                        <a href="mailto:contact@bagui.dev" className="text-black underline underline-offset-2 hover:opacity-70 transition-opacity">
                                            contact@bagui.dev
                                        </a>
                                        . Pro accounts get priority replies.
                                    </p>
                                </div>
                            </section>

                            {/* Prev / Next */}
                            <div className="mt-16 pt-8 border-t border-gray-100 flex justify-end">
                                <Link
                                    href="/blocks"
                                    className="group flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors"
                                >
                                    Browse blocks
                                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                                </Link>
                            </div>
                        </motion.div>
                    </main>

                    {/* Right TOC */}
                    <TOC active={activeSection} />
                </div>
            </div>

            <Footer />
        </div>
    );
}