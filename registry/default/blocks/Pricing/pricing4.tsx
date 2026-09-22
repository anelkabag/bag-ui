"use client";

import React, { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import NumberFlow from "@number-flow/react";
import { Check, Star, Workflow, Sparkles, Phone, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ================================================================== */
/*  Types & data                                                       */
/* ================================================================== */

type Billing = "monthly" | "annually";

type Plan = {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  featuresIntro: string;
  features: string[];
  cta: string;
  popular?: boolean;
};

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter Automation",
    description: "For small teams beginning their journey",
    monthlyPrice: 499,
    featuresIntro: "What's included:",
    features: ["Workflow setup (1–3 systems)", "Basic AI chatbot", "CRM integration"],
    cta: "Get Starter Package",
  },
  {
    id: "growth",
    name: "Growth Automation",
    description: "For scaling businesses",
    monthlyPrice: 1199,
    featuresIntro: "Included everything in Starter, plus:",
    features: ["Advanced workflow automation", "Multi-channel AI chatbot", "Sales & marketing automation", "Dashboard & reporting"],
    cta: "Get Growth Package",
    popular: true,
  },
];

const ANNUAL_DISCOUNT = 0.1;

/* ================================================================== */
/*  Helpers                                                             */
/* ================================================================== */

function priceFor(plan: Plan, billing: Billing) {
  const value = billing === "annually" ? plan.monthlyPrice * (1 - ANNUAL_DISCOUNT) : plan.monthlyPrice;
  return Math.round(value * 100) / 100;
}

/* ================================================================== */
/*  Small atoms                                                        */
/* ================================================================== */

function Toast({ message }: { message: string | null }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="pointer-events-auto rounded-full bg-neutral-900 px-4 py-2.5 text-[13px] font-medium text-white shadow-lg"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EyebrowBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
      <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
      Pricing
    </span>
  );
}

