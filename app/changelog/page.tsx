"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  Blocks,
  Bug,
  Check,
  PackagePlus,
  Rocket,
  Sparkles,
  UserRound,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AppShell from "@/components/shell/AppShell";
import PageHero from "@/components/shell/PageHero";

const sections = [
  { id: "overview", label: "Overview" },
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
      <div className="mx-auto min-h-full max-w-[1440px] bg-background pb-12 text-foreground">
        <PageHero
          firstLine="Product updates."
          secondLine="What's new in"
          emphasis="BagUI."
          className="pb-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]"
        >
          <p className="max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
            Major releases, meaningful improvements, and the newest building
            blocks for your next interface.
          </p>
        </PageHero>

        <div className="mx-5 mt-8 grid grid-cols-1 gap-8 md:mx-10 xl:grid-cols-[180px_minmax(0,760px)_180px] xl:justify-center xl:gap-10">
          <nav
            aria-label="Release versions"
            className="flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-full border border-border bg-muted/40 p-1 xl:sticky xl:top-8 xl:w-full xl:flex-col xl:items-stretch xl:gap-5 xl:self-start xl:overflow-visible xl:rounded-none xl:border-0 xl:bg-transparent xl:p-0"
          >
            <div className="flex shrink-0 items-center gap-1 xl:block">
              <p className="mb-2 hidden px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground xl:block">
                Releases
              </p>
              <ul className="flex items-center gap-1 xl:block xl:space-y-0.5">
                {releases.map((release, index) => (
                  <li key={release.version}>
                    <a
                      href={`#release-${release.version}`}
                      className={`block shrink-0 rounded-full px-3.5 py-2 text-left text-sm font-medium transition-colors xl:rounded-lg xl:px-3 ${
                        index === 0
                          ? "bg-foreground text-background xl:bg-accent xl:text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      v{release.version}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="mx-auto w-full min-w-0 max-w-[760px]">
            <section id="overview" className="scroll-mt-20">
              <h2 className="text-foreground text-xl font-semibold">
                Overview
              </h2>
              <p className="mt-4 text-muted-foreground text-[0.925rem] leading-7">
                BagUI evolves through regular product updates, focused fixes, and
                new block patterns that help teams ship more polished interfaces faster.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  [String(releases.length), "releases"],
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

            <section id="release-history" className="scroll-mt-20">
              <h2 className="text-foreground text-xl font-semibold mt-14 mb-4">
                Release history
              </h2>

              <div className="relative space-y-16 before:absolute before:bottom-0 before:left-[7px] before:top-2 before:w-px before:bg-border md:space-y-24">
                {releases.map((release, releaseIndex) => (
                  <motion.article
                    key={release.version}
                    id={`release-${release.version}`}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.35, delay: releaseIndex * 0.05 }}
                    className="relative scroll-mt-20 pl-9"
                  >
                    <span className="absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-4 border-background bg-foreground ring-1 ring-border" />
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <p className="font-mono text-sm font-semibold text-foreground">
                        v{release.version}
                      </p>
                      <time className="text-xs uppercase tracking-widest text-muted-foreground">
                        {release.date}
                      </time>
                    </div>
                    <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                      {release.title}
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
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

            <section id="featured-components" className="scroll-mt-20">
              <div className="mt-14 flex flex-col justify-between gap-5 md:flex-row md:items-end">
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

          <nav className="sticky top-20 hidden self-start xl:block" aria-label="On this page">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              On this page
            </p>
            <ul className="space-y-1.5">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="block py-0.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground/80"
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </AppShell>
  );
}
