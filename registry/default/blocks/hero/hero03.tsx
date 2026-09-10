"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, Variants } from "motion/react";
import {
  ChevronDown,
  ArrowUpRight,
  Play,
  Search,
  Zap,
  DollarSign,
  Eye,
  Users as UsersIcon,
  SlidersHorizontal,
  Menu,
  X,
  Bell,
  Bookmark,
  Clock3,
  CreditCard,
  UserPlus,
  HardDrive,
  Sun,
  Moon,
} from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/**
 * Hero1 — Dynamic SaaS hero with an interactive product dashboard
 * Stack: Next.js (App Router) + Tailwind CSS + Framer Motion + Recharts
 * Font & palette: aligned with BagUI (bagui.pro) — Geist Sans, black/white/zinc.
 *
 * Usage:
 *   1. Drop this file in e.g. `components/hero-1.tsx`
 *   2. npm i lucide-react motion/react recharts
 *   3. Load Geist in layout.tsx:
 *        import { Geist } from "next/font/google";
 *        const geist = Geist({ subsets: ["latin"] });
 *        <body className={geist.className}>...</body>
 *   4. Import and render <Hero1 /> at the top of your page.
 */

/* ---------- static content ---------- */

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

const announcements = [
  { tag: "What's new?", text: "Seamless Xero integration" },
  { tag: "Just shipped", text: "Team roles & permissions" },
  { tag: "New", text: "Faster checkout with Stripe Tax" },
];

type RangeKey = "12M" | "30D" | "7D" | "24H";
interface RangeDatum {
  name: string;
  value: number;
}
interface RangeInfo {
  label: string;
  total: number;
  delta: string;
  data: RangeDatum[];
}

const ranges: Record<RangeKey, RangeInfo> = {
  "12M": {
    label: "12 months",
    total: 7804.16,
    delta: "+18.4%",
    data: [
      { name: "Jan", value: 420 },
      { name: "Feb", value: 398 },
      { name: "Mar", value: 460 },
      { name: "Apr", value: 512 },
      { name: "May", value: 489 },
      { name: "Jun", value: 540 },
      { name: "Jul", value: 610 },
      { name: "Aug", value: 592 },
      { name: "Sep", value: 648 },
      { name: "Oct", value: 690 },
      { name: "Nov", value: 735 },
      { name: "Dec", value: 780 },
    ],
  },
  "30D": {
    label: "30 days",
    total: 2140.32,
    delta: "+3.4%",
    data: Array.from({ length: 30 }).map((_, i) => ({
      name: `${i + 1}`,
      value: Math.round(180 + Math.sin(i / 3) * 40 + i * 2),
    })),
  },
  "7D": {
    label: "7 days",
    total: 612.5,
    delta: "+1.1%",
    data: [
      { name: "Mon", value: 420 },
      { name: "Tue", value: 398 },
      { name: "Wed", value: 460 },
      { name: "Thu", value: 512 },
      { name: "Fri", value: 489 },
      { name: "Sat", value: 540 },
      { name: "Sun", value: 610 },
    ],
  },
  "24H": {
    label: "24 hours",
    total: 94.8,
    delta: "+0.6%",
    data: Array.from({ length: 24 }).map((_, i) => ({
      name: `${i}h`,
      value: Math.round(20 + Math.sin(i / 2) * 10 + (i > 18 ? 15 : 0)),
    })),
  },
};

const notifications = [
  {
    icon: CreditCard,
    title: "Payment received",
    desc: "Xero synced an invoice payment of $482.00.",
    time: "2m ago",
    unread: true,
  },
  {
    icon: UserPlus,
    title: "New team member",
    desc: "Sarah Chen joined the Reporting workspace.",
    time: "1h ago",
    unread: true,
  },
  {
    icon: Bell,
    title: "Weekly report ready",
    desc: "Your scheduled report for Sep 1–7 is ready to view.",
    time: "3h ago",
    unread: false,
  },
  {
    icon: HardDrive,
    title: "Storage almost full",
    desc: "You're using 92% of your workspace storage.",
    time: "Yesterday",
    unread: false,
  },
];

const channels = [
  { label: "Direct", value: 42 },
  { label: "Organic search", value: 28 },
  { label: "Referral", value: 18 },
  { label: "Social", value: 12 },
];

const savedReports = [
  { title: "Q3 revenue summary", meta: "Edited 2 days ago" },
  { title: "Churn cohort — August", meta: "Edited 5 days ago" },
  { title: "Marketing spend vs signups", meta: "Edited 1 week ago" },
  { title: "Support ticket volume", meta: "Edited 2 weeks ago" },
];

