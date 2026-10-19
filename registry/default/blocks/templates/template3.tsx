// app/page.tsx — BagUI landing, single file (Next.js App Router + Tailwind CSS v4)
// Aucun CSS externe : tout est en classes Tailwind (valeurs arbitraires pour les dégradés).
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter_Tight } from "next/font/google";

const font = Inter_Tight({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BagUI – Open Source shadcn/ui Components & Blocks",
  description:
    "BagUI is an open-source shadcn/ui registry with production-ready components, blocks, templates, and animations for React, Next.js, and Tailwind CSS.",
};

/* ---------- Données ---------- */
const B = "https://www.bagui.pro";
const GH = "https://github.com/anelkabag/bag-ui";

type Item = { i: string; t: string; d: string };

const intro: Item[] = [
  { i: "⚛", t: "Built on React & shadcn/ui", d: "Production-ready sections for React, Next.js and Tailwind CSS." },
  { i: "⎘", t: "Copy, customize, ship", d: "Plug a block into your project, make it yours and go live with confidence." },
  { i: "♡", t: "Open source, built together", d: "Free to use and open to contributions from the community on GitHub." },
];
const library: Item[] = [
  { i: "◍", t: "Hero", d: "6 blocks to open your page with a strong first impression." },
  { i: "✓", t: "Feature", d: "6 blocks to present what your product does, clearly." },
  { i: "❏", t: "Pricing", d: "4 blocks to lay out your plans and convert visitors." },
];
const stack: Item[] = [
  { i: "▲", t: "Next.js ready", d: "Components made for React, Next.js and Tailwind CSS projects." },
  { i: "TS", t: "Written in TypeScript", d: "Typed components that are easy to read, extend and maintain." },
  { i: "✦", t: "Animations included", d: "Production-ready components, blocks, templates and animations." },
];
const useCases: Item[] = [
  { i: "▤", t: "Landing pages", d: "Hero, feature, pricing, testimonial, CTA, FAQ and footer blocks that fit together." },
  { i: "❒", t: "Templates", d: "Start a project faster with ready-made templates built from the same blocks." },
  { i: "◫", t: "Dashboards", d: "Dashboard components to extend your product beyond the marketing site." },
  { i: "↻", t: "Docs & changelog", d: "Follow every release in the changelog and learn the setup in the docs." },
];
const navLinks = ["Blocks", "Templates", "Changelog", "Pricing", "Docs"];
const footerCols: [string, [string, string][]][] = [
  ["Product", [["Blocks", `${B}/blocks`], ["Templates", `${B}/templates`], ["Pricing", `${B}/pricing`], ["Docs", `${B}/docs`], ["Changelog", `${B}/changelog`]]],
  ["More", [["FAQ", `${B}/#faq`], ["Login", `${B}/login`]]],
  ["Legal", [["License", `${B}/license`], ["Privacy", `${B}/privacy`], ["Terms", `${B}/terms`], ["Contact", "mailto:anelka.bag@gmail.com"]]],
  ["Community", [["GitHub", GH], ["Discord", "https://discord.gg/zScDvSZDJE"], ["X", "https://x.com/BagUi_pro"], ["LinkedIn", "https://www.linkedin.com/company/baguioff/"], ["YouTube", "https://youtube.com/@anelkabag"]]],
];

/* ---------- Styles réutilisables (dégradés orange) ---------- */
const ORB =
  "bg-[radial-gradient(circle_at_30%_30%,#e8854a_0,#c9652d_40%,#5a2a10_68%,#0c0502_80%)] shadow-[inset_6px_8px_22px_rgba(255,190,140,0.45)]";
const ARC =
  "rounded-[50%_50%_0_0/100%_100%_0_0] border-t-2 border-[rgba(240,138,75,0.6)] bg-[radial-gradient(ellipse_at_50%_100%,#000_55%,rgba(217,116,58,0.55)_62%,transparent_75%)]";

/* ---------- Composants ---------- */
function Pill({ href, white, lg, className = "", children }: { href: string; white?: boolean; lg?: boolean; className?: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className={`inline-block rounded-full text-xs font-medium ${lg ? "px-4 py-[11px]" : "px-[14px] py-[7px]"} ${white ? "bg-white text-black" : "bg-[#1c1c1c] text-white"} ${className}`}
    >
      {children}
    </a>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <div className="mt-[90px] mb-3.5 flex items-center gap-3 font-mono text-[9px] leading-none tracking-[.35em] text-[#777]">
      <i className="h-[7px] w-5 rounded bg-[#d9743a]" />
      {children}
      <span className="h-px flex-1 bg-[#1f1f1f]" />
    </div>
  );
}

function Icon({ children }: { children: ReactNode }) {
  return <div className="mb-[22px] grid size-8 place-items-center rounded-full bg-[#1b1b1b] text-[13px] text-[#eee]">{children}</div>;
}

function FeatureRow({ items, className = "" }: { items: Item[]; className?: string }) {
  return (
    <div className={`grid divide-y divide-[#1f1f1f] rounded-[18px] border border-[#1f1f1f] bg-[#050505] md:grid-cols-3 md:divide-x md:divide-y-0 ${className}`}>
      {items.map((x) => (
        <div key={x.t} className="px-[22px] pt-[26px] pb-[30px]">
          <Icon>{x.i}</Icon>
          <h3 className="mb-2 text-[13px] font-semibold">{x.t}</h3>
          <p className="text-[11px] leading-normal text-[#8d8d8d]">{x.d}</p>
        </div>
      ))}
    </div>
  );
}

function BigCard({ title, text, cta, href, variant = "right", h = "min-h-[245px]" }: { title: string; text: string; cta: string; href: string; variant?: "right" | "right2" | "bottom"; h?: string }) {
  return (
    <section className={`relative overflow-hidden rounded-[18px] border border-[#1f1f1f] bg-[#050505] p-[30px] ${h} ${variant === "bottom" ? "" : "mb-4"}`}>
      {variant === "right" && (
        <div className={`${ORB} absolute -top-10 -right-[120px] size-[640px] rounded-full max-md:opacity-70`}>
          <div className="absolute -right-10 -bottom-[30px] size-[300px] rounded-full bg-black shadow-[0_0_40px_10px_#000]" />
        </div>
      )}
      {variant === "right2" && (
        <div className={`${ORB} absolute -top-5 -right-[60px] size-[560px] rounded-full max-md:opacity-70`}>
          <div className="absolute top-[30%] left-[46%] size-[190px] rotate-45 bg-black shadow-[-20px_0_40px_#000]" />
        </div>
      )}
      {variant === "bottom" && <div className={`${ORB} absolute top-[200px] -left-[120px] size-[520px] rounded-full`} />}
      <div className={`absolute inset-0 z-[1] to-transparent ${variant === "bottom" ? "bg-gradient-to-b from-[#050505] from-25% to-55%" : "bg-gradient-to-r from-[#050505] from-25% to-60%"}`} />
      <h2 className="relative z-[2] mb-3.5 max-w-[250px] text-[clamp(26px,3.4vw,34px)] leading-[1.08] font-medium tracking-tight">{title}</h2>
      <p className="relative z-[2] max-w-[240px] text-[13px] leading-[1.45] text-[#8a8a8a]">{text}</p>
      <Pill href={href} white lg className="absolute bottom-[30px] left-[30px] z-[2]">{cta}</Pill>
    </section>
  );
}

function Bar({ label, value, w, hi }: { label: string; value: string; w: number; hi?: boolean }) {
  return (
    <div className="relative mb-3.5 flex items-center pt-3">
      <span className="absolute -top-1.5 right-0 text-[8px] text-[#888]">{label}</span>
      <div className={`h-[19px] rounded-r-xl bg-gradient-to-r ${hi ? "from-[#8a4318] to-[#f08a4b]" : "from-[#222] to-[#555]"}`} style={{ width: `${w}%` }} />
      <span className={`ml-2.5 text-xs whitespace-nowrap ${hi ? "font-semibold text-[#f08a4b]" : "text-[#cfcfcf]"}`}>{value}</span>
    </div>
  );
}

/* ---------- Page ---------- */
export default function Template3() {
  return (
    <main className={`${font.className} min-h-screen bg-black text-white antialiased`}>
      <div className="mx-auto max-w-[1000px] px-5">
        {/* Navbar */}
        <nav className="mx-auto mt-5 flex max-w-[960px] items-center justify-between rounded-[14px] border border-[#1f1f1f] bg-[#0a0a0a] px-[18px] py-3 text-xs">
          <a href={B} className="flex items-center gap-1.5 text-[15px] font-semibold">
            Bag\Ui <span className="text-[11px] font-normal text-[#777]">by Anelka</span>
          </a>
          <div className="hidden gap-[22px] text-[#cfcfcf] md:flex">
            {navLinks.map((l) => <a key={l} href={`${B}/${l.toLowerCase()}`}>{l}</a>)}
          </div>
          <div className="flex gap-2">
            <Pill href={`${B}/login`}>Login</Pill>
            <Pill href={`${B}/register`} white>Sign Up</Pill>
          </div>
        </nav>

        {/* Hero */}
        <header className="relative overflow-hidden pt-16 text-center">
          <a href={`${GH}#-contributing`} className="mb-[26px] inline-flex items-center gap-2.5 rounded-full border border-[#2a2a2a] bg-[#0d0d0d] px-3.5 py-1.5 text-[11px] text-[#ddd]">
            Introducing Bag\Ui v1 <b className="font-medium text-[#f08a4b]">Open Source, Built Together</b>
          </a>
          <h1 className="mx-auto mb-[18px] max-w-[760px] text-[clamp(38px,6.2vw,66px)] leading-[1.05] font-medium tracking-[-.035em]">
            Build production-ready SaaS landing pages faster.
          </h1>
          <p className="mx-auto max-w-[460px] text-sm text-[#ddd]">
            Handcrafted React &amp; shadcn/ui sections that you can plug in, customize, and ship with confidence.
          </p>
          <div className="relative z-[2] mt-[26px] flex justify-center gap-2.5">
            <Pill href={GH} lg>GitHub</Pill>
            <Pill href={`${B}/blocks`} white lg>Explore blocks</Pill>
          </div>
          <div className={`${ARC} mx-auto -mt-5 h-[150px] max-w-[420px]`} />
        </header>

        <FeatureRow items={intro} className="relative -mt-[30px]" />

        {/* Library */}
        <Label>LIBRARY</Label>
        <BigCard title="Explore our collection of UI blocks" text="A growing collection of handcrafted React and shadcn/ui blocks designed to help you build modern interfaces faster." cta="Browse all blocks" href={`${B}/blocks`} />
        <FeatureRow items={library} />

        {/* Blocks */}
        <Label>BLOCKS</Label>
        <div className="mt-[26px] grid md:grid-cols-2">
          <div className="px-5 py-5 md:px-10">
            <h2 className="mb-1.5 text-3xl font-medium tracking-tight">Core sections</h2>
            <p className="mb-7 max-w-[210px] text-[11px] text-[#6f6f6f]">Number of blocks per category. Higher is richer.</p>
            <Bar label="Hero" value="6 blocks" w={72} hi />
            <Bar label="Feature" value="6 blocks" w={72} />
            <Bar label="Pricing" value="4 blocks" w={48} />
            <a href={`${B}/blocks`} className="mt-10 block text-[10px] text-[#ccc]">See all 30 blocks →</a>
          </div>
          <div className="border-[#1f1f1f] px-5 py-5 md:border-l md:px-10">
            <h2 className="mb-1.5 text-3xl font-medium tracking-tight">Supporting sections</h2>
            <p className="mb-7 max-w-[210px] text-[11px] text-[#6f6f6f]">Navbar, footer, social proof and more to complete the page.</p>
            <Bar label="Footer" value="3 blocks" w={36} hi />
            <Bar label="Testimonial" value="2 blocks" w={24} />
            <Bar label="CTA" value="2 blocks" w={24} />
            <a href={`${B}/blocks`} className="mt-10 block text-[10px] text-[#ccc]">Browse every category →</a>
          </div>
        </div>

        {/* Open source */}
        <Label>OPEN SOURCE</Label>
        <BigCard variant="right2" title="Open source, built together" text="Bag\Ui v1 is open to everyone. Contribute on GitHub and help shape the library." cta="Contribute on GitHub" href={`${GH}#-contributing`} />
        <FeatureRow items={stack} />

        {/* Use cases */}
        <Label>USE CASES</Label>
        <div className="grid gap-4 md:grid-cols-2">
          <BigCard variant="bottom" h="min-h-[420px]" title="Built for SaaS landing pages" text="From hero to footer, assemble a full landing page from blocks that plug in, customize, and ship." cta="Read the docs" href={`${B}/docs`} />
          <div className="grid rounded-[18px] border border-[#1f1f1f] bg-[#050505] sm:grid-cols-2">
            {useCases.map((x, i) => (
              <div key={x.t} className={`min-h-[200px] border-[#1f1f1f] px-[22px] py-[26px] ${i < 3 ? "border-b" : ""} ${i < 2 ? "sm:border-b" : "sm:border-b-0"} ${i % 2 === 0 ? "sm:border-r" : ""}`}>
                <Icon>{x.i}</Icon>
                <h3 className="mb-2 text-[13px] font-semibold">{x.t}</h3>
                <p className="text-[11px] leading-normal text-[#8d8d8d]">{x.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <section className="relative mt-[60px] min-h-[300px] overflow-hidden rounded-[18px] border border-[#1f1f1f] bg-[#050505] px-5 pt-16 text-center">
          <h2 className="relative z-[2] mb-3.5 text-3xl font-medium">Ready to build amazing UIs?</h2>
          <p className="relative z-[2] mx-auto mb-[22px] max-w-[420px] text-[13px] text-[#8a8a8a]">Join thousands of developers creating beautiful components with BagUI.</p>
          <Pill href={`${B}/docs`} white lg className="relative z-[2]">Start for free</Pill>
          <div className={`${ARC} absolute bottom-[-10px] left-1/2 h-[90px] w-[620px] max-w-full -translate-x-1/2`} />
        </section>

        {/* Footer */}
        <footer className="mt-[60px] border-t border-[#1f1f1f] pt-[30px] pb-10">
          <div className="grid grid-cols-2 gap-5 text-[10px] text-[#8d8d8d] md:grid-cols-4">
            {footerCols.map(([h, links]) => (
              <div key={h}>
                <b className="mb-3 block font-semibold text-white">{h}</b>
                {links.map(([l, href]) => <a key={l} href={href} className="mb-[9px] block">{l}</a>)}
              </div>
            ))}
          </div>
          <div className="mt-[50px] flex flex-wrap items-end justify-between gap-5">
            <div>
              <div className="text-[15px] font-semibold">Bag\Ui</div>
              <small className="mt-3.5 block text-[10px] text-[#ddd]">Spend less time building UI from scratch. Ship faster with Bag/UI.</small>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Open Source", "React", "Next.js", "Tailwind CSS"].map((b) => (
                <span key={b} className="rounded-full border border-[#2a2a2a] bg-[#111] px-3 py-[7px] text-[9px] text-[#ddd]">{b}</span>
              ))}
            </div>
          </div>
          <p className="mt-7 text-[10px] text-[#777]">© 2026 Bag\UI – not officially affiliated with shadcn/ui or Tailwind CSS. Built by Anelka Bag 🇨🇩</p>
        </footer>
      </div>
    </main>
  );
}