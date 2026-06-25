"use client";

import { motion, Variants } from "framer-motion";
import { Check, Mail, Send } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface PricingPlan {
  title: string;
  description: string;
  price: string;
  priceLabel: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const plans: PricingPlan[] = [
  {
    title: "Landing Page",
    description:
      "Ideal for designing or redesigning website to double your conversion rates",
    price: "$1200",
    priceLabel: "Fixed Price",
    features: [
      "7-14 Days turnaround time",
      "1-4 Unique pages",
      "Conversion-focused layout",
      "Responsive Design Desktop, Tablet, Mobile",
      "5/7 Communication via Slack, Telegram & Loom",
      "No-code development (Framer)",
      "50/25/25 Secure payment",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    title: "MVP Launch Kit",
    description:
      "Full App MVP (20-40 screens) Including Website (design + no-code development) with 10+ unique pages.",
    price: "$4000",
    priceLabel: "Fixed Price",
    features: [
      "Product Design",
      "Predefined scope of work (SOW)",
      "Updates every 48 hours",
      "No-code development (Framer)",
      "50/25/25 Secure payment",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    title: "Custom",
    description:
      "Seeking a different scope of work? We're offering a variety of other design services.",
    price: "Starting at $500 min",
    priceLabel: "",
    features: [
      "Landing Page",
      "Mobile app",
      "Web app",
      "No-code development (Framer)",
      "50/25/25 Secure payment",
    ],
    cta: "Request Quote",
    highlighted: true,
  },
];

// ─── Animation variants ───────────────────────────────────────────────────────

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
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

const featureVariants: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: "easeOut" },
  }),
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function PricingCard({ plan, index }: { plan: PricingPlan; index: number }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`
        relative flex flex-col rounded-2xl p-2 
        ${
          plan.highlighted
            ? "bg-zinc-950 border border-zinc-700 text-white"
            : "bg-white border border-zinc-200 text-zinc-900"
        }
      `}
    >
      {/* Header */}
      <div
          className={`mb-5 p-3 rounded-md ${
              plan.highlighted
                  ? "bg-zinc-900/50 border border-zinc-800"
                  : "bg-gray-100"
          }`}
      >
        <h3
            className={`text-xl font-semibold tracking-tight mb-2 ${
                plan.highlighted ? "text-white" : "text-zinc-900"
            }`}
        >
          {plan.title}
        </h3>

        <p
            className={`text-sm leading-relaxed ${
                plan.highlighted ? "text-zinc-400" : "text-zinc-500"
            }`}
        >
          {plan.description}
        </p>

        {/* Price */}
        <div className="mt-6">
          <p
              className={`text-2xl font-bold tracking-tight ${
                  plan.highlighted ? "text-white" : "text-zinc-900"
              }`}
          >
            {plan.price}
            {plan.priceLabel && (
                <span
                    className={`text-sm font-normal ml-2 ${
                        plan.highlighted ? "text-zinc-400" : "text-zinc-500"
                    }`}
                >
              / {plan.priceLabel}
            </span>
            )}
          </p>
        </div>
      </div>


      {/* Divider */}
      <div
        className={`h-px mb-5 ${
          plan.highlighted ? "bg-zinc-800" : "bg-zinc-100"
        }`}
      />

      {/* Features */}
      <ul className="flex flex-col gap-3 flex-1 mb-8">
        {plan.features.map((feat, i) => (
          <motion.li
            key={feat}
            custom={i}
            variants={featureVariants}
            className="flex items-start gap-2.5"
          >
            <Check
              size={15}
              className={`mt-0.5 shrink-0 ${
                plan.highlighted ? "text-zinc-300" : "text-zinc-700"
              }`}
            />
            <span
              className={`text-sm ${
                plan.highlighted ? "text-zinc-300" : "text-zinc-600"
              }`}
            >
              {feat}
            </span>
          </motion.li>
        ))}
      </ul>

      {/* CTA */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          w-full rounded-xl py-3 text-sm font-semibold tracking-wide transition-colors duration-200 cursor-pointer
          ${
            plan.highlighted
              ? "bg-white text-zinc-950 hover:bg-zinc-100"
              : "bg-zinc-950 text-white hover:bg-zinc-800"
          }
        `}
      >
        {plan.cta}
      </motion.button>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function PricingSection() {
  return (
    <section className="w-full bg-zinc-50 py-20 px-4 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-3">
            Pricing &amp; Plan
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-950">
            No Contract, No Surprises
          </h2>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {plans.map((plan, i) => (
            <PricingCard key={plan.title} plan={plan} index={i} />
          ))}
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.3, ease: "easeOut" }}
          className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-zinc-200 rounded-2xl px-7 py-5"
        >
          <p className="text-sm font-semibold text-zinc-900">
            Didn't find the answer?
          </p>
          <div className="flex items-center gap-6">
            <motion.a
              href="mailto:anelka.bag@gmail.com"
              whileHover={{ scale: 1.04 }}
              className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              <Mail size={15} />
              Email us
            </motion.a>
            <motion.a
              href="https://t.me/@anelkabag"
              whileHover={{ scale: 1.04 }}
              className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              <Send size={15} />
              Chat on Telegram
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
