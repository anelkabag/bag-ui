"use client";

/**
 * Footer3
 * ────────────────────────────────────────────────────────────────────────
 * A CTA banner + footer section, reproduced from the provided screenshot,
 * restyled with BagUI's design tokens (bagui.vercel.app):
 *   - Font: Geist (next/font/google) — falls back to Inter/system-ui if
 *     the project hasn't wired up the --font-geist-sans CSS variable yet.
 *   - Colors: BagUI's monochrome shadcn "neutral" system — near-black
 *     (#09090b / zinc-950) surfaces, white, and the zinc gray scale.
 *     No blue — the original hero gradient is reinterpreted as a
 *     monochrome ambient light on a zinc-950 panel.
 *
 * Dependencies (already present in a standard BagUI/shadcn setup):
 *   npm install motion/react lucide-react
 *
 * Font setup (in app/layout.tsx), same as BagUI:
 *   import { Geist } from "next/font/google";
 *   const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
 *   <body className={`${geistSans.variable} font-sans`}>...
 */

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ChevronRight } from "lucide-react";
import {
  FaXTwitter, // X
  FaInstagram, // Instagram
  FaLinkedin, // LinkedIn
  FaFacebook,
} from "react-icons/fa6";

// ─── Font stack (Geist first, graceful fallback) ──────────────────────────
const font = {
  fontFamily: "var(--font-geist-sans), Geist, Inter, system-ui, sans-serif",
} as const;

// ─── Motion variants ───────────────────────────────────────────────────────
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const heroVariant: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// ─── Content ────────────────────────────────────────────────────────────────
const PRODUCT_LINKS = ["Features", "Pricing", "Integrations", "AI Agents"];
const RESOURCE_LINKS = [
  "Documentation",
  "Case Studies",
  "Blog",
  "Support Center",
];

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const SOCIALS: {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}[] = [
  { id: "linkedin", label: "LinkedIn", icon: FaLinkedin, href: "#" },
  { id: "x", label: "X", icon: XIcon, href: "#" },
  { id: "instagram", label: "Instagram", icon: FaFacebook, href: "#" },
];

// ─── Hero / CTA banner ──────────────────────────────────────────────────────
function HeroBanner() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={heroVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      className="relative isolate overflow-hidden rounded-[32px] bg-muted px-6 py-20 text-center text-foreground sm:py-28 dark:bg-zinc-950 dark:text-white"
    >
      {/* ambient glow rising from the bottom, monochrome instead of blue */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_65%_at_50%_120%,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0.04)_35%,transparent_68%)] dark:bg-[radial-gradient(120%_65%_at_50%_120%,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0.08)_35%,transparent_68%)]"
        animate={reduceMotion ? undefined : { opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* faint converging light beams */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[conic-gradient(from_205deg_at_50%_105%,transparent_0deg,rgba(0,0,0,0.06)_35deg,transparent_80deg,transparent_280deg,rgba(0,0,0,0.06)_325deg,transparent_360deg)] dark:bg-[conic-gradient(from_205deg_at_50%_105%,transparent_0deg,rgba(255,255,255,0.10)_35deg,transparent_80deg,transparent_280deg,rgba(255,255,255,0.10)_325deg,transparent_360deg)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/10 to-transparent blur-2xl dark:from-white/15"
      />

      <div className="relative z-10 mx-auto max-w-2xl">
        <h2
          style={font}
          className="text-3xl font-semibold leading-[1.15] tracking-tight text-foreground sm:text-5xl dark:text-white"
        >
          Transform customer support
          <br className="hidden sm:block" /> with intelligent AI agents
        </h2>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={font}
          className="mt-9 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted dark:focus-visible:ring-offset-zinc-950"
        >
          Start Free Trial
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}

function SocialLink({
  icon: Icon,
  href,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors duration-200 hover:border-foreground hover:bg-foreground hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}

function BrandColumn() {
  return (
    <motion.div variants={fadeUp} className="flex flex-col gap-5 lg:max-w-xs">
      <div className="flex items-center gap-2">
        <Image src="/logo.png" alt="BagUI Logo" width={20} height={20} className="object-contain dark:hidden" />
        <Image src="/logoW.png" alt="BagUI Logo" width={20} height={20} className="hidden object-contain dark:block" />

        <span style={font} className="text-lg font-semibold text-foreground">
          Bag\Ui
        </span>
      </div>
      <p style={font} className="text-sm leading-relaxed text-muted-foreground">
        Modern AI support platform designed to automate conversations and
        deliver faster customer responses.
      </p>
      <div className="flex items-center gap-2.5">
        {SOCIALS.map((s) => (
          <SocialLink key={s.id} icon={s.icon} href={s.href} label={s.label} />
        ))}
      </div>
    </motion.div>
  );
}

function LinkColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <motion.div variants={fadeUp} className="flex flex-col gap-4">
      <h4 style={font} className="text-sm font-semibold text-foreground">
        {title}
      </h4>
      <ul className="flex flex-col gap-3">
        {links.map((l) => (
          <li key={l}>
            <a
              href="#"
              style={font}
              className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              {l}
            </a>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function CompanyColumn() {
  const [email, setEmail] = useState("");

  return (
    <motion.div variants={fadeUp} className="flex flex-col gap-4">
      <h4 style={font} className="text-sm font-semibold text-foreground">
        Company
      </h4>
      <p style={font} className="text-sm leading-relaxed text-muted-foreground">
        Helping teams create faster, smarter, and more reliable customer support
        experiences with AI
      </p>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex items-center justify-between gap-1 rounded-full border border-border py-1 pl-4 pr-1 transition-colors duration-200 focus-within:border-ring"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          style={font}
          className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={font}
          className="flex shrink-0 items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Subscribe
          <ChevronRight className="h-3.5 w-3.5" />
        </motion.button>
      </form>
    </motion.div>
  );
}

// ─── Bottom bar ─────────────────────────────────────────────────────────────
function BottomBar() {
  const year = new Date().getFullYear();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      className="mt-10 flex flex-col items-center justify-between gap-3 rounded-xl bg-muted px-6 py-4 text-muted-foreground sm:flex-row"
    >
      <p style={font} className="text-xs text-muted-foreground">
        © {year} Bag\Ui. All rights reserved.
      </p>
      <div
        style={font}
        className="flex items-center gap-4 text-xs text-muted-foreground"
      >
        <a
          href="#"
          className="transition-colors duration-200 hover:text-foreground"
        >
          Privacy Policy
        </a>
        <span className="h-3 w-px bg-border" aria-hidden />
        <a
          href="#"
          className="transition-colors duration-200 hover:text-foreground"
        >
          Terms &amp; Conditions
        </a>
      </div>
    </motion.div>
  );
}

// ─── Main export ────────────────────────────────────────────────────────────
export default function Footer3() {
  return (
    <footer className="w-full px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <HeroBanner />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]"
        >
          <BrandColumn />
          <LinkColumn title="Product" links={PRODUCT_LINKS} />
          <LinkColumn title="Resources" links={RESOURCE_LINKS} />
          <CompanyColumn />
        </motion.div>

        <BottomBar />
      </div>
    </footer>
  );
}
