"use client";

import { useState } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import {
  ChevronDown,
  ArrowUpRight,
  Play,
  Search,
  Zap,
  DollarSign,
  Eye,
  Users,
  SlidersHorizontal,
  Menu,
  X,
} from "lucide-react";

/**
 * Hero1 — SaaS hero with product preview
 * Stack: Next.js (App Router) + Tailwind CSS + Framer Motion
 * Font & palette: aligned with BagUI (bagui.pro) — Geist Sans, black/white/zinc.
 *
 * Usage:
 *   1. Drop this file in e.g. `components/hero-1.tsx`
 *   2. npm i lucide-react framer-motion
 *   3. Load Geist in layout.tsx:
 *        import { Geist } from "next/font/google";
 *        const geist = Geist({ subsets: ["latin"] });
 *        <body className={geist.className}>...</body>
 *   4. Import and render <Hero1 /> at the top of your page.
 */

const navLinks = [
  { label: "Solutions", chevron: true },
  { label: "Pricing", chevron: false },
  { label: "Resources", chevron: true },
  { label: "Enterprise", chevron: false },
  { label: "What's new", chevron: true },
];

const dashNav = ["Home", "Dashboard", "Projects", "Reporting", "Users", "Settings"];
const dashTabs = [
  "Overview",
  "Notifications",
  "Analytics",
  "Saved reports",
  "Scheduled reports",
  "User reports",
];

