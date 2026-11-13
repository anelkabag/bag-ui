"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Heart, Sparkles, Server, Globe, Wrench } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import AppShell from "@/components/shell/AppShell";
import PageHero from "@/components/shell/PageHero";

const perks = [
  "Your name (or logo) featured on the sponsors page",
  "Priority access to discuss upcoming features",
  "A direct line to shape what gets built next",
  "The satisfaction of keeping the project 100% open source",
];

const costs = [
  {
    icon: Server,
    title: "Hosting & servers",
    description:
      "Keeping the app fast and online 24/7, even as more people start using it.",
  },
  {
    icon: Globe,
    title: "Domain & infrastructure",
    description:
      "Domain renewal, SSL, storage, and the small recurring bills that add up every month.",
  },
  {
    icon: Wrench,
    title: "Maintenance & new features",
    description:
      "The hours spent fixing bugs, reviewing issues, and shipping what the community asks for.",
  },
];

export default function PricingPage() {
  return (
    <AppShell>
      <div className="min-h-full mx-auto max-w-[1440px] bg-background px-5 pb-12 md:px-10">
        <PageHero
          firstLine="The entire catalog"
          secondLine="Free."
          emphasis="Forever."
        >
          <p className="max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
            Every block, every template, the full source code &mdash; free to
            use, no account required, no limits. But &ldquo;free&rdquo; still
            has a real bill behind it: hosting, domains, and the hours spent
            maintaining it. That bill is covered entirely by people like you.
          </p>
        </PageHero>

        {/* Where the money goes */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-14"
        >
          {costs.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-card p-5 text-center"
            >
              <div className="flex justify-center mb-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-muted">
                  <Icon size={16} className="text-foreground" />
                </div>
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">
                {title}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </motion.div>

        <div className="border-t border-border mb-10" />

        {/* Sponsor card — carte "inversée" volontairement toujours sombre,
            pour qu'elle reste un accent visible en light ET en dark mode.
            zinc-900/800 plutôt que du noir pur pour ne pas se fondre dans
            le fond de page en dark mode. */}
        <div className="max-w-xl mx-auto mb-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative flex flex-col rounded-xl border border-zinc-800 dark:border-zinc-700 bg-zinc-900 dark:bg-zinc-800 text-white p-8"
          >
            <span className="absolute -top-3 left-6 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-green-200 dark:bg-green-900/40 border border-green-300 dark:border-green-800 text-green-600 dark:text-green-400">
              Optional
            </span>

            <div className="flex items-center gap-2 mb-4">
              <Heart size={18} className="text-white" />
              <p className="text-xs uppercase tracking-widest font-medium text-gray-400">
                Sponsor the project
              </p>
            </div>

            <p className="text-2xl font-bold tracking-tight mb-2">
              Any amount keeps it running
            </p>

            <p className="text-sm mb-6 leading-relaxed text-gray-300">
              No obligation, no strings attached &mdash; every contribution,
              big or small, goes straight back into hosting and development.
              If this project has ever saved you time or money, this is the
              easiest way to pay it forward.
            </p>

            <Link
              href={process.env.NEXT_PUBLIC_CHECKOUT_URL || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 text-center text-sm font-medium py-2.5 rounded-lg transition-all bg-white text-black hover:bg-gray-100"
            >
              <FaGithub size={16} />
              Become a sponsor on GitHub
            </Link>

            <p className="text-[11px] text-gray-400 text-center mt-3">
              Takes less than a minute &middot; cancel anytime
            </p>

            <div className="border-t border-white/10 my-5" />

            <p className="text-[11px] uppercase tracking-widest font-semibold mb-3 text-gray-400">
              As a sponsor
            </p>
            <ul className="space-y-2.5">
              {perks.map((p) => (
                <li key={p} className="flex items-start gap-2.5">
                  <Sparkles size={14} className="mt-0.5 shrink-0 text-white" />
                  <span className="text-sm text-gray-200">{p}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <p className="text-xs text-muted-foreground text-center mb-16 max-w-md mx-auto leading-relaxed">
          Not able to sponsor right now? Starring the repo, sharing it, or
          reporting a bug helps just as much.
          <br />
          Got a question, an idea, or want to contribute?{" "}
          <a
            href="mailto:anelka.bag@gmail.com"
            className="underline underline-offset-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            Reach out
          </a>{" "}
          or open an issue on the GitHub repo.
        </p>
      </div>
    </AppShell>
  );
}