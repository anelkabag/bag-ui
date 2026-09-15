"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  Bug,
  Check,
  PackagePlus,
  Rocket,
  Sparkles,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";

type Change = {
  label: string;
  icon: LucideIcon;
  items: string[];
};

type Release = {
  version: string;
  date: string;
  title: string;
  summary: string;
  changes: Change[];
};

const releases: Release[] = [
  {
    version: "0.4.0",
    date: "September 2026",
    title: "A faster way to find your next starting point",
    summary:
      "The catalog is easier to scan, component previews are more useful, and the registry is ready for a bigger library.",
    changes: [
      {
        label: "New",
        icon: Sparkles,
        items: [
          "Added the Changelog page for product updates and releases.",
          "Added new dashboard, CTA, contact, and footer blocks to the registry.",
          "Introduced richer preview metadata for blocks and templates.",
        ],
      },
      {
        label: "Improved",
        icon: Wrench,
        items: [
          "Refined catalog browsing with clearer categories and access labels.",
          "Improved responsive layouts across the public pages.",
        ],
      },
    ],
  },
  {
    version: "0.3.0",
    date: "August 2026",
    title: "Templates, docs, and a more complete workflow",
    summary:
      "Bag/UI grew from a collection of blocks into a practical place to discover, install, and customize UI.",
    changes: [
      {
        label: "New",
        icon: PackagePlus,
        items: [
          "Launched the Templates catalog with ready-to-adapt page compositions.",
          "Added installation and contribution guides to the documentation.",
          "Added account pages and download history for registered users.",
        ],
      },
      {
        label: "Fixed",
        icon: Bug,
        items: [
          "Fixed theme switching states in the navigation and footer.",
          "Fixed preview sizing for dense dashboard blocks on small screens.",
        ],
      },
    ],
  },
  {
    version: "0.2.0",
    date: "July 2026",
    title: "The registry goes public",
    summary:
      "The first public release made Bag/UI blocks available through a shadcn-compatible registry.",
    changes: [
      {
        label: "Released",
        icon: Rocket,
        items: [
          "Published the first collection of production-ready blocks.",
          "Added free and pro access tiers to registry items.",
          "Added component download analytics with privacy-conscious project IDs.",
        ],
      },
    ],
  },
];

const featuredComponents = [
  {
    name: "Dashboard Analytics",
    type: "Dashboard",
    description: "A focused analytics workspace with key metrics and activity.",
    href: "/fullscreen/dashboard-analytics",
  },
  {
    name: "Contact 02",
    type: "Contact",
    description: "A compact contact section designed for conversion-focused pages.",
    href: "/fullscreen/contact-2",
  },
  {
    name: "Footer 01",
    type: "Footer",
    description: "A flexible footer with product, legal, and social navigation.",
    href: "/fullscreen/footer1",
  },
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-7xl border-x border-border px-6">
        <section className="border-b border-border py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-3xl"
          >
            <div className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              <span className="h-px w-8 bg-foreground" />
              Product updates
            </div>
            <h1 className="max-w-2xl text-5xl font-bold tracking-tight text-foreground md:text-7xl">
              What&apos;s new in Bag/UI
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
              Major releases, meaningful improvements, and the newest building
              blocks for your next interface.
            </p>
          </motion.div>

          <div className="mt-14 grid max-w-2xl grid-cols-2 gap-px border border-border bg-border sm:grid-cols-3">
            {[
              ["3", "releases"],
              ["40+", "components"],
              ["Open", "source"],
            ].map(([value, label]) => (
              <div key={label} className="bg-background p-5">
                <p className="text-2xl font-semibold tracking-tight text-foreground">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-12 py-16 md:grid-cols-[180px_1fr] md:gap-20 md:py-24">
          <div className="md:sticky md:top-24 md:self-start">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Release notes
            </p>
            <p className="mt-3 max-w-[150px] text-sm leading-6 text-muted-foreground">
              A short record of what shipped and why it matters.
            </p>
          </div>

          <div className="relative space-y-16 before:absolute before:bottom-0 before:left-[7px] before:top-2 before:w-px before:bg-border md:space-y-24">
            {releases.map((release, releaseIndex) => (
              <motion.article
                key={release.version}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.35, delay: releaseIndex * 0.05 }}
                className="relative pl-9"
              >
                <span className="absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-4 border-background bg-foreground ring-1 ring-border" />
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <p className="font-mono text-sm font-semibold text-foreground">v{release.version}</p>
                  <time className="text-xs uppercase tracking-widest text-muted-foreground">{release.date}</time>
                </div>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{release.title}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{release.summary}</p>

                <div className="mt-8 grid gap-8 sm:grid-cols-2">
                  {release.changes.map(({ label, icon: Icon, items }) => (
                    <div key={label}>
                      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Icon size={15} strokeWidth={2} />
                        {label}
                      </div>
                      <ul className="space-y-3">
                        {items.map((item) => (
                          <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                            <Check size={15} className="mt-1 shrink-0 text-foreground" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="border-t border-border py-16 md:py-24">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">New in the catalog</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">Start with something new</h2>
            </div>
            <Link href="/blocks" className="group inline-flex items-center gap-2 text-sm font-medium text-foreground">
              Browse all blocks
              <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <div className="mt-10 grid gap-px border border-border bg-border md:grid-cols-3">
            {featuredComponents.map((component) => (
              <Link key={component.name} href={component.href} className="group bg-background p-6 transition-colors hover:bg-muted/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">{component.type}</span>
                  <ArrowUpRight size={16} className="text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <h3 className="mt-12 text-lg font-semibold text-foreground">{component.name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{component.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}