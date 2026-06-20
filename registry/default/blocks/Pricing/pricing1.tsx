"use client";

import { useState } from "react";
import { motion, AnimatePresence , Variants } from "framer-motion";
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
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 bg-white"
      style={{ fontFamily: "var(--font-geist-sans, 'Inter', sans-serif)" }}
    >
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-10 max-w-2xl"
      >
        <h1 className="text-4xl md:text-5xl text-black leading-tight tracking-tight">
          Choose <span className="font-bold">The Plan</span> That&apos;s Right
          For Your Investment Goals!
        </h1>
      </motion.div>

      {/* Toggle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.35 }}
        className="flex items-center gap-3 mb-14 px-4 py-1.5 rounded-full border border-black/10 bg-white shadow-sm"
      >
        <span
          onClick={() => setAnnual(false)}
          className="text-sm cursor-pointer select-none transition-colors"
          style={{
            color: !annual ? "#000" : "#999",
            fontWeight: !annual ? 600 : 400,
          }}
        >
          Monthly
        </span>

        <button
          onClick={() => setAnnual((v) => !v)}
          className="relative w-10 h-5 rounded-full focus:outline-none transition-colors duration-300 cursor-pointer"
          style={{ background: annual ? "#000" : "#D1D1D1" }}
          aria-label="Toggle billing"
        >
          <motion.span
            layout
            transition={{ type: "spring", stiffness: 700, damping: 38 }}
            className="absolute top-0.5 w-4 h-4 rounded-full bg-white"
            style={{ left: annual ? "calc(100% - 18px)" : "2px" }}
          />
        </button>

        <span
          onClick={() => setAnnual(true)}
          className="text-sm cursor-pointer select-none transition-colors"
          style={{
            color: annual ? "#000" : "#999",
            fontWeight: annual ? 600 : 400,
          }}
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
            className="rounded-2xl p-7 flex flex-col relative"
            style={{
              background: plan.dark ? "#000" : "#fff",
              border: plan.dark ? "1.5px solid #000" : "1.5px solid #E5E5E5",
              transform: plan.highlight ? "translateY(-14px)" : "translateY(0)",
              boxShadow: plan.dark
                ? "0 12px 40px rgba(0,0,0,0.20)"
                : "0 2px 16px rgba(0,0,0,0.05)",
              transition: "box-shadow 0.25s",
            }}
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
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-semibold"
                style={{
                  background: plan.dark ? "#1A1A1A" : "#F4F4F4",
                  color: plan.dark ? "#fff" : "#000",
                }}
              >
                {plan.icon}
              </span>
              <span
                className="text-sm font-semibold"
                style={{ color: plan.dark ? "#fff" : "#000" }}
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
                  className="text-5xl font-bold leading-none tracking-tight"
                  style={{ color: plan.dark ? "#fff" : "#000" }}
                >
                  ${annual ? plan.annualPrice : plan.monthlyPrice}
                </motion.span>
              </AnimatePresence>
              <span
                className="text-xs mb-1.5"
                style={{ color: plan.dark ? "#888" : "#888" }}
              >
                / Month
              </span>
            </div>

            {/* Description */}
            <p
              className="text-xs leading-relaxed mb-6"
              style={{ color: plan.dark ? "#888" : "#666" }}
            >
              {plan.description}
            </p>

            {/* Divider */}
            <div
              className="w-full h-px mb-6"
              style={{ background: plan.dark ? "#222" : "#F0F0F0" }}
            />

            {/* Features */}
            <ul className="flex flex-col gap-3 mb-8 flex-1">
              {plan.features.map((f, i) => (
                <motion.li
                  key={f}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.3 }}
                  className="flex items-start gap-2.5 text-xs"
                  style={{ color: plan.dark ? "#ccc" : "#333" }}
                >
                  <span
                    className="mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{
                      background: plan.dark ? "#1A1A1A" : "#F4F4F4",
                    }}
                  >
                    <Check
                      size={9}
                      strokeWidth={2.5}
                      style={{ color: plan.dark ? "#fff" : "#000" }}
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
              className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              style={
                plan.id === "starter"
                  ? { background: "#000", color: "#fff" }
                  : plan.dark
                    ? { background: "#fff", color: "#000" }
                    : {
                        background: "#F4F4F4",
                        color: "#000",
                        border: "1px solid #E5E5E5",
                      }
              }
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
