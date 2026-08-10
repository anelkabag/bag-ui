"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

/* ---------------------------------------------------------------------- */
/*  Icons — inline, no external icon package required                     */
/* ---------------------------------------------------------------------- */

function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M2 21 23 12 2 3v7l15 2-15 2Z" />
    </svg>
  );
}

function FolderIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M3 6.6c0-.6.5-1.1 1.1-1.1h4.2c.3 0 .6.1.8.4l1 1.1c.2.2.5.4.8.4H19.9c.6 0 1.1.5 1.1 1.1v9.4c0 .6-.5 1.1-1.1 1.1H4.1c-.6 0-1.1-.5-1.1-1.1V6.6Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FileIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M6.3 3.5h7.4l4 4v12.6c0 .5-.4.9-.9.9H6.3c-.5 0-.9-.4-.9-.9V4.4c0-.5.4-.9.9-.9Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M13.7 3.5V7c0 .5.4 1 1 1h3.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TerminalIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="4.5" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M7 9.3 10 12l-3 2.7M12.5 14.7H17"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------------------------------------------------------------------- */
/*  Static content                                                        */
/* ---------------------------------------------------------------------- */

const NAV_LINKS = ["Platform", "Automation Suite", "Pricing", "Company", "Docs"];

const FILES = [
  { name: "github", type: "folder" },
  { name: "vscode", type: "folder" },
  { name: "node_modules", type: "folder" },
  { name: "public", type: "folder" },
  { name: "src", type: "folder", open: true },
  { name: "CloudServices", type: "folder", nested: true },
  { name: "DevOpsAssistant.ts", type: "file", nested: true },
  { name: "App.tsx", type: "file", nested: true },
  { name: "index.tsx", type: "file", nested: true },
  { name: ".gitignore", type: "file" },
  { name: "README.md", type: "file" },
  { name: "tsconfig.json", type: "file" },
  { name: "package.json", type: "file" },
] as const;

const CODE_LINES: { text: string; color: string }[] = [
  { text: "// CSS Syntax Highlighter v2", color: "text-neutral-400" },
  { text: "// Manages the Figma plugin interface", color: "text-neutral-400" },
  { text: "import PluginManager from 'figma.js'", color: "text-neutral-700" },
  { text: "", color: "" },
  { text: "interface PluginSettings {", color: "text-neutral-700" },
  { text: "  colorScheme: ColorScheme;", color: "text-neutral-700" },
  { text: "  opacity?: { value: number };", color: "text-neutral-700" },
  { text: "  enabled: boolean;", color: "text-neutral-700" },
  { text: "}", color: "text-neutral-700" },
  { text: "", color: "" },
  { text: "let settings: PluginSettings = {", color: "text-neutral-700" },
  { text: "  colorScheme: {", color: "text-neutral-700" },
  { text: "    selector: { r: 0, g: 0, b: 0 },", color: "text-neutral-500" },
  { text: "    property: { r: 0, g: 0, b: 0 },", color: "text-neutral-500" },
  { text: "    value:    { r: 0, g: 0, b: 0 },", color: "text-neutral-500" },
  { text: "    comment:  { r: 0, g: 0, b: 0 },", color: "text-neutral-500" },
  { text: "  },", color: "text-neutral-700" },
  { text: "  enabled: true,", color: "text-neutral-700" },
  { text: "};", color: "text-neutral-700" },
];

// Real brand marks, fetched from the Simple Icons CDN (no local SVG needed).
// Rendered desaturated by default and revealed in full colour on hover.
const LOGOS = [
  { name: "GitHub", slug: "github" },
  { name: "npm", slug: "npm" },
  { name: "shadcn/ui", slug: "shadcnui" },
  { name: "Vercel", slug: "vercel" },
  { name: "Next.js", slug: "nextdotjs" },
  { name: "Motion", slug: "framer" },
];

/* ---------------------------------------------------------------------- */
/*  Hero3                                                                  */
/* ---------------------------------------------------------------------- */

