"use client";

import { motion } from "framer-motion";
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
      <span className="text-[36px] font-medium tracking-[-0.04em] text-zinc-950 leading-none">
        {amount}
      </span>

      <div className="flex flex-col ml-1 mt-[2px]">
        <span className="text-[12px] leading-[1.1] text-zinc-500">per</span>
        <span className="text-[12px] leading-[1.1] text-zinc-500">
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
        flex flex-col bg-white p-6
        border-t border-b border-l border-zinc-200
        ${isLast ? "border-r border-zinc-200" : ""}
      `}
    >
      {/* Title + badge */}
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-[15px] font-semibold text-zinc-900">
          {plan.title}
        </h3>
        {plan.badge && (
          <span className="text-[10px] font-medium text-zinc-500 border border-zinc-300 rounded-full px-2 py-0.5 leading-none">
            {plan.badge}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-[13px] text-zinc-500 leading-snug mb-5 min-h-[40px]">
        {plan.description}
      </p>

      {/* Price row */}
      <div className="flex items-center gap-2 mb-5">
        <PriceBlock amount={plan.basePrice} period="month" />
        {plan.extraPrice && (
          <>
            <span className="text-zinc-300 text-xl font-light leading-none mt-1">
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
            <span className="font-bold text-zinc-900">{plan.cpuBold}</span>{" "}
            {plan.cpuLabel}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-zinc-500">
          <Cloud size={13} className="text-zinc-400 shrink-0" />
          <span>
            {plan.clusterBold === "Unlimited" ? (
              <>
                <span className="font-bold text-zinc-900">Unlimited</span>{" "}
                {plan.clusterLabel}
              </>
            ) : (
              <>
                Up to{" "}
                <span className="font-bold text-zinc-900">
                  {plan.clusterBold}
                </span>{" "}
                {plan.clusterLabel}
              </>
            )}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-zinc-100 mb-4" />

      {/* Features */}
      <p className="text-[12px] font-bold text-zinc-900 mb-3">
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
            <span className="text-[13px] text-zinc-600">{feat}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function PricingSection2() {
  return (
    <section className="w-full py-20 px-4 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-950 mb-3">
            Measurable <span className="text-emerald-500">savings</span> from
            day one
          </h2>
          <p className="text-[15px] text-zinc-500">
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
          <button className="border border-zinc-300 bg-white text-zinc-700 text-[13px] font-medium px-6 py-2.5 rounded-full hover:border-zinc-400 hover:text-zinc-900 transition-colors duration-200 cursor-pointer">
            Compare all features
          </button>
        </motion.div>
      </div>
    </section>
  );
}
