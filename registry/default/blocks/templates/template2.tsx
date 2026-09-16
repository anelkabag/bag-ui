"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  MoreHorizontal,
  User,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────────────
   Template2 — "Identity platform" landing page
   Stack: Next.js (App Router) + Tailwind CSS + Framer Motion
   Fixed light palette (cream / lime / powder-blue), independent of the
   site-wide dark mode — the reference design is light-only.
──────────────────────────────────────────────────────────────────────── */

// ─── Palette (hardcoded — not part of the shadcn token system) ───────────
const paper = "#FAF8F3";
const grid = "#F3F0E9";
const line = "#E6E2D8";
const mark = "#D6D1C3";
const ink = "#18181A";
const sub = "#77746C";
const lime = "#E4F24C";
const sky = "#B7D9E2";

// ─── Motion ────────────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

const cardUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Corner "viewfinder" marks — the site's recurring section-frame motif ─
function CornerMark({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const posClasses: Record<typeof pos, string> = {
    tl: "left-0 top-0 -translate-x-1/2 -translate-y-1/2 border-l border-t",
    tr: "right-0 top-0 translate-x-1/2 -translate-y-1/2 border-r border-t",
    bl: "left-0 bottom-0 -translate-x-1/2 translate-y-1/2 border-l border-b",
    br: "right-0 bottom-0 translate-x-1/2 translate-y-1/2 border-r border-b",
  };
  return (
    <span
      style={{ borderColor: mark }}
      className={cn("pointer-events-none absolute h-3 w-3", posClasses[pos])}
    />
  );
}

function Framed({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      style={{ borderColor: line }}
      className={cn("relative border-t border-b", className)}
    >
      <CornerMark pos="tl" />
      <CornerMark pos="tr" />
      <CornerMark pos="bl" />
      <CornerMark pos="br" />
      {children}
    </div>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Product", dropdown: true },
  { label: "Resources", dropdown: true },
  { label: "Docs", dropdown: false },
  { label: "Pricing", dropdown: false },
] as const;

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header style={{ backgroundColor: paper }} className="relative z-30 w-full">
      <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-6 sm:px-10">
        <a href="/" className="text-[21px] font-extrabold tracking-tight" style={{ color: ink }}>
          BagUi
        </a>

        <nav className="hidden items-center gap-7 font-mono text-[13px] md:flex" style={{ color: "#4a4740" }}>
          {NAV_LINKS.map((item) => (
            <button
              key={item.label}
              className="flex items-center gap-1 transition-colors hover:text-neutral-950"
            >
              {item.label}
              {item.dropdown && <ChevronDown className="h-3 w-3" />}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-8 w-8 items-center justify-center md:hidden"
          style={{ color: ink }}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div
          style={{ borderColor: line }}
          className="border-t px-6 py-4 font-mono text-[13px] md:hidden"
        >
          <div className="flex flex-col gap-3" style={{ color: "#4a4740" }}>
            {NAV_LINKS.map((item) => (
              <span key={item.label} className="flex items-center gap-1">
                {item.label}
                {item.dropdown && <ChevronDown className="h-3 w-3" />}
              </span>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────
function Hero() {
  return (
    <Framed>
      <motion.div
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center px-6 py-20 text-center sm:px-10 md:py-24"
      >
        <motion.a
          href="#"
          variants={fadeUp}
          custom={0}
          className="mb-8 inline-flex items-center gap-1.5 rounded-[3px] px-3.5 py-[7px] font-mono text-[13px] font-medium transition-opacity hover:opacity-80"
          style={{ backgroundColor: lime, color: ink }}
        >
          Get agent-ready with Stytch Connected Apps
          <ArrowRight className="h-3.5 w-3.5" />
        </motion.a>

        <motion.h1
          variants={fadeUp}
          custom={1}
          className="max-w-3xl text-[40px] font-extrabold leading-[1.05] tracking-[-0.02em] sm:text-[54px] md:text-[62px]"
          style={{ color: ink }}
        >
          Identity platform built for what&apos;s next
        </motion.h1>

        <motion.p
          variants={fadeUp}
          custom={2}
          className="mt-6 max-w-xl text-[15px] leading-relaxed"
          style={{ color: sub }}
        >
          Authentication, authorization, and security—one integration to make
          your app{" "}
          <strong className="font-semibold" style={{ color: "#3a382f" }}>
            enterprise-ready
          </strong>
          ,{" "}
          <strong className="font-semibold" style={{ color: "#3a382f" }}>
            agent-ready
          </strong>
          , and{" "}
          <strong className="font-semibold" style={{ color: "#3a382f" }}>
            threat resistant
          </strong>
        </motion.p>

        <motion.div variants={fadeUp} custom={3} className="mt-8 flex items-center gap-3">
          <button
            className="rounded-[4px] px-5 py-2.5 font-mono text-[13px] font-semibold transition-colors hover:brightness-95"
            style={{ backgroundColor: sky, color: "#183034" }}
          >
            Get started for free
          </button>
          <button
            style={{ borderColor: "#E1DCCF", color: ink }}
            className="rounded-[4px] border bg-white px-5 py-2.5 font-mono text-[13px] font-semibold transition-colors hover:bg-neutral-50"
          >
            Request a demo
          </button>
        </motion.div>
      </motion.div>
    </Framed>
  );
}

// ─── Trusted-by logo strip ─────────────────────────────────────────────
const LOGOS = ["Mintlify", "_zapier", "Calendly", "groq", "HubSpot", "cisco"];

function LogoStrip() {
  return (
    <div style={{ borderColor: line }} className="border-b px-6 py-9 sm:px-10">
      <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-5">
        {LOGOS.map((name) => (
          <span
            key={name}
            className="select-none font-mono text-[15px] font-semibold tracking-tight opacity-45 grayscale"
            style={{ color: ink }}
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Small shared mockup atoms ─────────────────────────────────────────
function MiniToggle({ on }: { on: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-[14px] w-[24px] shrink-0 items-center rounded-full border p-[2px]",
        on ? "justify-end border-neutral-900 bg-neutral-900" : "justify-start border-neutral-300 bg-white",
      )}
    >
      <span className={cn("h-[8px] w-[8px] rounded-full", on ? "bg-white" : "bg-neutral-300")} />
    </span>
  );
}

function ArcPattern() {
  return (
    <div className="pointer-events-none absolute -bottom-6 -right-6 h-32 w-32 opacity-[0.35]">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="absolute rounded-full border"
          style={{
            borderColor: "#C9C4B5",
            inset: i * 12,
          }}
        />
      ))}
    </div>
  );
}

// ─── Feature 1 — Embeddable admin portal ───────────────────────────────
function AdminPortalMock() {
  const rows = ["Google SAML", "Okta OIDC", "Custom SAML", "Custom OIDC"];
  return (
    <div className="overflow-hidden rounded-[6px] border border-neutral-200 bg-white shadow-sm">
      <div className="flex items-center gap-1.5 border-b border-neutral-100 px-3 py-2">
        <span className="h-[6px] w-[6px] rounded-full bg-neutral-200" />
        <span className="h-[6px] w-[6px] rounded-full bg-neutral-200" />
        <span className="h-[6px] w-[6px] rounded-full bg-neutral-200" />
      </div>
      <div className="flex items-center justify-between border-b border-neutral-100 px-3 py-2 font-mono text-[10.5px]">
        <div className="flex items-center gap-3 text-neutral-400">
          <span className="border-b-2 border-sky-500 pb-1 font-semibold text-sky-600">SSO</span>
          <span>Organization</span>
          <span>Members</span>
          <span>SCIM</span>
        </div>
        <User className="h-3 w-3 text-neutral-300" />
      </div>
      <div className="divide-y divide-neutral-100">
        {rows.map((r) => (
          <div key={r} className="flex items-center justify-between px-3 py-[7px] font-mono text-[10.5px]">
            <span className="font-medium text-neutral-800">{r}</span>
            <div className="flex items-center gap-2">
              <span className="text-neutral-400">Active</span>
              <MoreHorizontal className="h-3 w-3 text-neutral-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Feature 2 — Enterprise-grade authentication ───────────────────────
function CodeAuthMock() {
  const lines: { n: string; content: React.ReactNode; active?: boolean }[] = [
    { n: "01", content: <><span className="text-rose-300">const</span> config = {"{"}</> },
    { n: "02", content: <span className="pl-3 text-neutral-400">products: [</span> },
    { n: "03", content: <span className="pl-6 text-amber-300">&apos;passkeys&apos;</span>, active: true },
    { n: "04", content: <span className="pl-3 text-neutral-400">],</span> },
    { n: "05", content: <span className="text-neutral-400">{"}"};</span> },
    { n: "06", content: <span>&nbsp;</span> },
    { n: "07", content: <><span className="text-sky-300">stytch</span>.<span className="text-violet-300">mountLogin</span>({"{"}</> },
    { n: "08", content: <span className="pl-3 text-neutral-400">elementId: <span className="text-amber-300">&apos;#login-form&apos;</span></span> },
  ];
  return (
    <div className="overflow-hidden rounded-[6px] bg-[#211F1B] p-3 font-mono text-[10px] leading-[1.9] shadow-sm">
      {lines.map((l) => (
        <div
          key={l.n}
          className={cn("flex gap-3 rounded-[2px] px-1", l.active && "bg-white/10")}
        >
          <span className="w-3 shrink-0 text-neutral-600">{l.n}</span>
          <span className="whitespace-pre text-neutral-300">{l.content}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Feature 3 — SMS and email provider failover ───────────────────────
function FailoverMock() {
  return (
    <div className="relative flex flex-col gap-2 overflow-hidden">
      <ArcPattern />
      <div className="relative z-10 flex items-center justify-between rounded-[4px] border border-neutral-200 bg-white px-3 py-2 font-mono text-[11px]">
        <span className="font-medium text-neutral-800">Provider</span>
        <div className="flex items-center gap-2 text-neutral-400">
          <span>200</span>
          <MiniToggle on />
        </div>
      </div>
      <div className="relative z-10 flex items-center justify-between rounded-[4px] border border-dashed border-neutral-200 bg-white/60 px-3 py-2 font-mono text-[11px] text-neutral-300">
        <span>Failover</span>
        <MiniToggle on={false} />
      </div>
    </div>
  );
}

// ─── Feature 4 — Connect your users to other applications ─────────────
function ConnectedAppsMock() {
  return (
    <div className="rounded-[6px] border border-neutral-200 bg-white p-3.5 shadow-sm">
      <p className="font-mono text-[11px] font-bold leading-snug text-neutral-900">
        Slack is requesting access to {"{{Project}}"}
      </p>
      <p className="mt-2.5 font-mono text-[10px] text-neutral-400">Allow ChatGPT to:</p>
      <div className="mt-1 flex items-center justify-between font-mono text-[10.5px] text-neutral-600">
        <span>• View your information</span>
        <ChevronDown className="h-3 w-3 -rotate-90 text-neutral-300" />
      </div>
      <button className="mt-3 w-full rounded-[4px] bg-neutral-900 py-2 font-mono text-[11px] font-semibold text-white">
        Allow
      </button>
    </div>
  );
}

// ─── Feature 5 — Machine-to-machine authentication ─────────────────────
function M2MMock() {
  return (
    <div className="rounded-[6px] font-mono text-[10.5px] leading-[1.85]">
      <p><span className="text-violet-400">m2m_client</span>: {"{"}</p>
      <p className="pl-3 text-neutral-400">client_id:</p>
      <p className="pl-3 text-neutral-700">m2m-client-d123456d-abcd7</p>
      <p className="pl-3 text-neutral-400">client_secret:</p>
      <p className="pl-3 text-neutral-700">••••••.••••••.•••••••</p>
      <p className="pl-3 text-neutral-400">client_name:</p>
      <p className="pl-3 text-neutral-700">Hello World</p>
    </div>
  );
}

// ─── Feature 6 — Turnkey multi-tenancy ─────────────────────────────────
function TenancyMock() {
  const rowsA = [
    { label: "Magic Links", on: false },
    { label: "OAuth", on: false },
    { label: "Passwords", on: false },
    { label: "SSO", on: true },
    { label: "MFA Required", on: true },
  ];
  const rowsB = [
    { label: "Magic Links", on: false },
    { label: "OAuth", on: false },
    { label: "Passwords", on: true },
    { label: "SSO", on: false },
    { label: "MFA Required", on: true },
  ];

  const Org = ({ name, rows }: { name: string; rows: typeof rowsA }) => (
    <div className="flex-1 overflow-hidden rounded-[6px] border border-neutral-200 bg-white">
      <div className="bg-neutral-900 px-2.5 py-1.5 text-center font-mono text-[10px] font-semibold text-white">
        {name}
      </div>
      <div className="divide-y divide-neutral-100">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between px-2.5 py-1.5 font-mono text-[9.5px] text-neutral-700">
            {r.label}
            <MiniToggle on={r.on} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex gap-2">
      <Org name="Organization A" rows={rowsA} />
      <Org name="Organization B" rows={rowsB} />
    </div>
  );
}

// ─── Feature 7 — Bot and fraud protection ───────────────────────────────
function BotProtectionMock() {
  const rows = [
    { icon: User, label: "User", pattern: "sparse" as const },
    { icon: Bot, label: "Bot", pattern: "dense" as const },
    { icon: User, label: "User", pattern: "sparse" as const },
  ];
  return (
    <div className="flex flex-col gap-3">
      {rows.map((r, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="flex shrink-0 items-center gap-1 rounded-[3px] border border-neutral-200 bg-white px-2 py-1 font-mono text-[10px] font-medium text-neutral-700">
            <r.icon className="h-3 w-3" />
            {r.label}
          </span>
          <div className="relative h-px flex-1 bg-neutral-200">
            {r.pattern === "dense" ? (
              <div className="absolute inset-0 flex items-center justify-between">
                {Array.from({ length: 24 }).map((_, j) => (
                  <span key={j} className="h-[3px] w-[3px] bg-neutral-900" />
                ))}
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-between px-6">
                {Array.from({ length: 3 }).map((_, j) => (
                  <span key={j} className="h-[3px] w-[3px] bg-neutral-900" />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Feature 8 — Web & mobile UI components ─────────────────────────────
function PhoneMock() {
  return (
    <div className="flex justify-center">
      <div className="w-[132px] rounded-[16px] border-[3px] border-neutral-900 bg-white p-2.5 shadow-sm">
        <div className="mx-auto mb-3 h-[4px] w-8 rounded-full bg-neutral-900" />
        <p className="text-center font-mono text-[10.5px] font-bold text-neutral-900">
          Sign up or log in
        </p>
        <div className="mt-3 rounded-[4px] border border-neutral-200 px-2 py-1.5 font-mono text-[9px] text-neutral-400">
          example@email.com
        </div>
        <button className="mt-2 w-full rounded-[4px] bg-neutral-900 py-1.5 font-mono text-[9.5px] font-semibold text-white">
          Continue
        </button>
      </div>
    </div>
  );
}

// ─── Feature 9 — Device-aware multifactor auth ──────────────────────────
function MfaMock() {
  return (
    <div className="relative overflow-hidden">
      <ArcPattern />
      <div className="relative z-10 flex gap-1.5">
        {[true, true, false, false, false, false].map((filled, i) => (
          <span
            key={i}
            className={cn(
              "flex h-8 w-6 items-center justify-center rounded-[4px] border font-mono text-[12px]",
              filled
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-neutral-200 bg-white text-transparent",
            )}
          >
            {filled ? "＊" : "0"}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Feature grid data ───────────────────────────────────────────────────
const FEATURES: { title: string; description: string; visual: React.ReactNode }[] = [
  {
    title: "Embeddable admin portal",
    description:
      "Let your enterprise customers self-serve authentication configuration, SSO setup, SCIM, and organization settings.",
    visual: <AdminPortalMock />,
  },
  {
    title: "Enterprise-grade authentication",
    description:
      "From passkeys, to breach-resistant passwords, to SAML SSO.",
    visual: <CodeAuthMock />,
  },
  {
    title: "SMS and email provider failover",
    description:
      "Reliable and timely delivery of login or authentication emails and text messages.",
    visual: <FailoverMock />,
  },
  {
    title: "Connect your users to other applications",
    description:
      "Power cross-application integrations, secure data sharing, AI workflows, and more with Connected Apps.",
    visual: <ConnectedAppsMock />,
  },
  {
    title: "Machine-to-machine authentication",
    description:
      "Enable your services to communicate and authenticate without any human involvement.",
    visual: <M2MMock />,
  },
  {
    title: "Turnkey multi-tenancy",
    description:
      "Including organization authentication policies, IdP-driven role mapping, JIT Provisioning controls, SCIM and more.",
    visual: <TenancyMock />,
  },
  {
    title: "Bot and fraud protection with intelligent rate limiting",
    description:
      "Secure your application with zero-day device intelligence, 99.99% bot detection accuracy, and reverse engineering protection.",
    visual: <BotProtectionMock />,
  },
  {
    title: "Web & mobile UI components",
    description: "Customize your login experience with pre-built components.",
    visual: <PhoneMock />,
  },
  {
    title: "Device-aware multifactor auth",
    description:
      "Device fingerprint-powered invisible CAPTCHA and MFA removes login friction.",
    visual: <MfaMock />,
  },
];

function FeatureGrid() {
  return (
    <div style={{ backgroundColor: grid }} className="grid grid-cols-1 md:grid-cols-3">
      {FEATURES.map((f, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const isLastCol = col === 2;
        const isLastRow = row === 2;
        const isLastItem = i === FEATURES.length - 1;
        return (
          <motion.div
            key={f.title}
            variants={cardUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            style={{ borderColor: line }}
            className={cn(
              "flex flex-col gap-5 p-7 sm:p-8",
              !isLastItem && "border-b",
              "md:border-b-0",
              !isLastCol && "md:border-r",
              !isLastRow && "md:border-b",
            )}
          >
            <div>
              <h3 className="text-[15px] font-bold leading-snug" style={{ color: ink }}>
                {f.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed" style={{ color: sub }}>
                {f.description}
              </p>
            </div>
            <div className="mt-auto pt-2">{f.visual}</div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────
export default function Template2() {
  return (
    <div style={{ backgroundColor: paper }} className="w-full font-sans">
      <Navbar />
      <div style={{ borderColor: line }} className="mx-auto max-w-6xl border-x">
        <Hero />
        <LogoStrip />
        <Framed className="h-20 sm:h-24 md:h-28" />
        <FeatureGrid />
        <div style={{ borderColor: line }} className="relative border-t">
          <CornerMark pos="tl" />
          <CornerMark pos="tr" />
        </div>
      </div>
    </div>
  );
}