export default function Hero3() {
  const shouldReduceMotion = useReducedMotion();
  const ease = [0.16, 1, 0.3, 1] as const;

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: shouldReduceMotion ? 0 : 0.15,
      },
    },
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.2 : 0.6, ease },
    },
  };

  return (
    <section className="w-full bg-neutral-50">
      <div className="mx-auto flex w-full flex-col gap-4 px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
        {/* -------------------------------------------------------------- */}
        {/*  Navbar — detached card, lives inside the hero                 */}
        {/* -------------------------------------------------------------- */}
        <motion.nav
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.2 : 0.5, ease }}
          className="flex items-center justify-between border border-gray-300 bg-white px-6 py-4 shadow-sm sm:px-10"
        >
          <div className="flex items-center gap-10">
            <LogoMark className="h-5 w-5 text-neutral-950" />
            <div className="hidden items-center gap-8 text-sm text-neutral-600 lg:flex">
              {NAV_LINKS.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="transition-colors hover:text-neutral-950"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-md border border-neutral-300 px-4 py-2 text-sm text-neutral-800 transition-colors hover:bg-neutral-100">
              Contact Sales
            </button>
            <button className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white transition-colors hover:bg-neutral-800">
              Login
            </button>
          </div>
        </motion.nav>

        {/* -------------------------------------------------------------- */}
        {/*  Hero content                                                  */}
        {/* -------------------------------------------------------------- */}
        <div className="grid grid-cols-1 gap-12 py-6 lg:grid-cols-2 lg:gap-8 lg:py-10">
          {/* Left column */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            className="flex flex-col justify-center"
          >
            <motion.div
              variants={fadeUp}
              className="mb-6 flex items-center gap-2 text-xs tracking-wide text-neutral-500"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
              <span className="uppercase">New announcement on X</span>
              <span>·</span>
              <a href="#" className="uppercase text-orange-600 hover:underline">
                Read more
              </a>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-sans text-4xl font-semibold leading-[1.1] tracking-tight text-neutral-950 lg:text-[44px]"
            >
              Autonomous Software Engineering Built for Real-World Production
            </motion.h1>

            <motion.div
              variants={fadeUp}
              className="mt-6 max-w-md space-y-4 text-[15px] leading-relaxed text-neutral-500"
            >
              <p>
                The first engineering automations that operate everywhere
                your team ships code.
              </p>
              <p>
                From local dev to CI/CD — offload end-to-end tasks like
                refactors, migrations, debugging, and incident response
                without changing your stack, tools, or workflow.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-8 flex items-center gap-3">
              <button className="rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800">
                Get Started
              </button>
              <button className="rounded-md border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-100">
                Contact Sales
              </button>
            </motion.div>
          </motion.div>

          {/* Right column — stacked cards, large screens only */}
          <div className="relative hidden min-h-[440px] lg:block">
            {/* back card peeking out top-right, suggests depth */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: shouldReduceMotion ? 0.2 : 0.6, delay: shouldReduceMotion ? 0 : 0.2 }}
              className="absolute -right-3 -top-3 h-20 w-32 rounded-md border border-neutral-200 bg-white shadow-sm"
            >
              <span className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-orange-500" />
            </motion.span>

            {/* Code editor window */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.2 : 0.6, delay: shouldReduceMotion ? 0 : 0.3, ease }}
              className="absolute inset-0 z-10 flex flex-col overflow-hidden border border-neutral-200 bg-white shadow-xl"
            >
              <div className="flex items-center gap-1.5 border-b border-neutral-200 px-3 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
              </div>
              <div className="flex flex-1 overflow-hidden text-[11px]">
                <div className="w-28 shrink-0 overflow-y-auto border-r border-neutral-200 bg-neutral-50 px-3 py-3">
                  <p className="mb-2 font-medium tracking-wide text-neutral-400">
                    CREATE REACT APP
                  </p>
                  <ul className="space-y-1.5">
                    {FILES.map((f) => (
                      <li
                        key={f.name}
                        className={`flex items-center gap-1.5 ${
                          "nested" in f && f.nested ? "pl-3" : ""
                        } ${
                          "open" in f && f.open
                            ? "text-neutral-900"
                            : "text-neutral-500"
                        }`}
                      >
                        {f.type === "folder" ? (
                          <FolderIcon className="h-3 w-3 shrink-0" />
                        ) : (
                          <FileIcon className="h-3 w-3 shrink-0" />
                        )}
                        <span className="truncate">{f.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 overflow-y-auto bg-white px-4 py-3 font-mono">
                  {CODE_LINES.map((line, i) => (
                    <p key={i} className={`whitespace-pre leading-5 ${line.color}`}>
                      {line.text || "\u00A0"}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Terminal card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: 1,
                y: shouldReduceMotion ? 0 : [0, -6, 0],
              }}
              transition={{
                opacity: { duration: 0.6, delay: shouldReduceMotion ? 0 : 0.5 },
                y: shouldReduceMotion
                  ? { duration: 0.2 }
                  : { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 },
              }}
              className="absolute bottom-4 right-2 z-20 w-64 rounded-lg border border-neutral-200 bg-white p-4 shadow-xl"
            >
              <span className="absolute -right-1.5 -top-1.5 h-3 w-3 rounded-full bg-orange-500" />
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-2.5 py-1 text-[10px] font-medium tracking-wide text-neutral-600">
                <TerminalIcon className="h-3 w-3" />
                MACOS / LINUX
              </div>
              <p className="truncate font-mono text-[12px] text-neutral-700">
                <span className="text-neutral-400">{">"}</span> curl -fsSL
                https://forge.ai/install | sh
              </p>
            </motion.div>
          </div>
        </div>

        {/* -------------------------------------------------------------- */}
        {/*  Logos strip                                                   */}
        {/* -------------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm sm:flex-row sm:divide-x sm:divide-y-0"
        >
          {LOGOS.map(({ name, slug }) => (
            <div
              key={name}
              className="group flex flex-1 items-center justify-center gap-2 py-8 text-neutral-400 transition-colors hover:text-neutral-700"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://cdn.simpleicons.org/${slug}`}
                alt={`${name} logo`}
                className="h-4 w-4 grayscale opacity-60 transition duration-300 group-hover:grayscale-0 group-hover:opacity-100"
              />
              <span className="text-sm font-medium">{name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}