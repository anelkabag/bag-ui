"use client";

import { useState } from "react";
import { motion, AnimatePresence , Variants } from "motion/react";
import { Check } from "lucide-react";

const plans = [
  {
    id: "starter",
    icon: "⌘",
    name: "Starter",
    monthlyPrice: 0,
    annualPrice: 0,
    description:
      "Ideal for new investors or those with smaller portfolios. Offers essential features and tools to get started.",
    features: [
      "Market data and news",
      "Basic portfolio tracking",
      "Access to educational resources",
      "Limited customer support",
    ],
    cta: "Register For Free!",
    highlight: false,
    dark: false,
  },
  {
    id: "professional",
    icon: "◇",
    name: "Professional",
    monthlyPrice: 59,
    annualPrice: 49,
    description:
      "A comprehensive plan for investors seeking more advanced features and Olixer AI Assistant.",
    features: [
      "All features from the Starter plan",
      "Advanced portfolio analysis",
      "Personalized investment recommendations",
      "Priority customer support",
      "Access to a community of investors",
      "Olixer AI Assistant",
    ],
    cta: "Get Started",
    highlight: true,
    dark: true,
  },
  {
    id: "genius",
    icon: "⊕",
    name: "Genius",
    monthlyPrice: 299,
    annualPrice: 249,
    description:
      "Tailored for experienced investors and companies with complex portfolios and high-level needs.",
    features: [
      "All features from the Professional plan",
      "Exclusive access to investment research & analysis",
      "Private personal letter news",
      "Personalized wealth management services",
      "Dedicated account manager",
      "Access to exclusive investment opportunities",
      "Exclusive company Investing Account",
    ],
    cta: "Get Started",
    highlight: false,
    dark: false,
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section
      className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-4 py-24 dark:bg-neutral-950"
      style={{ fontFamily: "var(--font-geist-sans, 'Inter', sans-serif)" }}
    >
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-10 max-w-2xl"
      >
        <h1 className="text-4xl md:text-5xl leading-tight tracking-tight text-neutral-950 dark:text-white">
          Choose <span className="font-bold">The Plan</span> That&apos;s Right
          For Your Investment Goals!
        </h1>
      </motion.div>

      {/* Toggle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.35 }}
        className="mb-14 flex items-center gap-3 rounded-full border border-neutral-200 bg-white px-4 py-1.5 shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
      >
        <span
          onClick={() => setAnnual(false)}
          className={`cursor-pointer select-none text-sm transition-colors ${
            !annual
              ? "font-semibold text-neutral-950 dark:text-white"
              : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
          }`}
        >
          Monthly
        </span>

        <button
          onClick={() => setAnnual((v) => !v)}
          className={`relative h-5 w-10 cursor-pointer rounded-full transition-colors duration-300 focus:outline-none ${
            annual ? "bg-neutral-950 dark:bg-white" : "bg-neutral-300 dark:bg-neutral-700"
          }`}
          aria-label="Toggle billing"
        >
          <motion.span
            layout
            transition={{ type: "spring", stiffness: 700, damping: 38 }}
            className="absolute top-0.5 h-4 w-4 rounded-full bg-white dark:bg-neutral-950"
            style={{ left: annual ? "calc(100% - 18px)" : "2px" }}
          />
        </button>

        <span
          onClick={() => setAnnual(true)}
          className={`cursor-pointer select-none text-sm transition-colors ${
            annual
              ? "font-semibold text-neutral-950 dark:text-white"
              : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
          }`}
        >
          Annually
        </span>

        <AnimatePresence>
          {annual && (
            <motion.span
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-200 border border-green-300 text-green-600 ml-0.5"
            >
              −17%
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
      >
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            variants={cardVariants}
            whileHover={{
              y: plan.highlight ? -14 : -6,
              boxShadow: plan.dark
                ? "0 20px 50px rgba(0,0,0,0.30)"
                : "0 12px 36px rgba(0,0,0,0.10)",
            }}
            style={{
              transform: plan.highlight ? "translateY(-14px)" : "translateY(0)",
              transition: "box-shadow 0.25s",
            }}
            className={`relative flex flex-col rounded-2xl border p-7 ${
              plan.dark
                ? "border-neutral-950 bg-neutral-950 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-950"
                : "border-neutral-200 bg-white text-neutral-950 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
            }`}
          >
            {/* Badge */}
            {plan.highlight && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[10px] font-bold px-3 py-0.5 rounded-full bg-green-100 border border-green-300 text-green-600 tracking-widest uppercase"
              >
                Most Popular
              </motion.div>
            )}

            {/* Icon + Name */}
            <div className="flex items-center gap-2 mb-5">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-lg text-sm font-semibold ${
                  plan.dark
                    ? "bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-950"
                    : "bg-neutral-100 text-neutral-950 dark:bg-neutral-800 dark:text-white"
                }`}
              >
                {plan.icon}
              </span>
              <span
                className={`text-sm font-semibold ${plan.dark ? "text-white dark:text-neutral-950" : "text-neutral-950 dark:text-white"}`}
              >
                {plan.name}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-1 mb-2">
              <AnimatePresence mode="wait">
                <motion.span
                  key={annual ? "ann" : "mo"}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className={`text-5xl font-bold leading-none tracking-tight ${plan.dark ? "text-white dark:text-neutral-950" : "text-neutral-950 dark:text-white"}`}
                >
                  ${annual ? plan.annualPrice : plan.monthlyPrice}
                </motion.span>
              </AnimatePresence>
              <span
                className={`mb-1.5 text-xs ${plan.dark ? "text-neutral-400 dark:text-neutral-600" : "text-neutral-500 dark:text-neutral-400"}`}
              >
                / Month
              </span>
            </div>

            {/* Description */}
            <p
              className={`mb-6 text-xs leading-relaxed ${plan.dark ? "text-neutral-400 dark:text-neutral-600" : "text-neutral-600 dark:text-neutral-400"}`}
            >
              {plan.description}
            </p>

            {/* Divider */}
            <div
              className={`mb-6 h-px w-full ${plan.dark ? "bg-neutral-800 dark:bg-neutral-300" : "bg-neutral-100 dark:bg-neutral-800"}`}
            />

            {/* Features */}
            <ul className="flex flex-col gap-3 mb-8 flex-1">
              {plan.features.map((f, i) => (
                <motion.li
                  key={f}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.3 }}
                  className={`flex items-start gap-2.5 text-xs ${plan.dark ? "text-neutral-300 dark:text-neutral-700" : "text-neutral-700 dark:text-neutral-300"}`}
                >
                  <span
                    className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full ${
                      plan.dark ? "bg-neutral-800 dark:bg-neutral-200" : "bg-neutral-100 dark:bg-neutral-800"
                    }`}
                  >
                    <Check
                      size={9}
                      strokeWidth={2.5}
                      className={plan.dark ? "text-white dark:text-neutral-950" : "text-neutral-950 dark:text-white"}
                    />
                  </span>
                  {f}
                </motion.li>
              ))}
            </ul>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={`flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-semibold transition-colors ${
                plan.id === "starter"
                  ? "bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
                  : plan.dark
                    ? "bg-white text-neutral-950 hover:bg-neutral-100 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-800"
                    : "border border-neutral-200 bg-neutral-100 text-neutral-950 hover:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
              }`}
            >
              {plan.cta}
              {plan.id !== "starter" && (
                <span className="text-base leading-none">›</span>
              )}
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