const stats = [
  { icon: DollarSign, label: "All revenue", value: "$8,746.22", delta: "2.4%" },
  { icon: Eye, label: "Page views", value: "12,440", delta: "6.2%" },
  { icon: Users, label: "Active now", value: "96", delta: "0.8%" },
];

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Hero1() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-9">
            <a href="#" className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-900">
                <ArrowUpRight className="h-3.5 w-3.5 text-white" />
              </span>
              <span className="text-sm font-semibold text-zinc-900">
                Untitled UI
              </span>
            </a>
            <nav className="hidden items-center gap-7 lg:flex">
              {navLinks.map(({ label, chevron }) => (
                <a
                  key={label}
                  href="#"
                  className="flex items-center gap-1 text-[13px] font-medium text-zinc-600 transition-colors hover:text-zinc-900"
                >
                  {label}
                  {chevron && <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />}
                </a>
              ))}
            </nav>
          </div>

          <div className="hidden items-center gap-5 lg:flex">
            <a
              href="#"
              className="text-[13px] font-medium text-zinc-600 hover:text-zinc-900"
            >
              Log in
            </a>
            <button className="rounded-full bg-zinc-900 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-zinc-800 cursor-pointer">
              Start free trial
            </button>
          </div>

          <button
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-md p-2 text-zinc-700 lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden border-b border-zinc-100 lg:hidden"
            >
              <div className="flex flex-col gap-1 px-6 py-4">
                {navLinks.map(({ label }) => (
                  <a
                    key={label}
                    href="#"
                    className="rounded-md px-2 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    {label}
                  </a>
                ))}
                <div className="mt-2 flex flex-col gap-2 border-t border-zinc-100 pt-3">
                  <a href="#" className="px-2 py-1 text-sm font-medium text-zinc-600">
                    Log in
                  </a>
                  <button className="w-full rounded-full bg-zinc-900 py-2.5 text-sm font-medium text-white cursor-pointer">
                    Start free trial
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-20 pt-16 sm:pt-20">
        {/* decorative rotated square */}
        <div className="pointer-events-none absolute -right-6 top-14 hidden h-48 w-48 rotate-[16deg] border border-zinc-200/90 lg:block" />
        <div className="pointer-events-none absolute right-[19%] top-40 hidden h-px w-64 rotate-[-32deg] bg-zinc-200 lg:block" />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative mx-auto max-w-2xl"
        >
          <motion.a
            variants={item}
            href="#"
            className="inline-flex items-center gap-3 rounded-full border border-zinc-200 bg-white py-1 pl-1 pr-3 text-xs text-zinc-700 shadow-sm transition-colors hover:border-zinc-300"
          >
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              What&apos;s new?
            </span>
            <span className="flex items-center gap-1">
              Seamless Xero integration
              <ArrowUpRight className="h-3 w-3" />
            </span>
          </motion.a>

          <motion.h1
            variants={item}
            className="mt-6 text-[2.6rem] font-semibold leading-[1.08] tracking-tight text-zinc-900 sm:text-5xl md:text-[3.4rem]"
          >
            Dream big, build fast, and grow your online business.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 max-w-md text-[15px] leading-relaxed text-zinc-500"
          >
            Whether you&apos;re launching a new venture or scaling an
            established brand or product, our platform equips you to grow
            and thrive.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-wrap items-center gap-5"
          >
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-full bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 cursor-pointer"
            >
              Start free trial
            </motion.button>
            <div className="text-xs leading-snug text-zinc-500">
              <p className="font-medium text-zinc-700">Get 7 days free</p>
              <p>then 3 months for $1/month</p>
            </div>

            {/* inline "how it works" for smaller screens */}
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="ml-auto flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-800 shadow-sm transition-colors hover:border-zinc-300 cursor-pointer lg:hidden"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900">
                <Play className="h-2.5 w-2.5 fill-white text-white" />
              </span>
              How it works
            </motion.button>
          </motion.div>
        </motion.div>

        {/* floating "how it works" + hand-drawn arrow, desktop only */}
        <motion.button
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="absolute right-16 top-[26rem] z-20 hidden items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 shadow-sm transition-colors hover:border-zinc-300 cursor-pointer lg:flex"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900">
            <Play className="h-2.5 w-2.5 fill-white text-white" />
          </span>
          How it works
        </motion.button>

        <svg
          viewBox="0 0 160 200"
          className="pointer-events-none absolute right-[7.5rem] top-[29.5rem] z-20 hidden h-48 w-40 lg:block"
        >
          <motion.path
            d="M148,10 C118,55 96,70 78,96 C56,128 42,150 22,178"
            fill="none"
            stroke="#18181b"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.9, ease: "easeInOut" }}
          />
          <motion.path
            d="M22,178 L34,158 M22,178 L44,182"
            fill="none"
            stroke="#18181b"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 1.75 }}
          />
        </svg>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
          className="relative mx-auto mt-16 max-w-5xl"
        >
          {/* ghost panels peeking from behind, desktop only */}
          <div className="pointer-events-none absolute inset-y-6 -left-6 hidden w-16 overflow-hidden rounded-l-xl border border-zinc-100 bg-zinc-50/80 opacity-70 blur-[0.5px] xl:block" />
          <div className="pointer-events-none absolute inset-y-6 -right-6 hidden w-16 overflow-hidden rounded-r-xl border border-zinc-100 bg-zinc-50/80 opacity-70 blur-[0.5px] xl:block" />

          <div className="relative h-[380px] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-900/10 sm:h-[420px]">
            {/* top bar */}
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-3">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-2 text-xs font-semibold text-zinc-900">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-zinc-900">
                    <ArrowUpRight className="h-3 w-3 text-white" />
                  </span>
                  <span className="hidden sm:inline">Untitled UI</span>
                </span>
                <nav className="hidden items-center gap-4 text-xs font-medium text-zinc-500 sm:flex">
                  {dashNav.map((label) => (
                    <span
                      key={label}
                      className={
                        label === "Dashboard"
                          ? "rounded-md bg-zinc-100 px-2 py-1 text-zinc-900"
                          : "px-2 py-1"
                      }
                    >
                      {label}
                    </span>
                  ))}
                </nav>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden items-center gap-1 rounded-full border border-zinc-200 px-2.5 py-1 text-[11px] font-medium text-zinc-600 sm:flex">
                  <Zap className="h-3 w-3 text-amber-500" />
                  200 credits
                </span>
                <span className="h-6 w-6 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-400" />
              </div>
            </div>

            {/* tabs row */}
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-2.5">
              <div className="flex items-center gap-4 overflow-x-auto text-xs font-medium text-zinc-500">
                {dashTabs.map((label) => (
                  <span
                    key={label}
                    className={`whitespace-nowrap pb-0.5 ${
                      label === "Overview"
                        ? "border-b-2 border-zinc-900 text-zinc-900"
                        : ""
                    }`}
                  >
                    {label}
                  </span>
                ))}
              </div>
              <div className="hidden items-center gap-1.5 rounded-md border border-zinc-200 px-2.5 py-1.5 text-xs text-zinc-400 sm:flex">
                <Search className="h-3.5 w-3.5" />
                Search
              </div>
            </div>

            {/* body */}
            <div className="px-5 py-5">
              <h3 className="text-sm font-semibold text-zinc-900">
                My dashboard
              </h3>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {stats.map(({ icon: Icon, label, value, delta }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-zinc-200 p-4"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100">
                      <Icon className="h-3.5 w-3.5 text-zinc-600" />
                    </span>
                    <p className="mt-3 text-xs text-zinc-500">{label}</p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-xl font-semibold text-zinc-900">
                        {value}
                      </span>
                      <span className="flex items-center gap-0.5 text-[11px] font-medium text-emerald-600">
                        <ArrowUpRight className="h-3 w-3" />
                        {delta}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between rounded-xl border border-zinc-200 px-4 py-3">
                <div>
                  <p className="flex items-center gap-1 text-xs text-zinc-500">
                    Net revenue
                    <ChevronDown className="h-3 w-3" />
                  </p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-lg font-semibold text-zinc-900">
                      $7,804.16
                    </span>
                    <span className="text-[11px] font-medium text-emerald-600">
                      3.4%
                    </span>
                  </div>
                </div>
                <div className="hidden items-center gap-1 text-[11px] text-zinc-500 md:flex">
                  {["12 months", "30 days", "7 days", "24 hours"].map(
                    (label, i) => (
                      <span
                        key={label}
                        className={`rounded-md px-2 py-1 ${
                          i === 0 ? "bg-zinc-100 text-zinc-900" : ""
                        }`}
                      >
                        {label}
                      </span>
                    )
                  )}
                  <span className="ml-1 flex items-center gap-1 rounded-md border border-zinc-200 px-2 py-1">
                    <SlidersHorizontal className="h-3 w-3" />
                    Filters
                  </span>
                </div>
              </div>
            </div>

            {/* fade to simulate the cut-off row from the reference */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />

            {/* center play button */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              aria-label="Play demo"
              className="absolute left-1/2 top-[62%] flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-900/70 backdrop-blur-sm cursor-pointer"
            >
              <Play className="h-5 w-5 fill-white text-white" />
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}