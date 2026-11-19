"use client";

import { motion } from "motion/react";
import { Check, Server, Cloud } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PricingPlan {
  title: string;
  badge?: string;
  description: string;
  basePrice: string;
  extraPrice?: string;
  cta: string;
  ctaVariant: "default" | "highlight";
  cpuLabel: string;
  cpuBold: string;
  clusterLabel: string;
  clusterBold: string;
  featuresLabel: string;
  features: string[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

const plans: PricingPlan[] = [
  {
    title: "Free",
    description: "Ideal for individuals and small teams with limited needs.",
    basePrice: "$0",
    cta: "Get started",
    ctaVariant: "default",
    cpuBold: "10",
    cpuLabel: "CPUs",
    clusterBold: "2",
    clusterLabel: "clusters",
    featuresLabel: "Free includes:",
    features: [
      "Free Kubernetes cost monitoring",
      "Actionable cost recommendations",
      "Security report",
    ],
  },
  {
    title: "Growth",
    description: "For teams that need more resources and features.",
    basePrice: "$200",
    extraPrice: "$5",
    cta: "Get started",
    ctaVariant: "default",
    cpuBold: "500",
    cpuLabel: "CPUs",
    clusterBold: "4",
    clusterLabel: "clusters",
    featuresLabel: "Everything in Free, plus:",
    features: [
      "Intelligent up & down scaling",
      "Stable & predictable cloud cost",
      "Rebalancing",
    ],
  },
  {
    title: "Growth PRO",
    badge: "Most popular",
    description:
      "For teams that need unlimited access and advanced functionality.",
    basePrice: "$1000",
    extraPrice: "$5",
    cta: "Get started",
    ctaVariant: "highlight",
    cpuBold: "2000",
    cpuLabel: "CPUs",
    clusterBold: "Unlimited",
    clusterLabel: "clusters",
    featuresLabel: "Everything in Growth, plus:",
    features: ["Dedicated onboarding", "Dedicated support (Weekdays)"],
  },
  {
    title: "Enterprise",
    description: "For large organizations that need enterprise-level support.",
    basePrice: "$5000",
    extraPrice: "$5",
    cta: "Get started",
    ctaVariant: "default",
    cpuBold: "Unlimited",
    cpuLabel: "CPUs",
    clusterBold: "Unlimited",
    clusterLabel: "clusters",
    featuresLabel: "Everything in Growth PRO, plus:",
    features: [
      "Enterprise SSO",
      "First class onboarding",
      "Platinum support 24/7",
    ],
  },
];

// ─── Price block ─────────────────────────────────────────────────────────────

function PriceBlock({ amount, period }: { amount: string; period: string }) {
  return (
    <div className="flex items-start">
      <span className="text-[36px] font-medium leading-none tracking-[-0.04em] text-zinc-950 dark:text-white">
        {amount}
      </span>

      <div className="flex flex-col ml-1 mt-[2px]">
        <span className="text-[12px] leading-[1.1] text-zinc-500 dark:text-zinc-400">per</span>
        <span className="text-[12px] leading-[1.1] text-zinc-500 dark:text-zinc-400">
          {period}
        </span>
      </div>
    </div>
  );
}

// ─── Card ────────────────────────────────────────────────────────────────────

function PricingCard({ plan, isLast }: { plan: PricingPlan; isLast: boolean }) {
  return (
    <div
      className={`
        flex flex-col border-t border-b border-l border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900
        ${isLast ? "border-r border-zinc-200 dark:border-r-zinc-700" : ""}
      `}
    >
      {/* Title + badge */}
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-[15px] font-semibold text-zinc-900 dark:text-white">
          {plan.title}
        </h3>
        {plan.badge && (
          <span className="rounded-full border border-zinc-300 px-2 py-0.5 text-[10px] font-medium leading-none text-zinc-500 dark:border-zinc-600 dark:text-zinc-400">
            {plan.badge}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="mb-5 min-h-[40px] text-[13px] leading-snug text-zinc-500 dark:text-zinc-400">
        {plan.description}
      </p>

      {/* Price row */}
      <div className="flex items-center gap-2 mb-5">
        <PriceBlock amount={plan.basePrice} period="month" />
        {plan.extraPrice && (
          <>
            <span className="mt-1 text-xl font-light leading-none text-zinc-300 dark:text-zinc-600">
              +
            </span>
            <PriceBlock amount={plan.extraPrice} period="CPU" />
          </>
        )}
      </div>

      {/* CTA */}
      <button
        className={`
          w-full rounded-lg py-2.5 text-sm font-semibold mb-5 transition-colors duration-200 cursor-pointer
          ${
            plan.ctaVariant === "highlight"
              ? "bg-emerald-500 hover:bg-emerald-600 text-white"
              : "bg-zinc-950 hover:bg-zinc-800 text-white"
          }
        `}
      >
        {plan.cta}
      </button>

      {/* Specs */}
      <div className="flex flex-col gap-1.5 mb-5">
        <div className="flex items-center gap-2 text-[13px] text-zinc-500">
          <Server size={13} className="text-zinc-400 shrink-0" />
          <span>
            Up to{" "}
            <span className="font-bold text-zinc-900 dark:text-white">{plan.cpuBold}</span>{" "}
            {plan.cpuLabel}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-zinc-500">
          <Cloud size={13} className="text-zinc-400 shrink-0" />
          <span>
            {plan.clusterBold === "Unlimited" ? (
              <>
                <span className="font-bold text-zinc-900 dark:text-white">Unlimited</span>{" "}
                {plan.clusterLabel}
              </>
            ) : (
              <>
                Up to{" "}
                <span className="font-bold text-zinc-900 dark:text-white">
                  {plan.clusterBold}
                </span>{" "}
                {plan.clusterLabel}
              </>
            )}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="mb-4 h-px bg-zinc-100 dark:bg-zinc-700" />

      {/* Features */}
      <p className="mb-3 text-[12px] font-bold text-zinc-900 dark:text-white">
        {plan.featuresLabel}
      </p>
      <ul className="flex flex-col gap-2">
        {plan.features.map((feat) => (
          <li key={feat} className="flex items-start gap-2">
            <Check
              size={12}
              className="text-emerald-500 mt-0.5 shrink-0"
              strokeWidth={3}
            />
            <span className="text-[13px] text-zinc-600 dark:text-zinc-300">{feat}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function PricingSection2() {
  return (
    <section className="w-full bg-white px-4 py-20 font-sans dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center"
        >
          <h2 className="mb-3 text-4xl font-bold tracking-tight text-zinc-950 dark:text-white md:text-5xl">
            Measurable <span className="text-emerald-500">savings</span> from
            day one
          </h2>
          <p className="text-[15px] text-zinc-500 dark:text-zinc-400">
            Find new efficiencies and cut your cloud bill with all CAST AI
            plans.
          </p>
        </motion.div>

        {/* Cards — flush grid, no gap */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        >
          {plans.map((plan, i) => (
            <PricingCard
              key={plan.title}
              plan={plan}
              isLast={i === plans.length - 1}
            />
          ))}
        </motion.div>

        {/* Compare button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          className="flex justify-center mt-8"
        >
          <button className="cursor-pointer rounded-full border border-zinc-300 bg-white px-6 py-2.5 text-[13px] font-medium text-zinc-700 transition-colors duration-200 hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-white">
            Compare all features
          </button>
        </motion.div>
      </div>
    </section>
  );
}
