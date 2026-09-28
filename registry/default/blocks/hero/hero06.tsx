"use client";

import { useState } from "react";
import { motion, MotionConfig } from "motion/react";
import { Menu, X } from "lucide-react";

/* ───────────── Constantes ───────────── */
const BRAND = "Doffly";
const EASE = [0.22, 1, 0.36, 1] as const;

// Grain (ex-.noise-panel::after) — rendu via un <div> réel, un pseudo-élément ne peut pas porter de style inline
const NOISE_URL = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.3' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1.8 -0.35'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const NAV_ITEMS = [
  { label: "Cloud Sessions", href: "#" },
  { label: "Agents API", href: "#" },
  { label: "Playground", href: "#" },
  { label: "Docs", href: "#docs" },
];

const STATS = [
  { value: "<1s", label: "From Request to Render" },
  { value: "300,000+", label: "Cloud Sessions Deployed" },
  { value: "98B+", label: "Browser Events Processed" },
];

const CHAT = [
  { from: "user", text: "Scrape top coworking spaces near Lisbon." },
  { from: "agent", text: "Found 12. Best match: Heden Workspace — 24/7 access, 5G Wi-Fi, $160/month." },
  { from: "user", text: "Generate monthly access pass and sync to calendar." },
  { from: "agent", text: "Done. Event created for Monday 9 AM." },
] as const;

const SCHEDULE = [
  { t1: "09:10", l1: "CRM Sync", t2: "09:35", l2: "Email Update" },
  { t1: "10:00", l1: "Stripe", t2: "10:25", l2: "Slack Summary" },
  { t1: "12:05", l1: "DB Backup", t2: "12:45", l2: "Cloud Archive" },
];

const HERO_LINES = ["The browser engine", "for autonomous AI"];

/* ───────────── Petits éléments ───────────── */
function Logo() {
  return (
    <img
      src="/logo.png"
      alt="Logo"
      width={26}
      height={26}
      aria-hidden="true"
      className="rounded-[3px] border border-[#d1d5db]/70 bg-[#ececea] object-cover"
    />
  );
}

function GithubIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function HatchedDivider({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`h-8 border-x border-[#d1d5db] ${className}`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(-45deg, transparent 0px, transparent 2px, rgba(0,0,0,0.16) 2px, rgba(0,0,0,0.16) 3px)",
      }}
    />
  );
}

/* ───────────── Header ───────────── */
function Header() {
  const [open, setOpen] = useState(false);
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="border border-[#d1d5db]"
    >
      <div className="flex h-[54px] items-center justify-between px-4">
        <div className="flex items-center gap-10">
          <a href="#" aria-label={`${BRAND} home`}><Logo /></a>
          <nav aria-label="Main" className="hidden gap-6 text-xs font-medium md:flex">
            {NAV_ITEMS.map((n) => (
              <a key={n.label} href={n.href} className="transition-colors hover:text-[#858585]">{n.label}</a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <a href="#" aria-label="Star on GitHub" className="hidden items-center gap-1.5 rounded-[3px] border border-[#d1d5db]/70 px-3 py-2 font-mono sm:flex">
            <GithubIcon /> 6K
          </a>
          <a href="#" className="rounded-[3px] border border-[#d1d5db] bg-[#19c7e8] px-4 py-2 font-medium transition-opacity hover:opacity-85">Get Started</a>
          <button
            type="button"
            className="ml-1 p-1.5 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="flex flex-col border-t border-[#d1d5db] text-sm md:hidden">
          {NAV_ITEMS.map((n) => (
            <a key={n.label} href={n.href} className="border-b border-[#d1d5db]/40 px-4 py-3 last:border-b-0">{n.label}</a>
          ))}
        </nav>
      )}
    </motion.header>
  );
}

/* ───────────── Boutons CTA ───────────── */
function CTAButtons() {
  const corner = "absolute size-[5px] bg-[#ececea]";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.95, ease: EASE }}
      className="mt-8 flex flex-wrap justify-center gap-3"
    >
      <a href="#playground" className="rounded-[3px] border border-[#d1d5db] bg-[#19c7e8] px-6 py-2.5 font-mono text-[11px] font-medium transition-opacity hover:opacity-85">
        Launch Playground
      </a>
      <a id="docs" href="#docs" className="relative rounded-[3px] border border-[#d1d5db]/70 px-6 py-2.5 font-mono text-[11px] transition-colors hover:bg-[#ececea] hover:text-white">
        <span aria-hidden className={`${corner} -left-[3px] -top-[3px]`} />
        <span aria-hidden className={`${corner} -right-[3px] -top-[3px]`} />
        <span aria-hidden className={`${corner} -bottom-[3px] -left-[3px]`} />
        <span aria-hidden className={`${corner} -bottom-[3px] -right-[3px]`} />
        Read Docs
      </a>
    </motion.div>
  );
}

