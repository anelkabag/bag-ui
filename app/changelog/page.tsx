"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  Blocks,
  Bug,
  Check,
  History,
  PackagePlus,
  Rocket,
  Sparkles,
  UserRound,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AppShell from "@/components/shell/AppShell";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "latest-release", label: "Latest release" },
  { id: "release-history", label: "Release history" },
  { id: "featured-components", label: "Featured components" },
] as const;

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
    version: "0.6.0",
    date: "November 2026",
    title: "BagUI connects to your AI workflow",
    summary:
      "Discover and use BagUI components directly from MCP-compatible assistants and Visual Studio Code.",
    changes: [
      {
        label: "AI tools",
        icon: Blocks,
        items: [
          "Added the BagUI MCP server for searching the registry, inspecting components, and retrieving install commands.",
          "Added an MCP guide covering setup and connection from VS Code.",
          "Added a VS Code extension guide with Marketplace installation instructions and feature details.",
        ],
      },
      {
        label: "Resources",
        icon: Sparkles,
        items: [
          "Added a Resources menu with BagUI MCP documentation and a VS Code extension link.",
          "Added responsive resource links to the mobile navigation.",
        ],
      },
    ],
  },
  {
    version: "0.5.0",
    date: "September 2026",
    title: "More to build, more access for members",
    summary:
      "The registry gets a new hero, a new dashboard, and a smoother experience for users with an account.",
    changes: [
      {
        label: "New components",
        icon: Sparkles,
        items: [
          "Added Hero Exemple 5, a new hero section for expressive landing pages.",
          "Added Modern Task Dashboard, a complete workspace for managing tasks and progress.",
        ],
      },
      {
        label: "Account experience",
        icon: UserRound,
        items: [
          "Connected users can now retrieve and install pro components.",
          "Added the profile page to manage account information and preferences.",
        ],
      },
    ],
  },
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
      "BagUI grew from a collection of blocks into a practical place to discover, install, and customize UI.",
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
      "The first public release made BagUI blocks available through a shadcn-compatible registry.",
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
    name: "Hero Exemple 5",
    type: "Hero",
    description: "An expressive hero section for a strong first impression.",
    href: "/fullscreen/hero5",
  },
  {
    name: "Modern Task Dashboard",
    type: "Dashboard",
    description: "A complete task workspace for planning, tracking, and focus.",
    href: "/fullscreen/dashboard-task",
  },
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
    <AppShell>
      <div className="min-h-full mx-auto max-w-[1440px] bg-background px-5 text-foreground md:px-10">
        <div className="border-b border-border py-8 md:py-10">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              <ArrowLeft size={14} />
              Back to home
            </Link>
          </div>
        </div>

        <section className="overflow-hidden border-b border-border">
          <div className="border-b border-border bg-muted/20 px-6 py-8 md:px-10 md:py-10">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background">
                <History className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Product
                </p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-5xl">
                  Changelog
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
              Major releases, meaningful improvements, and the newest building blocks for your next interface.
            </p>
          </div>

          <div className="grid gap-0 md:grid-cols-[260px_1fr]">
            <aside className="border-r border-border bg-background">
              <div className="p-5 md:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  On this page
                </p>
                <nav className="mt-5 space-y-2">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {section.label}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            <div className="bg-background">
              <div className="space-y-8 p-5 md:p-8">
                <section id="overview" className="scroll-mt-24">
                  <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                    Overview
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
                    BagUI evolves through regular product updates, focused fixes, and
                    new block patterns that help teams ship more polished interfaces faster.
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {[
                      ["5", "releases"],
                      ["40+", "components"],
                      ["Open", "source"],
                    ].map(([value, label]) => (
                      <div
                        key={label}
                        className="rounded-xl border border-border bg-card p-3 sm:p-4"
                      >
                        <p className="text-2xl font-semibold tracking-tight text-foreground">
                          {value}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <section id="latest-release" className="scroll-mt-24">
                  <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                    Latest release
                  </h2>

                  <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
                    <div className="border-b border-border px-5 py-4 md:px-6">
                      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <p className="font-mono text-sm font-semibold text-foreground">
                          v{releases[0].version}
                        </p>
                        <time className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          {releases[0].date}
                        </time>
                      </div>
                      <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                        {releases[0].title}
                      </h3>
                    </div>

                    <div className="p-5 md:p-6">
                      <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
                        {releases[0].summary}
                      </p>

                      <div className="mt-6 grid gap-6 sm:grid-cols-2">
                        {releases[0].changes.map(({ label, icon: Icon, items }) => (
                          <div key={label}>
                            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
                              <Icon size={15} strokeWidth={2} />
                              {label}
                            </div>
                            <ul className="space-y-3">
                              {items.map((item) => (
                                <li
                                  key={item}
                                  className="flex gap-3 text-sm leading-6 text-muted-foreground"
                                >
                                  <Check size={15} className="mt-1 shrink-0 text-foreground" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                <section id="release-history" className="scroll-mt-24">
                  <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                    Release history
                  </h2>

                  <div className="relative mt-6 space-y-16 before:absolute before:bottom-0 before:left-[7px] before:top-2 before:w-px before:bg-border md:space-y-24">
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
                          <p className="font-mono text-sm font-semibold text-foreground">
                            v{release.version}
                          </p>
                          <time className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            {release.date}
                          </time>
                        </div>
                        <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                          {release.title}
                        </h3>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
                          {release.summary}
                        </p>

                        <div className="mt-8 grid gap-8 sm:grid-cols-2">
                          {release.changes.map(({ label, icon: Icon, items }) => (
                            <div key={`${release.version}-${label}`}>
                              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
                                <Icon size={15} strokeWidth={2} />
                                {label}
                              </div>
                              <ul className="space-y-3">
                                {items.map((item) => (
                                  <li
                                    key={`${release.version}-${label}-${item}`}
                                    className="flex gap-3 text-sm leading-6 text-muted-foreground"
                                  >
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

                <section id="featured-components" className="scroll-mt-24">
                  <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                        New in the catalog
                      </p>
                      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                        Start with something new
                      </h2>
                    </div>
                    <Link
                      href="/blocks"
                      className="group inline-flex items-center gap-2 text-sm font-medium text-foreground"
                    >
                      Browse all blocks
                      <ArrowUpRight
                        size={15}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </Link>
                  </div>

                  <div className="mt-10 grid gap-px border border-border bg-border md:grid-cols-3">
                    {featuredComponents.map((component) => (
                      <Link
                        key={component.name}
                        href={component.href}
                        className="group bg-background p-6 transition-colors hover:bg-muted/40"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase tracking-widest text-muted-foreground">
                            {component.type}
                          </span>
                          <ArrowUpRight
                            size={16}
                            className="text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          />
                        </div>
                        <h3 className="mt-12 text-lg font-semibold text-foreground">
                          {component.name}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {component.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