function BillingToggle({ billing, onChange }: { billing: Billing; onChange: (b: Billing) => void }) {
  const annual = billing === "annually";
  return (
    <div className="inline-flex items-center gap-3">
      <button
        onClick={() => onChange("monthly")}
        className={cn("text-[13.5px] transition-colors", !annual ? "font-semibold text-neutral-900" : "text-neutral-400 hover:text-neutral-600 cursor-pointer")}
      >
        Monthly
      </button>
      <button
        role="switch"
        aria-checked={annual}
        onClick={() => onChange(annual ? "monthly" : "annually")}
        className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200", annual ? "bg-neutral-900" : "bg-neutral-200")}
      >
        <motion.span
          className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm"
          animate={{ x: annual ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
        />
      </button>
      <button
        onClick={() => onChange("annually")}
        className={cn("text-[13.5px] transition-colors", annual ? "font-semibold text-neutral-900" : "text-neutral-400 hover:text-neutral-600")}
      >
        Annually <span className={cn(annual ? "text-emerald-600" : "text-neutral-400")}>(Save 10%)</span>
      </button>
    </div>
  );
}

function AnimatedPrice({ plan, billing }: { plan: Plan; billing: Billing }) {
  return (
    <div className="flex flex-wrap items-end gap-x-1">
      <NumberFlow
        value={priceFor(plan, billing)}
        prefix="$"
        format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
        transformTiming={{ duration: 1200, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        spinTiming={{ duration: 1200, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        opacityTiming={{ duration: 450, easing: "ease-out" }}
        willChange
        className="text-[46px] font-bold leading-none tracking-tight text-neutral-900"
      />
      <span className="mb-1.5 text-[13px] text-neutral-400">/Month</span>
    </div>
  );
}

/* ================================================================== */
/*  Pricing card                                                       */
/* ================================================================== */

function PricingCard({ plan, billing, onSelect }: { plan: Plan; billing: Billing; onSelect: (plan: Plan) => void }) {
  const annual = billing === "annually";
  const yearlySavings = Math.round(plan.monthlyPrice * 12 * ANNUAL_DISCOUNT);

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn(
        "flex flex-col rounded-[26px] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
        plan.popular && "ring-1 ring-neutral-900/5"
      )}
    >
      <div className="mb-5 flex items-center justify-between">
        {plan.popular ? (
          <motion.span
            whileHover={{ rotate: 12, scale: 1.06 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 via-pink-400 to-sky-400"
          >
            <Sparkles className="h-4 w-4 text-white" />
          </motion.span>
        ) : (
          <motion.span
            whileHover={{ rotate: 12, scale: 1.06 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900"
          >
            <Workflow className="h-4 w-4 text-white" />
          </motion.span>
        )}
        {plan.popular && (
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.15 }}
            className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-600 shadow-sm"
          >
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            Most Popular
          </motion.span>
        )}
      </div>

      <h3 className="text-[15px] font-semibold text-neutral-900">{plan.name}</h3>
      <p className="mt-1 text-[13px] text-neutral-500">{plan.description}</p>

      <div className="mt-5">
        <AnimatedPrice plan={plan} billing={billing} />
        <AnimatePresence>
          {annual && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-1 text-[12px] text-emerald-600"
            >
              Billed annually · save ${yearlySavings}/year
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex-1">
        <p className="text-[12.5px] font-medium text-neutral-500">{plan.featuresIntro}</p>
        <ul className="mt-2.5 flex flex-col gap-2">
          {plan.features.map((feature, i) => (
            <motion.li
              key={feature}
              initial={{ opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: 0.05 * i }}
              className="flex items-start gap-2 text-[13px] text-neutral-700"
            >
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-400" />
              {feature}
            </motion.li>
          ))}
        </ul>
      </div>

      <motion.button
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelect(plan)}
        className="mt-6 rounded-full bg-neutral-900 py-3 text-[13.5px] font-medium text-white transition-colors hover:bg-neutral-800"
      >
        {plan.cta}
      </motion.button>
    </motion.div>
  );
}

/* ================================================================== */
/*  Consultation banner                                                */
/* ================================================================== */

function ConsultationBanner({ onBook }: { onBook: () => void }) {
  return (
    <div
      className="relative mt-4 overflow-hidden rounded-[28px] px-6 py-9 text-center"
      style={{
        backgroundImage:
          "radial-gradient(circle at 15% 20%, rgba(196,181,253,0.55), transparent 55%), radial-gradient(circle at 85% 15%, rgba(253,186,232,0.5), transparent 55%), radial-gradient(circle at 20% 90%, rgba(254,240,138,0.5), transparent 55%), radial-gradient(circle at 85% 85%, rgba(125,211,252,0.5), transparent 55%), radial-gradient(circle at 50% 50%, rgba(190,242,220,0.4), transparent 60%)",
        backgroundColor: "#fafafa",
      }}
    >
      <div className="relative mx-auto flex w-fit items-center justify-center">
        <img
          src="https://api.dicebear.com/9.x/notionists/svg?seed=Amelia-Rhodes&backgroundColor=ffd5dc"
          alt=""
          className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-sm"
        />
        <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 ring-2 ring-white">
          <Phone className="h-3 w-3 text-white" />
        </span>
      </div>

      <h3 className="mt-4 text-[16px] font-semibold text-neutral-900">Not sure which plan is right for you?</h3>
      <p className="mt-1 text-[13px] text-neutral-600">Book a free 30-minute AI strategy session.</p>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onBook}
        className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-5 py-2.5 text-[13.5px] font-medium text-white transition-colors hover:bg-neutral-800"
      >
        Book a Free Consultation
        <ArrowRight className="h-3.5 w-3.5" />
      </motion.button>
    </div>
  );
}

/* ================================================================== */
/*  Root                                                                */
/* ================================================================== */

export default function Pricing4() {
  const prefersReduced = useReducedMotion();
  const [billing, setBilling] = useState<Billing>("monthly");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pushToast = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: prefersReduced ? 0 : 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, delay },
  });

  return (
    <section className="w-full bg-white px-6 py-20">
      <div className="mx-auto w-[60vw] max-w-none text-center">
        <motion.div {...fadeUp(0)} className="flex justify-center">
          <EyebrowBadge />
        </motion.div>

        <motion.h1 {...fadeUp(0.05)} className="mt-4 text-[30px] font-bold leading-tight tracking-tight text-neutral-900">
          Built for Growth at Every Stage
        </motion.h1>

        <motion.p {...fadeUp(0.1)} className="mx-auto mt-2.5 max-w-[320px] text-[13.5px] leading-relaxed text-neutral-500">
          Whether you're starting small or scaling fast, we have an automation plan that fits.
        </motion.p>

        <motion.div {...fadeUp(0.15)} className="mt-6 flex justify-center">
          <BillingToggle billing={billing} onChange={setBilling} />
        </motion.div>
      </div>

      <motion.div {...fadeUp(0.2)} className="mx-auto mt-8 w-[60vw] max-w-none">
        <div className="rounded-[32px] bg-neutral-100 p-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {PLANS.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                billing={billing}
                onSelect={(p) => pushToast(`"${p.cta}" — connect this to your checkout flow.`)}
              />
            ))}
          </div>
        </div>

        <div className="mt-4">
          <ConsultationBanner onBook={() => pushToast("This is a demo — connect this to your booking flow.")} />
        </div>
      </motion.div>

      <Toast message={toast} />
    </section>
  );
}