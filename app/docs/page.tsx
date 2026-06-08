"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/footer";
import Navbar from "@/components/navbar";

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
    { id: "introduction",       label: "Introduction" },
    { id: "requirements",       label: "Requirements" },
    { id: "register-namespace", label: "Register the namespace" },
    { id: "install-a-block",    label: "Install a free block" },
    { id: "copy-prompt",        label: "Copy prompt" },
    { id: "customization",      label: "Customization" },
    { id: "dark-mode",          label: "Dark mode" },
    { id: "updates",            label: "Updates" },
    { id: "support",            label: "Support" },
];

// ─── Sidebar nav ─────────────────────────────────────────────────────────────
// Chaque groupe = une section "Getting Started", "Components", etc.
// Chaque page = une entrée cliquable dans la sidebar (comme "Installations" dans le screenshot).
// Les sous-sections (ancres) restent dans le TOC à droite.
const SIDEBAR_NAV = [
    {
        group: "Getting Started",
        pages: [
            { label: "Installations", href: "/docs" },
            // Ajouter d'autres pages ici quand elles existent :
            // { label: "Configuration", href: "/docs/configuration" },
        ],
    },
    // Ajouter d'autres groupes ici :
    // {
    //     group: "Components",
    //     pages: [
    //         { label: "Buttons", href: "/docs/components/buttons" },
    //     ],
    // },
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
// NAVBAR — Pas d'animation, juste statique
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
                            className={`px-3 py-1.5 text-xs font-medium rounded-t transition-colors cursor-pointer ${
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
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-gray-50 border border-gray-200 rounded-md px-2 py-1 text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1.5 shadow-sm cursor-pointer"
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
function LeftSidebar({ activePage }: { activePage: string }) {
    return (
        <aside className="hidden xl:block sticky top-20 self-start">
            {SIDEBAR_NAV.map((group) => (
                <div key={group.group} className="mb-6">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3 px-3">
                        {group.group}
                    </p>
                    <ul className="space-y-0.5">
                        {group.pages.map((page) => (
                            <li key={page.href}>
                                <Link
                                    href={page.href}
                                    className={`block text-sm rounded-lg px-3 py-1.5 transition-colors ${
                                        activePage === page.href
                                            ? "text-black bg-gray-100 font-medium"
                                            : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                                    }`}
                                >
                                    {page.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
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


// DOCS PAGE — Scroll natif pur, zéro overhead
// ═══════════════════════════════════════════════════════════════════════════════
export default function DocsPage() {
    const [activeSection, setActiveSection] = useState("introduction");
    const tabs: Tab[] = ["pnpm", "npm", "bun", "yarn"];

    // ─── Mise à jour manuelle du TOC au scroll avec throttle ───────────────
    useEffect(() => {
        let lastUpdate = 0;
        const updateActive = () => {
            const now = Date.now();
            if (now - lastUpdate < 100) return; // Throttle à 100ms
            lastUpdate = now;

            // Trouver la section en viewport
            for (const section of SECTIONS) {
                const el = document.getElementById(section.id);
                if (!el) continue;

                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.3) {
                    setActiveSection(section.id);
                }
            }
        };

        window.addEventListener("scroll", updateActive, { passive: true });
        return () => window.removeEventListener("scroll", updateActive);
    }, []);

    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* ── Navbar ── */}
            <Navbar/>

            <div className="max-w-7xl mx-auto px-6 pt-10 pb-10">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
                    <Link href="/" className="hover:text-black transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-gray-600">Documentation</span>
                </div>

                {/* Hero */}
                <div className="mb-14 max-w-2xl">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-black mb-3 leading-tight">
                        Ready-made blocks.{" "}
                        <span className="text-gray-400">Zero wasted time.</span>
                    </h1>
                    <p className="text-gray-500 text-base leading-relaxed">
                        Register Bag/UI once and pull any block directly into your project with a
                        single CLI command.
                    </p>
                </div>

                {/* 3-col layout */}
                <div className="grid grid-cols-1 xl:grid-cols-[200px_1fr_180px] gap-12">
                    {/* Left sidebar */}
                    <LeftSidebar activePage="/docs" />

                    {/* Main content */}
                    <main className="min-w-0">
                        {/* Introduction */}
                        <section id="introduction">
                            <SectionHeading id="introduction">Introduction</SectionHeading>
                            <Prose>
                                Bag/UI is a growing library of carefully crafted React blocks built on
                                shadcn/ui and Tailwind CSS. Interactive sections may include Framer Motion
                                or GSAP animations, while every block remains fully customizable and
                                installable through the Bag/UI registry with a single CLI command.
                            </Prose>

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
                                <a href="mailto:anelka.bag@gmail.com" className="text-black underline underline-offset-2 hover:opacity-70 transition-opacity">
                                    anelka.bag@gmail.com
                                </a>{" "}
                                — Pro accounts get priority replies, free users still get an answer when time allows.
                            </Prose>
                            <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-6">
                                <h3 className="text-gray-900 text-sm font-semibold mb-2">Still stuck?</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    Drop us an email at{" "}
                                    <a href="mailto:anelka.bag@gmail.com" className="text-black underline underline-offset-2 hover:opacity-70 transition-opacity">
                                        anelka.bag@gmail.com
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
                    </main>

                    {/* Right TOC */}
                    <TOC active={activeSection} />
                </div>
            </div>

            <Footer />
        </div>
    );
}