/* ───────────── Fenêtres de démo ───────────── */
function BrowserWindow({ children, label, className = "", duration = 7, delay = 0 }: {
  children: React.ReactNode; label: string; className?: string; duration?: number; delay?: number;
}) {
  return (
    <motion.div
      role="img"
      aria-label={label}
      animate={{ y: [0, -5, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
      className={`rounded-[4px] border border-white/10 bg-black p-5 text-white shadow-[0_0_50px_rgba(25,199,232,0.18)] ${className}`}
    >
      <div aria-hidden className="mb-4 flex gap-1.5">
        <span className="size-1.5 rounded-full bg-[#ff5f57]" />
        <span className="size-1.5 rounded-full bg-[#febc2e]" />
        <span className="size-1.5 rounded-full bg-[#28c840]" />
      </div>
      {children}
    </motion.div>
  );
}

function BrowserDemo() {
  return (
    <div className="px-4 pb-4 md:mx-[5%] md:px-0 md:pb-14">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.1, ease: EASE }}
        className="relative isolate grid gap-4 bg-[#061f28] p-4 [background-image:radial-gradient(ellipse_55%_75%_at_80%_15%,#8bf0ff_0%,transparent_55%),radial-gradient(ellipse_70%_50%_at_15%_95%,#0e9ab8_0%,transparent_60%),radial-gradient(ellipse_60%_45%_at_45%_55%,#0a4a5f_0%,transparent_70%)] md:grid-cols-[0.95fr_1fr] md:items-start md:p-10"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-60 mix-blend-overlay"
          style={{ backgroundImage: NOISE_URL }}
        />

        <BrowserWindow label="Agent chat: scraping coworking spaces and creating a calendar event" className="text-xs">
          <ul className="flex flex-col gap-4">
            {CHAT.map((m, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 + i * 0.8, duration: 0.45 }}
                className="flex gap-3 leading-snug"
              >
                <span className={`mt-0.5 size-4 shrink-0 rounded-[3px] ${m.from === "user" ? "bg-[#3d5afe]" : "bg-[#3bb8a4]"}`} />
                <span className={m.from === "agent" ? "font-mono text-white/80" : ""}>{m.text}</span>
              </motion.li>
            ))}
          </ul>
        </BrowserWindow>

        <BrowserWindow label="Automation schedule dashboard" duration={9} delay={1} className="font-mono">
          <ul className="flex flex-col gap-5 pt-1">
            {SCHEDULE.map((r, i) => (
              <motion.li
                key={r.t1}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.3 + i * 0.5, duration: 0.5 }}
              >
                <div className="flex items-baseline gap-2 text-[13px]">
                  <span>{r.t1}</span>
                  <span aria-hidden className="flex-1 border-b border-dotted border-white/50" />
                  <span>{r.t2}</span>
                </div>
                <div className="mt-1 flex justify-between text-[10px] text-white/60">
                  <span>{r.l1}</span>
                  <span>{r.l2}</span>
                </div>
              </motion.li>
            ))}
          </ul>
        </BrowserWindow>
      </motion.div>
    </div>
  );
}

/* ───────────── Hero ───────────── */
function Hero() {
  return (
    <section className="border border-[#d1d5db]">
      <div className="flex flex-col items-center px-5 pb-14 pt-24 text-center">
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
          className="mb-8 flex items-center gap-2 font-mono text-[8px] uppercase tracking-wider"
        >
          <span aria-hidden className="size-1 rounded-full bg-[#ececea]" />
          New announcement on X <span aria-hidden className="text-[#858585]">-</span>
          <a href="#" className="text-[#19c7e8]">Read more</a>
        </motion.p>

        <h1 className="max-w-3xl text-[clamp(2.4rem,6vw,4.4rem)] font-normal leading-[1.02] tracking-[-0.03em]">
          {HERO_LINES.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className="block"
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.75, delay: 0.4 + i * 0.12, ease: EASE }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 max-w-[420px] font-mono text-[11px] leading-relaxed text-[#858585]"
        >
          {BRAND} runs, controls, and scales browsers in the cloud — built for developers creating agents, scrapers, and automation at massive scale.
        </motion.p>

        <CTAButtons />
      </div>
      <BrowserDemo />
    </section>
  );
}

/* ───────────── Stats ───────────── */
function Stats() {
  return (
    <section aria-label="Key figures" className="grid border border-[#d1d5db] sm:grid-cols-3">
      {STATS.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
          className={`px-3 py-3 ${i > 0 ? "border-t border-[#d1d5db] sm:border-l sm:border-t-0" : ""}`}
        >
          <p className="text-2xl font-normal tracking-tight">{s.value}</p>
          <p className="mt-2 font-mono text-[10px] text-[#858585]">{s.label}</p>
        </motion.div>
      ))}
    </section>
  );
}

/* ───────────── Use cases ───────────── */
function UseCases() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: EASE }}
      className="border-x border-b border-[#d1d5db] px-5 pb-24 pt-16 md:px-8"
    >
      <p className="mb-6 flex items-center gap-2 font-mono text-[8px] uppercase tracking-wider md:pl-3">
        <span aria-hidden className="size-1 rounded-full bg-[#ececea]" /> Use cases
      </p>
      <h2 className="max-w-md text-[clamp(2rem,4.5vw,3.2rem)] font-normal leading-[1.02] tracking-[-0.03em]">
        What Developers Power with {BRAND}
      </h2>
      <p className="mt-6 max-w-[340px] font-mono text-[11px] leading-relaxed text-[#858585]">
        From smart crawlers to real-time web agents, {BRAND} runs your automations inside fully managed browsers — fast, scalable, and built for the modern AI stack.
      </p>
    </motion.section>
  );
}

/* ───────────── Page ───────────── */
export default function Page() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="mx-auto min-h-screen max-w-[1280px] overflow-x-clip p-3.5 font-sans [--font-sans:var(--font-grotesk),ui-sans-serif,system-ui,sans-serif] [--font-mono:var(--font-space-mono),ui-monospace,monospace] [&_*:focus-visible]:outline-2 [&_*:focus-visible]:outline-offset-[3px] [&_*:focus-visible]:outline-[#19c7e8]">
        <Header />
        <HatchedDivider className="border-t-0" />
        <main className="flex flex-col">
          <Hero />
          <HatchedDivider />
          <Stats />
          <UseCases />
        </main>
      </div>
    </MotionConfig>
  );
}