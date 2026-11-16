"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Globe,
  Heart,
  MessageSquare,
  Server,
  Star,
  Wrench,
} from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import AppShell from "@/components/shell/AppShell";
import PageHero from "@/components/shell/PageHero";

const perks = [
  { icon: Star, text: "Your name or logo on the sponsors page" },
  { icon: MessageSquare, text: "A say in what gets built next" },
  { icon: Globe, text: "An open-source catalog that stays free for everyone" },
];

const steps = [
  {
    icon: Heart,
    title: "You sponsor",
    description: "Any amount, on GitHub. It takes a minute.",
  },
  {
    icon: Server,
    title: "It pays the bills",
    description:
      "Servers, domain, SSL and storage keep BagUI fast and online 24/7.",
  },
  {
    icon: Wrench,
    title: "It funds the work",
    description:
      "Bug fixes, issue reviews and the features the community asks for.",
  },
];

const gridPattern = {
  backgroundImage:
    "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
  backgroundSize: "40px 40px",
  maskImage: "radial-gradient(ellipse at top right, black 25%, transparent 75%)",
  WebkitMaskImage:
    "radial-gradient(ellipse at top right, black 25%, transparent 75%)",
} as const;

export default function SponsorPage() {
  const reduce = useReducedMotion();

  return (
    <AppShell>
      <div className="min-h-full bg-background">
        <div className="mx-auto max-w-[1440px] pb-20">
          <PageHero
            firstLine="Free to use."
            secondLine="Alive thanks to"
            emphasis="sponsors."
            className="pb-6"
          >
            <p className="max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
              Every block, every template, the full source code &mdash; free,
              no account, no limits. That only works because sponsors cover the
              hosting, the domain and the hours behind it. Without them, BagUI
              stops.
            </p>
          </PageHero>

          <div className="mx-5 md:mx-10">
            {/* ─── Sponsor card ─────────────────────────────────────────── */}
            <motion.section
              aria-labelledby="sponsor-title"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-white dark:border-border sm:p-10"
            >
              {/* Décor monochrome : grille + halos blancs (CSS pur) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={gridPattern}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-32 -top-32 size-[28rem] rounded-full"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(255,255,255,0.12), transparent)",
                }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-40 -left-32 size-[26rem] rounded-full"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(255,255,255,0.06), transparent)",
                }}
              />

              <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
                <div className="max-w-xl">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1.5 pr-3">
                    <motion.span
                      animate={reduce ? undefined : { scale: [1, 1.18, 1] }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="flex size-6 items-center justify-center rounded-full bg-white/10 text-white"
                    >
                      <Heart size={13} fill="currentColor" />
                    </motion.span>
                    <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-300">
                      Sponsor the project
                    </span>
                  </div>

                  <h2
                    id="sponsor-title"
                    className="text-4xl font-bold tracking-tight sm:text-5xl"
                  >
                    Keep BagUI{" "}
                    <span className="bg-linear-to-r from-white to-zinc-500 bg-clip-text text-transparent">
                      alive.
                    </span>
                  </h2>

                  <p className="mt-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
                    BagUI is built and maintained in the open, and it runs on
                    sponsorship. Your support goes straight into hosting and
                    development &mdash; so the catalog stays free for the next
                    developer who needs it.
                  </p>

                  <Link
                    href={process.env.NEXT_PUBLIC_CHECKOUT_URL || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-center text-sm font-semibold text-black shadow-[0_8px_30px_-10px_rgba(255,255,255,0.45)] transition-all hover:bg-zinc-100 hover:shadow-[0_8px_36px_-8px_rgba(255,255,255,0.6)] sm:w-auto sm:px-7"
                  >
                    <FaGithub size={16} />
                    Sponsor BagUI on GitHub
                    <ArrowUpRight
                      size={16}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </Link>

                  <p className="mt-3 text-xs text-zinc-400">
                    Any amount helps &middot; Takes a minute &middot; Cancel
                    anytime
                  </p>
                </div>

                {/* Panneau "As a sponsor" */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                    As a sponsor
                  </p>
                  <ul className="space-y-3.5">
                    {perks.map(({ icon: Icon, text }) => (
                      <li key={text} className="flex items-start gap-3">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
                          <Icon size={15} />
                        </span>
                        <span className="pt-1 text-sm leading-6 text-zinc-200">
                          {text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Mur de sponsors : places libres, la dernière est la tienne */}
                  <div className="mt-6 border-t border-white/10 pt-5">
                    <div className="flex items-center">
                      <div className="flex -space-x-2">
                        {[0, 1, 2, 3].map((i) => (
                          <span
                            key={i}
                            className="size-9 rounded-full border border-dashed border-white/25 bg-zinc-900"
                          />
                        ))}
                        <span className="flex size-9 items-center justify-center rounded-full border border-white bg-white text-black">
                          <Heart size={14} fill="currentColor" />
                        </span>
                      </div>
                      <p className="ml-4 text-xs leading-5 text-zinc-400">
                        Your spot on the
                        <br />
                        sponsors page.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* ─── Où va l'argent ───────────────────────────────────────── */}
            <section aria-labelledby="project-costs" className="mt-14">
              <div className="mb-6">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Full transparency
                </p>
                <h2
                  id="project-costs"
                  className="mt-2 text-xl font-semibold tracking-tight text-foreground"
                >
                  Where your support goes
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-10">
                {steps.map(({ icon: Icon, title, description }, i) => (
                  <motion.div
                    key={title}
                    initial={reduce ? false : { opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.35, delay: i * 0.08 }}
                    className="relative rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-foreground/20"
                  >
                    <div className="mb-8 flex items-start justify-between">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-foreground">
                        <Icon size={18} />
                      </div>
                      <span className="font-mono text-xs text-muted-foreground/60">
                        0{i + 1}
                      </span>
                    </div>
                    <p className="mb-1 text-sm font-semibold text-foreground">
                      {title}
                    </p>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {description}
                    </p>

                    {i < steps.length - 1 && (
                      <ArrowRight
                        aria-hidden="true"
                        size={18}
                        className="absolute -right-7 top-1/2 hidden -translate-y-1/2 text-muted-foreground/50 md:block"
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </section>

            <p className="mx-auto mb-8 mt-12 max-w-xl text-center text-xs leading-relaxed text-muted-foreground">
              Can&apos;t sponsor right now? Star the repo, share it with a
              developer friend, or report a bug &mdash; it helps just as much.
              <br />
              Questions or ideas?{" "}
              <a
                href="mailto:anelka.bag@gmail.com"
                className="underline underline-offset-2 transition-colors hover:text-foreground"
              >
                Reach out
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}