const scheduledReports = [
  { title: "Monthly board report", freq: "Monthly", next: "Oct 1, 2026", recipients: 6 },
  { title: "Weekly growth digest", freq: "Weekly", next: "Sep 14, 2026", recipients: 12 },
  { title: "Daily ops summary", freq: "Daily", next: "Tomorrow, 8:00 AM", recipients: 3 },
];

const dashboardUsers = [
  { name: "Amara Yeboah", role: "Product Designer", status: "Active" },
  { name: "Leon Fischer", role: "Growth", status: "Active" },
  { name: "Priya Raman", role: "Support Lead", status: "Invited" },
  { name: "Jonas Wick", role: "Engineering", status: "Active" },
  { name: "Mei Tanaka", role: "Finance", status: "Invited" },
];

const formatCurrency = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

/* ---------- small helpers ---------- */

function LiveNumber({ value }: { value: string }) {
  return (
    <span className="relative inline-flex overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-zinc-900">{label}</p>
      <p className="text-zinc-500">${payload[0].value.toLocaleString()}</p>
    </div>
  );
}

/* ---------- main component ---------- */

export default function Hero1() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [announceIndex, setAnnounceIndex] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const [activeDashNav, setActiveDashNav] = useState("Dashboard");
  const [activeSubTab, setActiveSubTab] = useState("Overview");
  const [range, setRange] = useState<RangeKey>("12M");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState([
    { label: "Revenue", on: true },
    { label: "Refunds", on: true },
    { label: "Taxes", on: false },
  ]);
  const [search, setSearch] = useState("");
  const [live, setLive] = useState({ allRevenue: 8746.22, pageViews: 12440, activeNow: 96 });

  useEffect(() => {
    const id = setInterval(() => {
      setLive((prev) => ({
        allRevenue: +(prev.allRevenue + Math.random() * 38).toFixed(2),
        pageViews: prev.pageViews + Math.round(Math.random() * 14),
        activeNow: Math.max(60, prev.activeNow + Math.round((Math.random() - 0.45) * 6)),
      }));
    }, 3200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setAnnounceIndex((i) => (i + 1) % announcements.length);
    }, 4200);
    return () => clearInterval(id);
  }, []);

  const activeRange = ranges[range];
  const filteredUsers = useMemo(
    () => dashboardUsers.filter((u) => u.name.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  return (
    <div className={isDark ? "bg-zinc-950 text-white" : "bg-white text-zinc-900"}>
      {/* Navbar */}
      <header
        className={`sticky top-0 z-50 border-b backdrop-blur transition-colors ${
          isDark ? "border-zinc-800 bg-zinc-950/80" : "border-zinc-100 bg-white/80"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-9">
            <a href="#" className="flex items-center gap-2">
              <img
                src={isDark ? "/logoW.png" : "/logo.png"}
                alt="BagUI logo"
                className="h-7 w-auto object-contain"
              />
            </a>
            <nav className="hidden items-center gap-7 lg:flex">
              {navLinks.map(({ label, chevron }) => (
                <a
                  key={label}
                  href="#"
                  className={`flex items-center gap-1 text-[13px] font-medium transition-colors ${
                    isDark ? "text-zinc-300 hover:text-white" : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  {label}
                  {chevron && (
                    <ChevronDown className={`h-3.5 w-3.5 ${isDark ? "text-zinc-500" : "text-zinc-400"}`} />
                  )}
                </a>
              ))}
            </nav>
          </div>

          <div className="hidden items-center gap-5 lg:flex">
            <button
              onClick={() => setIsDark((v) => !v)}
              aria-label="Toggle theme"
              className={`grid h-9 w-9 place-items-center rounded-full border transition-colors ${
                isDark ? "border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800" : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <a href="#" className={`text-[13px] font-medium ${isDark ? "text-zinc-300 hover:text-white" : "text-zinc-600 hover:text-zinc-900"}`}>
              Log in
            </a>
            <button className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors cursor-pointer ${
              isDark ? "bg-white text-zinc-900 hover:bg-zinc-200" : "bg-zinc-900 text-white hover:bg-zinc-800"
            }`}>
              Start free trial
            </button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsDark((v) => !v)}
              aria-label="Toggle theme"
              className={`grid h-8 w-8 place-items-center rounded-full border transition-colors ${
                isDark ? "border-zinc-700 bg-zinc-900 text-zinc-200" : "border-zinc-200 bg-white text-zinc-700"
              }`}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((v) => !v)}
              className={`rounded-md p-2 ${isDark ? "text-zinc-200" : "text-zinc-700"}`}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
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
              <div className={`flex flex-col gap-1 px-6 py-4 ${isDark ? "bg-zinc-950" : "bg-white"}`}>
                {navLinks.map(({ label }) => (
                  <a
                    key={label}
                    href="#"
                    className={`rounded-md px-2 py-2 text-sm font-medium ${
                      isDark ? "text-zinc-200 hover:bg-zinc-900" : "text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    {label}
                  </a>
                ))}
                <div className={`mt-2 flex flex-col gap-2 border-t pt-3 ${isDark ? "border-zinc-800" : "border-zinc-100"}`}>
                  <a href="#" className={`px-2 py-1 text-sm font-medium ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
                    Log in
                  </a>
                  <button className={`w-full rounded-full py-2.5 text-sm font-medium cursor-pointer ${
                    isDark ? "bg-white text-zinc-900" : "bg-zinc-900 text-white"
                  }`}>
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
        <div className="pointer-events-none absolute -right-6 top-14 hidden h-48 w-48 rotate-[16deg] border border-zinc-200/90 lg:block" />
        <div className="pointer-events-none absolute right-[19%] top-40 hidden h-px w-64 rotate-[-32deg] bg-zinc-200 lg:block" />

        <motion.div variants={container} initial="hidden" animate="show" className="relative mx-auto max-w-2xl">
          <motion.div variants={item}>
            <AnimatePresence mode="wait">
              <motion.a
                key={announceIndex}
                href="#"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
                className={`inline-flex items-center gap-3 rounded-full border py-1 pl-1 pr-3 text-xs shadow-sm transition-colors ${
                  isDark
                    ? "border-zinc-700 bg-zinc-900/80 text-zinc-200 hover:border-zinc-600"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                }`}
              >
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {announcements[announceIndex].tag}
                </span>
                <span className="flex items-center gap-1">
                  {announcements[announceIndex].text}
                  <ArrowUpRight className="h-3 w-3" />
                </span>
              </motion.a>
            </AnimatePresence>
          </motion.div>

          <motion.h1
            variants={item}
            className={`mt-6 text-[2.6rem] font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-[3.4rem] ${
              isDark ? "text-white" : "text-zinc-900"
            }`}
          >
            Dream big, build fast, and grow your online business.
          </motion.h1>

          <motion.p
            variants={item}
            className={`mt-5 max-w-md text-[15px] leading-relaxed ${
              isDark ? "text-zinc-300" : "text-zinc-600"
            }`}
          >
            Whether you&apos;re launching a new venture or scaling an established brand or product, our platform equips you to grow and thrive.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-5">
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-full bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 cursor-pointer"
            >
              Start free trial
            </motion.button>
            <div className={`text-xs leading-snug ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
              <p className={isDark ? "font-medium text-zinc-200" : "font-medium text-zinc-700"}>Get 7 days free</p>
              <p>then 3 months for $1/month</p>
            </div>

            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className={`ml-auto flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium shadow-sm transition-colors cursor-pointer lg:hidden ${
                isDark
                  ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:border-zinc-600"
                  : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300"
              }`}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900">
                <Play className="h-2.5 w-2.5 fill-white text-white" />
              </span>
              How it works
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className={`absolute right-16 top-[26rem] z-20 hidden items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium shadow-sm transition-colors cursor-pointer lg:flex ${
            isDark
              ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:border-zinc-600"
              : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300"
          }`}
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900">
            <Play className="h-2.5 w-2.5 fill-white text-white" />
          </span>
          How it works
        </motion.button>

        <motion.img
          src="/vector.svg"
          alt=""
          className="pointer-events-none absolute right-[7.5rem] top-[29.5rem] z-20 hidden h-48 w-40 rotate-[57.04deg] lg:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.9, ease: "easeInOut" }}
        />

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
          className="relative mx-auto mt-16 max-w-[64rem]"
        >
          <div className="pointer-events-none absolute inset-y-6 -left-6 hidden w-16 overflow-hidden rounded-l-xl border border-zinc-100 bg-zinc-50/80 opacity-70 blur-[0.5px] xl:block" />
          <div className="pointer-events-none absolute inset-y-6 -right-6 hidden w-16 overflow-hidden rounded-r-xl border border-zinc-100 bg-zinc-50/80 opacity-70 blur-[0.5px] xl:block" />

          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-900/10">
            {/* top bar */}
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-3">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-2 text-xs font-semibold text-zinc-900">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-zinc-900">
                    <ArrowUpRight className="h-3 w-3 text-white" />
                  </span>
                  <span className="hidden sm:inline">BagUI</span>
                </span>
                <nav className="hidden items-center gap-1 text-xs font-medium text-zinc-500 sm:flex">
                  {dashNav.map((label) => (
                    <button
                      key={label}
                      onClick={() => setActiveDashNav(label)}
                      className={`rounded-md px-2 py-1 transition-colors cursor-pointer ${
                        activeDashNav === label ? "bg-zinc-100 text-zinc-900" : "hover:text-zinc-800"
                      }`}
                    >
                      {label}
                    </button>
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
            <div className="flex items-center justify-between gap-4 border-b border-zinc-100 px-5">
              <div className="flex items-center gap-4 overflow-x-auto text-xs font-medium text-zinc-500">
                {dashTabs.map((label) => (
                  <button
                    key={label}
                    onClick={() => setActiveSubTab(label)}
                    className={`whitespace-nowrap border-b-2 py-3 transition-colors cursor-pointer ${
                      activeSubTab === label ? "border-zinc-900 text-zinc-900" : "border-transparent hover:text-zinc-700"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="hidden items-center gap-1.5 rounded-md border border-zinc-200 px-2.5 py-1.5 text-xs text-zinc-500 sm:flex">
                <Search className="h-3.5 w-3.5" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search"
                  className="w-24 bg-transparent outline-none placeholder:text-zinc-400"
                />
              </div>
            </div>

            {/* body */}
            <div className="h-[300px] overflow-y-auto px-5 py-5 sm:h-[320px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSubTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  {activeSubTab === "Overview" && (
                    <>
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                        My dashboard
                        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                          <motion.span
                            animate={{ opacity: [1, 0.35, 1] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                            className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                          />
                          Live
                        </span>
                      </h3>

                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="rounded-xl border border-zinc-200 p-4">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100">
                            <DollarSign className="h-3.5 w-3.5 text-zinc-600" />
                          </span>
                          <p className="mt-3 text-xs text-zinc-500">All revenue</p>
                          <div className="mt-1 flex items-baseline gap-2">
                            <span className="text-xl font-semibold tabular-nums text-zinc-900">
                              <LiveNumber value={formatCurrency(live.allRevenue)} />
                            </span>
                            <span className="flex items-center gap-0.5 text-[11px] font-medium text-emerald-600">
                              <ArrowUpRight className="h-3 w-3" />
                              2.4%
                            </span>
                          </div>
                        </div>

                        <div className="rounded-xl border border-zinc-200 p-4">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100">
                            <Eye className="h-3.5 w-3.5 text-zinc-600" />
                          </span>
                          <p className="mt-3 text-xs text-zinc-500">Page views</p>
                          <div className="mt-1 flex items-baseline gap-2">
                            <span className="text-xl font-semibold tabular-nums text-zinc-900">
                              <LiveNumber value={live.pageViews.toLocaleString()} />
                            </span>
                            <span className="flex items-center gap-0.5 text-[11px] font-medium text-emerald-600">
                              <ArrowUpRight className="h-3 w-3" />
                              6.2%
                            </span>
                          </div>
                        </div>

                        <div className="rounded-xl border border-zinc-200 p-4">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100">
                            <UsersIcon className="h-3.5 w-3.5 text-zinc-600" />
                          </span>
                          <p className="mt-3 text-xs text-zinc-500">Active now</p>
                          <div className="mt-1 flex items-baseline gap-2">
                            <span className="text-xl font-semibold tabular-nums text-zinc-900">
                              <LiveNumber value={live.activeNow.toString()} />
                            </span>
                            <span className="flex items-center gap-0.5 text-[11px] font-medium text-emerald-600">
                              <ArrowUpRight className="h-3 w-3" />
                              0.8%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="relative mt-3 rounded-xl border border-zinc-200 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="flex items-center gap-1 text-xs text-zinc-500">
                              Net revenue
                              <ChevronDown className="h-3 w-3" />
                            </p>
                            <div className="mt-1 flex items-baseline gap-2">
                              <span className="text-lg font-semibold tabular-nums text-zinc-900">
                                <LiveNumber value={formatCurrency(activeRange.total)} />
                              </span>
                              <span className="text-[11px] font-medium text-emerald-600">{activeRange.delta}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                            {(Object.keys(ranges) as RangeKey[]).map((key) => (
                              <button
                                key={key}
                                onClick={() => setRange(key)}
                                className={`rounded-md px-2 py-1 transition-colors cursor-pointer ${
                                  range === key ? "bg-zinc-900 text-white" : "hover:bg-zinc-100"
                                }`}
                              >
                                {ranges[key].label}
                              </button>
                            ))}
                            <div className="relative">
                              <button
                                onClick={() => setFiltersOpen((v) => !v)}
                                className="ml-1 flex items-center gap-1 rounded-md border border-zinc-200 px-2 py-1 hover:bg-zinc-50 cursor-pointer"
                              >
                                <SlidersHorizontal className="h-3 w-3" />
                                Filters
                              </button>
                              <AnimatePresence>
                                {filtersOpen && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-8 z-10 w-40 rounded-lg border border-zinc-200 bg-white p-2 shadow-lg"
                                  >
                                    {filters.map((f, i) => (
                                      <button
                                        key={f.label}
                                        onClick={() =>
                                          setFilters((prev) => prev.map((p, idx) => (idx === i ? { ...p, on: !p.on } : p)))
                                        }
                                        className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                                      >
                                        {f.label}
                                        <span className={`h-4 w-7 rounded-full transition-colors ${f.on ? "bg-zinc-900" : "bg-zinc-200"}`}>
                                          <span
                                            className={`block h-3 w-3 translate-y-0.5 rounded-full bg-white transition-transform ${
                                              f.on ? "translate-x-3.5" : "translate-x-0.5"
                                            }`}
                                          />
                                        </span>
                                      </button>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 h-28 sm:h-32">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={activeRange.data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                              <defs>
                                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#18181b" stopOpacity={0.18} />
                                  <stop offset="100%" stopColor="#18181b" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="name" hide />
                              <YAxis hide domain={["dataMin - 20", "dataMax + 20"]} />
                              <Tooltip content={<ChartTooltip />} />
                              <Area type="monotone" dataKey="value" stroke="#18181b" strokeWidth={2} fill="url(#revenueFill)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </>
                  )}

                  {activeSubTab === "Notifications" && (
                    <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-200">
                      {notifications.map(({ icon: Icon, title, desc, time, unread }) => (
                        <div key={title} className="flex items-start gap-3 p-4">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100">
                            <Icon className="h-4 w-4 text-zinc-600" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-medium text-zinc-900">{title}</p>
                              {unread && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                            </div>
                            <p className="mt-0.5 text-xs text-zinc-500">{desc}</p>
                          </div>
                          <span className="shrink-0 text-[11px] text-zinc-400">{time}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeSubTab === "Analytics" && (
                    <div>
                      <p className="text-xs font-medium text-zinc-500">Sessions by channel</p>
                      <div className="mt-4 space-y-3">
                        {channels.map(({ label, value }) => (
                          <div key={label}>
                            <div className="mb-1 flex items-center justify-between text-xs text-zinc-600">
                              <span>{label}</span>
                              <span className="font-medium text-zinc-900">{value}%</span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${value}%` }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="h-full rounded-full bg-zinc-900"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeSubTab === "Saved reports" && (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {savedReports.map(({ title, meta }) => (
                        <div key={title} className="flex items-start gap-3 rounded-xl border border-zinc-200 p-4">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100">
                            <Bookmark className="h-4 w-4 text-zinc-600" />
                          </span>
                          <div>
                            <p className="text-xs font-medium text-zinc-900">{title}</p>
                            <p className="mt-0.5 text-[11px] text-zinc-500">{meta}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeSubTab === "Scheduled reports" && (
                    <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-200">
                      {scheduledReports.map(({ title, freq, next, recipients }) => (
                        <div key={title} className="flex items-center justify-between gap-3 p-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100">
                              <Clock3 className="h-4 w-4 text-zinc-600" />
                            </span>
                            <div>
                              <p className="text-xs font-medium text-zinc-900">{title}</p>
                              <p className="mt-0.5 text-[11px] text-zinc-500">Next run {next}</p>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600">{freq}</span>
                            <span className="text-[11px] text-zinc-500">{recipients} recipients</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeSubTab === "User reports" && (
                    <div className="overflow-hidden rounded-xl border border-zinc-200">
                      <div className="divide-y divide-zinc-100">
                        {filteredUsers.length === 0 && (
                          <p className="p-4 text-xs text-zinc-500">No teammates match &ldquo;{search}&rdquo;.</p>
                        )}
                        {filteredUsers.map(({ name, role, status }) => (
                          <div key={name} className="flex items-center justify-between gap-3 p-3.5">
                            <div className="flex items-center gap-3">
                              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-zinc-300 to-zinc-400 text-[11px] font-medium text-white">
                                {name.split(" ").map((n) => n[0]).join("")}
                              </span>
                              <div>
                                <p className="text-xs font-medium text-zinc-900">{name}</p>
                                <p className="text-[11px] text-zinc-500">{role}</p>
                              </div>
                            </div>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              {status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}